#!/usr/bin/env npx tsx
/**
 * Sync transfers from dashboard-limosen D1 to api.limosen.at D1.
 *
 * Fetches all journeys from the dashboard-limosen API, maps them to the
 * api.limosen.at Prisma Transfer schema, and inserts them via
 * `wrangler d1 execute` in batches.
 *
 * Usage: npx tsx scripts/sync-from-dashboard.ts
 */
import { execSync } from 'child_process'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'

const DASHBOARD_URL = 'https://dashboard-limosen.netsnek.workers.dev'
const DASHBOARD_USER = 'limosen'
const DASHBOARD_PASS = 'Ankara.1991'
const D1_DB_NAME = 'limosen-mock'
const BATCH_SIZE = 500
const PAGE_SIZE = 500
// Use the website customer ID as the default customer for imported transfers
const DEFAULT_CUSTOMER_ID = '353193892645967483'

const AUTH = Buffer.from(`${DASHBOARD_USER}:${DASHBOARD_PASS}`).toString('base64')

interface Journey {
  code: string
  status: string
  fromTitle: string
  toTitle: string
  date: string  // YYYY-MM-DD
  time: string  // HH:mm
  pax: number
  bags: number
  flight: string | null
  driver: string
  driverPhone: string | null
  vehicle: { model: string; plate: string }
  fare: string  // e.g. "€ 37.00"
  traveller: { name: string; phone: string }
  category: string
  comments: string
  extras: Array<{ type: string; amount: number }>
  driverCode: string
}

function mapStatus(s: string): string {
  switch (s) {
    case 'Completed': return 'COMPLETED'
    case 'In Progress': return 'ONGOING'
    case 'Cancelled': return 'CANCELED'
    case 'Planned':
    default: return 'PENDING'
  }
}

function parseFare(fare: string): number | null {
  // "€ 37.00" -> 37.00
  const m = fare.match(/[\d.]+/)
  if (m) {
    const n = parseFloat(m[0])
    return isNaN(n) || n === 0 ? null : n
  }
  return null
}

function esc(s: string | null | undefined): string {
  if (s == null) return 'NULL'
  return "'" + String(s).replace(/'/g, "''") + "'"
}

function toISO(date: string, time: string): string {
  // date = "2026-12-11", time = "10:20"
  return `${date}T${time}:00.000Z`
}

async function fetchJourneys(offset: number, limit: number): Promise<{ journeys: Journey[]; total: number }> {
  const url = `${DASHBOARD_URL}/api/journeys?limit=${limit}&offset=${offset}`
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${AUTH}` }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  return res.json() as any
}

async function main() {
  console.log('=== Sync transfers from dashboard-limosen ===')

  // Step 1: Ensure default customer exists
  console.log(`Ensuring default customer ${DEFAULT_CUSTOMER_ID} exists...`)
  const ensureCustomerSQL = `INSERT OR IGNORE INTO CustomerData (id, userId, createdAt, updatedAt) VALUES ('data:customer:website', '${DEFAULT_CUSTOMER_ID}', datetime('now'), datetime('now'));`
  const tmpEnsure = join(__dirname, '_ensure_customer.sql')
  writeFileSync(tmpEnsure, ensureCustomerSQL)
  try {
    execSync(`npx wrangler d1 execute ${D1_DB_NAME} --remote --file=${tmpEnsure}`, { stdio: 'inherit', cwd: join(__dirname, '..') })
  } catch (e) {
    console.warn('Warning: ensure customer failed (may already exist):', (e as Error).message)
  }
  try { unlinkSync(tmpEnsure) } catch {}

  // Step 2: Fetch total count
  const { total } = await fetchJourneys(0, 1)
  console.log(`Total journeys in dashboard: ${total}`)

  // Step 3: Check existing transfers to avoid duplicates
  console.log('Checking existing transfer count...')
  try {
    const result = execSync(
      `npx wrangler d1 execute ${D1_DB_NAME} --remote --command="SELECT COUNT(*) as cnt FROM Transfer WHERE id LIKE 'transfer:legacy:%'"`,
      { cwd: join(__dirname, '..'), encoding: 'utf-8' }
    )
    console.log('Existing legacy transfers:', result.trim())
  } catch {}

  // Step 4: Fetch all journeys and generate SQL
  let allJourneys: Journey[] = []
  for (let offset = 0; offset < total; offset += PAGE_SIZE) {
    const pct = Math.round((offset / total) * 100)
    process.stdout.write(`\rFetching journeys: ${offset}/${total} (${pct}%)...`)
    const { journeys } = await fetchJourneys(offset, PAGE_SIZE)
    allJourneys.push(...journeys)
  }
  console.log(`\nFetched ${allJourneys.length} journeys.`)

  // Deduplicate by code
  const seen = new Set<string>()
  const uniqueJourneys = allJourneys.filter(j => {
    if (seen.has(j.code)) return false
    seen.add(j.code)
    return true
  })
  console.log(`Unique journeys: ${uniqueJourneys.length}`)

  // Step 5: Generate SQL INSERT statements in batches
  let batchNum = 0
  for (let i = 0; i < uniqueJourneys.length; i += BATCH_SIZE) {
    const batch = uniqueJourneys.slice(i, i + BATCH_SIZE)
    batchNum++
    const pct = Math.round((i / uniqueJourneys.length) * 100)
    process.stdout.write(`\rInserting batch ${batchNum} (${i}/${uniqueJourneys.length}, ${pct}%)...`)

    const statements: string[] = []
    for (const j of batch) {
      const id = `transfer:legacy:${j.code}`
      const pickupDT = toISO(j.date, j.time)
      const state = mapStatus(j.status)
      const price = parseFare(j.fare)
      const subject = j.traveller.name !== '-' ? j.traveller.name : null

      statements.push(
        `INSERT OR IGNORE INTO Transfer (id, customerId, driverId, startDateTime, pickupDateTime, endDateTime, pickupLocation, dropoffLocation, subject, price, paymentMethode, payingParty, transferCategory, transferType, state, requestedAt, carId, referenceId) VALUES (${esc(id)}, ${esc(DEFAULT_CUSTOMER_ID)}, NULL, NULL, ${esc(pickupDT)}, NULL, ${esc(j.fromTitle)}, ${esc(j.toTitle)}, ${esc(subject)}, ${price ?? 'NULL'}, NULL, 'CUSTOMER', 'DISTANCE', 'ONE_WAY', ${esc(state)}, datetime('now'), NULL, NULL);`
      )

      // Insert transfer details (flight, comments)
      if (j.flight || (j.comments && j.comments !== '-')) {
        statements.push(
          `INSERT OR IGNORE INTO TransferDetails (transferId, flightNumber, message, luggage, childSeats, extraTime, preferredCarClass, preferredCarName) VALUES (${esc(id)}, ${esc(j.flight)}, ${esc(j.comments !== '-' ? j.comments : null)}, ${esc(j.bags > 0 ? String(j.bags) : null)}, NULL, NULL, NULL, NULL);`
        )
      }

      // Insert passengers (traveller as first passenger)
      if (j.traveller.name !== '-') {
        const parts = j.traveller.name.split(' ')
        const firstName = parts[0] || null
        const lastName = parts.slice(1).join(' ') || null
        const passId = `pass:legacy:${j.code}:0`
        statements.push(
          `INSERT OR IGNORE INTO Passenger (id, transferId, firstName, lastName, email, phone, language) VALUES (${esc(passId)}, ${esc(id)}, ${esc(firstName)}, ${esc(lastName)}, NULL, ${esc(j.traveller.phone !== '-' ? j.traveller.phone : null)}, NULL);`
        )
      }
    }

    // Write batch to temp SQL file and execute
    const tmpFile = join(__dirname, `_sync_batch_${batchNum}.sql`)
    writeFileSync(tmpFile, statements.join('\n'))
    try {
      execSync(`npx wrangler d1 execute ${D1_DB_NAME} --remote --file=${tmpFile}`, {
        stdio: 'pipe',
        cwd: join(__dirname, '..'),
        timeout: 60000
      })
    } catch (e) {
      console.error(`\nBatch ${batchNum} failed:`, (e as Error).message?.slice(0, 200))
    }
    try { unlinkSync(tmpFile) } catch {}
  }

  console.log(`\nDone! Inserted up to ${uniqueJourneys.length} transfers.`)

  // Step 6: Verify count
  try {
    const result = execSync(
      `npx wrangler d1 execute ${D1_DB_NAME} --remote --command="SELECT COUNT(*) as cnt FROM Transfer"`,
      { cwd: join(__dirname, '..'), encoding: 'utf-8' }
    )
    console.log('Total transfers now:', result.trim())
  } catch {}
}

main().catch(e => { console.error(e); process.exit(1) })
