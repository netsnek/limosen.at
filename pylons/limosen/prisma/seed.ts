import fs from 'fs'
import path from 'path'
import {
  PrismaClient,
  TransferState,
  TransferCategory,
  TransferType,
  CarClass
} from '@prisma/client'

type PayingParty = 'CUSTOMER' | 'PASSENGER'
enum PaymentMethode {
  CASH = 'CASH',
  CARD = 'CARD',
  VOUCHER = 'VOUCHER',
  INVOICE = 'INVOICE'
}

type LegacyRow = Record<string, unknown>

type CustomerSeed = {
  id: string
  userId: string
  createdAtISO: string
  updatedAtISO: string
}

type TransferDetailsSeed = {
  transferId: string
  flightNumber: string | null
  message: string | null
  luggage: string | null
  childSeats: string | null
  extraTime: string | null
  preferredCarClass: CarClass | null
  preferredCarName: string | null
}

type PassengerSeed = {
  id: string
  transferId: string
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  language: string | null
}

type TransferSeed = {
  id: string
  customerId: string
  driverId: string | null
  startDateTimeISO: string | null
  pickupDateTimeISO: string
  endDateTimeISO: string | null
  pickupLocation: string
  dropoffLocation: string
  subject: string | null
  price: number | null
  paymentMethode: PaymentMethode | null
  payingParty: PayingParty
  transferCategory: TransferCategory
  transferType: TransferType
  state: TransferState
  requestedAtISO: string
  carId: string | null
  details?: TransferDetailsSeed | null
  passenger?: PassengerSeed | null
}

type SeedSqlOptions = {
  wrapTransaction?: boolean
  maxRows?: number
  maxChars?: number
}

type SeedData = {
  customers: CustomerSeed[]
  transfers: TransferSeed[]
}

const DEFAULT_SQL_CANDIDATES = [
  process.env.ISLEMLER_SQL,
  path.resolve(process.cwd(), 'prisma', 'islemler.sql'),
  path.resolve(process.cwd(), 'islemler.sql'),
  'C:\\Users\\archer\\Downloads\\islemler.sql'
].filter(Boolean) as string[]

function clean(value: unknown): string | null {
  const s = typeof value === 'string' ? value.trim() : ''
  return s.length ? s : null
}

function normalizeDateTimeString(raw: unknown): string | null {
  const s = clean(raw)
  if (!s) return null
  const iso = s.includes('T') ? s : s.replace(' ', 'T')
  const dt = new Date(iso)
  if (Number.isNaN(dt.getTime())) return null
  return iso
}

function combineDateTime(dateRaw: unknown, timeRaw: unknown): string | null {
  const date = clean(dateRaw)
  if (!date) return null
  const time = clean(timeRaw) ?? '00:00:00'
  const iso = `${date}T${time}`
  const dt = new Date(iso)
  if (Number.isNaN(dt.getTime())) return null
  return iso
}

function requiredString(raw: unknown, fallback: string) {
  return clean(raw) ?? fallback
}

function isPlaceholder(raw: unknown) {
  const v = clean(raw)
  if (!v) return true
  const lower = v.toLowerCase()
  return (
    lower === '-' ||
    lower === '.' ||
    lower === '0' ||
    lower === '000' ||
    lower === '0000' ||
    lower === 'tba' ||
    lower === 'folgt' ||
    lower === 'keine' ||
    lower === 'unbekannt' ||
    lower === 'unbekannt - tba'
  )
}

function inferCarClass(carName: string | null): CarClass | null {
  if (!carName) return null
  const n = carName.toLowerCase()
  if (n.includes('v-klasse') || n.includes('v klasse') || n.includes('v-class') || n.includes('van')) {
    return CarClass.BUSINESS_VAN
  }
  if (n.includes('s-klasse') || n.includes('s klasse') || n.includes('s-class') || n.includes('maybach')) {
    return CarClass.FIRST_CLASS
  }
  if (n.includes('e-klasse') || n.includes('e klasse') || n.includes('e-class')) {
    return CarClass.BUSINESS_CLASS
  }
  if (n.includes('eq') || n.includes('electric')) {
    return CarClass.ELECTRIC_CLASS
  }
  return null
}

function buildMessage(
  row: LegacyRow,
  overrides?: { company?: string; contact?: string; email?: string }
): string | null {
  const legacyNotes = clean(row.aciklama)
  const company = clean(overrides?.company) ?? clean(row.user_firmenname)
  const contact = clean(overrides?.contact) ?? clean(row.user_full_name)
  const email = clean(overrides?.email) ?? clean(row.mail)
  const metaParts = [
    company ? `company=${company}` : null,
    contact ? `contact=${contact}` : null,
    email ? `email=${email}` : null,
    typeof row.urun === 'number' || typeof row.urun === 'string' ? `urun=${row.urun}` : null,
    typeof row.personel === 'number' || typeof row.personel === 'string' ? `personel=${row.personel}` : null,
    clean(row.baslangic) ? `color=${clean(row.baslangic)}` : null,
    typeof row.suanki_durum === 'number' || typeof row.suanki_durum === 'string'
      ? `status=${row.suanki_durum}`
      : null,
    typeof row.rank === 'number' || typeof row.rank === 'string' ? `rank=${row.rank}` : null
  ].filter(Boolean)

  const legacyMeta = metaParts.length ? `Legacy: ${metaParts.join(' | ')}` : null
  if (legacyNotes && legacyMeta) return `${legacyNotes}\n\n${legacyMeta}`
  return legacyNotes ?? legacyMeta ?? null
}

function makeTransferId(legacyId: unknown) {
  return `transfer:legacy:${String(legacyId ?? '').trim() || 'unknown'}`
}

function makePassengerId(legacyId: unknown) {
  return `passenger:legacy:${String(legacyId ?? '').trim() || 'unknown'}`
}

function resolveSqlPath() {
  for (const candidate of DEFAULT_SQL_CANDIDATES) {
    if (fs.existsSync(candidate)) return candidate
  }
  throw new Error(
    `islemler.sql not found. Set ISLEMLER_SQL or place file at: ${DEFAULT_SQL_CANDIDATES.join(', ')}`
  )
}

function unescapeMysqlString(input: string): string {
  return input.replace(/\\([0abtnrZ\\'"])/g, (_m, ch) => {
    switch (ch) {
      case '0':
        return '\0'
      case 'a':
        return '\x07'
      case 'b':
        return '\b'
      case 't':
        return '\t'
      case 'n':
        return '\n'
      case 'r':
        return '\r'
      case 'Z':
        return '\x1a'
      case '\\':
        return '\\'
      case "'":
        return "'"
      case '"':
        return '"'
      default:
        return ch
    }
  })
}

function readValuesBlock(sqlText: string, startIndex: number): { valuesText: string; endIndex: number } {
  let inString = false
  let escaping = false
  for (let i = startIndex; i < sqlText.length; i += 1) {
    const ch = sqlText[i]
    if (inString) {
      if (escaping) {
        escaping = false
        continue
      }
      if (ch === '\\') {
        escaping = true
        continue
      }
      if (ch === "'") {
        inString = false
        continue
      }
    } else {
      if (ch === "'") {
        inString = true
        continue
      }
      if (ch === ';') {
        return { valuesText: sqlText.slice(startIndex, i), endIndex: i + 1 }
      }
    }
  }
  return { valuesText: sqlText.slice(startIndex), endIndex: sqlText.length }
}

function parseValuesText(valuesText: string): unknown[][] {
  const rows: unknown[][] = []
  let i = 0

  while (i < valuesText.length) {
    while (i < valuesText.length && valuesText[i] !== '(') i += 1
    if (i >= valuesText.length) break
    i += 1
    const row: unknown[] = []

    while (i < valuesText.length) {
      while (i < valuesText.length && /\s/.test(valuesText[i] ?? '')) i += 1
      if (i >= valuesText.length) break

      let value: unknown = null

      if (valuesText[i] === "'") {
        i += 1
        let str = ''
        while (i < valuesText.length) {
          const ch = valuesText[i]
          if (ch === '\\' && i + 1 < valuesText.length) {
            str += ch + valuesText[i + 1]
            i += 2
            continue
          }
          if (ch === "'") {
            i += 1
            break
          }
          str += ch
          i += 1
        }
        value = unescapeMysqlString(str)
      } else {
        let raw = ''
        while (i < valuesText.length && valuesText[i] !== ',' && valuesText[i] !== ')') {
          raw += valuesText[i]
          i += 1
        }
        const trimmed = raw.trim()
        if (!trimmed || trimmed.toUpperCase() === 'NULL') value = null
        else if (/^-?\d+(\.\d+)?$/.test(trimmed)) value = Number(trimmed)
        else value = trimmed
      }

      row.push(value)

      while (i < valuesText.length && /\s/.test(valuesText[i] ?? '')) i += 1
      if (valuesText[i] === ',') {
        i += 1
        continue
      }
      if (valuesText[i] === ')') {
        i += 1
        break
      }
    }

    if (row.length) rows.push(row)
  }

  return rows
}

function parseIslemlerSql(sqlText: string): LegacyRow[] {
  const rows: LegacyRow[] = []
  const insertRegex = /INSERT INTO `islemler` \(([^)]+)\) VALUES/gi
  let match: RegExpExecArray | null

  while ((match = insertRegex.exec(sqlText))) {
    const columnsRaw = match[1]
    if (!columnsRaw) {
      continue
    }
    const columns = columnsRaw
      .split(',')
      .map((col) => col.replace(/`/g, '').trim())
      .filter(Boolean)
    const startIndex = match.index + match[0].length
    const { valuesText, endIndex } = readValuesBlock(sqlText, startIndex)
    insertRegex.lastIndex = endIndex

    const valueRows = parseValuesText(valuesText)
    for (const values of valueRows) {
      const row: LegacyRow = {}
      columns.forEach((column, idx) => {
        row[column] = idx < values.length ? values[idx] : null
      })
      rows.push(row)
    }
  }

  return rows
}

function buildSeedData(rows: LegacyRow[]): SeedData {
  // Force a single customer for all mock transfers (Hotel Hein GmbH).
  const customerUserId = String(process.env.SEED_CUSTOMER_ID ?? '346402675442587254').trim() || '346402675442587254'
  const customerEmail = String(process.env.SEED_CUSTOMER_EMAIL ?? 'hein@netsnek.com').trim() || 'hein@netsnek.com'
  const companyName = String(process.env.SEED_CUSTOMER_COMPANY ?? 'Hotel Hein GmbH').trim() || 'Hotel Hein GmbH'
  const hotelLocation = String(process.env.SEED_HOTEL_LOCATION ?? 'Hein parking').trim() || 'Hein parking'

  const transfers: TransferSeed[] = []

  let createdAtISO: string | null = null
  let updatedAtISO: string | null = null

  const FIRST_NAMES = [
    'Anna',
    'Lukas',
    'Sophie',
    'Felix',
    'Maria',
    'Johannes',
    'Theresa',
    'David',
    'Katharina',
    'Jakob',
    'Laura',
    'Paul'
  ]

  const LAST_NAMES = [
    'Gruber',
    'Huber',
    'Mayer',
    'Wagner',
    'Pichler',
    'Steiner',
    'Fischer',
    'Bauer',
    'Leitner',
    'Hofer',
    'Schmid',
    'Berger'
  ]

  const AT_MOBILE_PREFIXES = ['660', '664', '676', '650', '699']

  function legacyNumber(raw: unknown): number {
    const s = String(raw ?? '').trim()
    const m = s.match(/\d+/g)
    if (!m || m.length === 0) return 0
    const n = Number.parseInt(m[m.length - 1] ?? '0', 10)
    return Number.isFinite(n) ? n : 0
  }

  function normalizeHeinText(input: string): string {
    return String(input ?? '')
      .replace(/frontoffice@palais-coburg\.com/gi, customerEmail)
      .replace(/palais\s+coburg\s+residenz/gi, hotelLocation)
      .replace(/palais\s+coburg\s+residez/gi, hotelLocation)
      .replace(/palais\s+coburg/gi, hotelLocation)
  }

  function normalizeHotelLocation(raw: string): string {
    const v = String(raw ?? '').trim()
    const lower = v.toLowerCase()
    if (lower === 'palais' || lower === 'hotel' || lower.includes('coburg')) return hotelLocation
    return v
  }

  for (const row of rows) {
    const transferId = makeTransferId(row.id)
    const pickupDateTimeISO =
      combineDateTime(row.marka, row.durum) ||
      normalizeDateTimeString(row.createdAt) ||
      new Date().toISOString()
    const requestedAtISO = normalizeDateTimeString(row.createdAt) || pickupDateTimeISO

    // Keep customer created/updated timestamps in a reasonable range.
    const nextTime = new Date(requestedAtISO).getTime()
    if (!Number.isNaN(nextTime)) {
      if (!createdAtISO || nextTime < new Date(createdAtISO).getTime()) createdAtISO = requestedAtISO
      if (!updatedAtISO || nextTime > new Date(updatedAtISO).getTime()) updatedAtISO = requestedAtISO
    }

    const room = String(row.id ?? '').trim() || transferId.replace(/^transfer:legacy:/, '')
    const subject = `Room ${room}`
    const preferredCarName = clean(row.arac)
    const preferredCarClass = inferCarClass(preferredCarName)

    const flightNumberRaw = clean(row.ucusnum)
    const flightNumber = isPlaceholder(flightNumberRaw) ? null : flightNumberRaw

    const messageRaw = buildMessage(row, { company: companyName, contact: 'Parking', email: customerEmail })
    const message = messageRaw ? normalizeHeinText(messageRaw) : null

    const details: TransferDetailsSeed | null =
      flightNumber || message || preferredCarName || preferredCarClass
        ? {
            transferId,
            flightNumber,
            message,
            luggage: null,
            childSeats: null,
            extraTime: null,
            preferredCarClass,
            preferredCarName
          }
        : null

    // Passengers are guests (not users): generate realistic fake names + email + Austrian phone.
    const n = legacyNumber(row.id)
    const firstName = FIRST_NAMES[n % FIRST_NAMES.length] ?? 'Anna'
    const lastName = LAST_NAMES[n % LAST_NAMES.length] ?? 'Gruber'
    const phone = `+43 ${AT_MOBILE_PREFIXES[n % AT_MOBILE_PREFIXES.length] ?? '660'} ${String(
      1000000 + (n % 9000000)
    ).padStart(7, '0')}`
    const email = `${firstName}.${lastName}+room${room}@hein-hotel.example`.toLowerCase()
    const language = n % 3 === 0 ? 'de' : 'en'

    const passenger: PassengerSeed = {
      id: makePassengerId(row.id),
      transferId,
      firstName,
      lastName,
      email,
      phone,
      language
    }

    const state = Number(row.isActive ?? 0) === 0 ? TransferState.CANCELED : TransferState.PENDING

    transfers.push({
      id: transferId,
      customerId: customerUserId,
      driverId: null,
      startDateTimeISO: null,
      pickupDateTimeISO,
      endDateTimeISO: null,
      pickupLocation: normalizeHotelLocation(requiredString(row.teslimalma, 'Unknown')),
      dropoffLocation: normalizeHotelLocation(requiredString(row.varis, 'Unknown')),
      subject,
      price: null,
      paymentMethode: null,
      payingParty: 'CUSTOMER',
      transferCategory: TransferCategory.DISTANCE,
      transferType: TransferType.ONE_WAY,
      state,
      requestedAtISO,
      carId: null,
      details,
      passenger
    })
  }

  const nowISO = new Date().toISOString()
  const customer: CustomerSeed = {
    id: `data:customer:seed:${customerUserId}`,
    userId: customerUserId,
    createdAtISO: createdAtISO ?? nowISO,
    updatedAtISO: updatedAtISO ?? createdAtISO ?? nowISO
  }

  return { customers: [customer], transfers }
}

function sqlValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return `'${String(value).replace(/'/g, "''")}'`
}

function parsePositiveInt(value: string | undefined) {
  if (!value) return null
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.floor(n)
}

function buildInsertStatements(
  table: string,
  columns: string[],
  rows: Record<string, unknown>[],
  options: SeedSqlOptions = {}
): string[] {
  if (!rows.length) return []
  const maxRows = options.maxRows ?? 50
  const maxChars = options.maxChars ?? 200000

  const header = `INSERT OR IGNORE INTO "${table}" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES\n`
  const statements: string[] = []
  let current: string[] = []
  let currentLength = header.length

  for (const row of rows) {
    const valueLine = `(${columns.map((col) => sqlValue((row as any)[col])).join(', ')})`
    const separator = current.length ? ',\n' : ''
    const nextLength = currentLength + separator.length + valueLine.length

    if (current.length >= maxRows || nextLength > maxChars) {
      if (current.length) {
        statements.push(`${header}${current.join(',\n')};`)
        current = []
        currentLength = header.length
      }
    }

    current.push(valueLine)
    currentLength += (current.length === 1 ? 0 : separator.length) + valueLine.length
  }

  if (current.length) {
    statements.push(`${header}${current.join(',\n')};`)
  }

  return statements
}

function buildSeedSql(seed: SeedData, reset: boolean, options: SeedSqlOptions = {}): string {
  const wrapTransaction = options.wrapTransaction ?? true
  const customerRows = seed.customers.map((c) => ({
    id: c.id,
    userId: c.userId,
    createdAt: c.createdAtISO,
    updatedAt: c.updatedAtISO
  }))

  const transferRows = seed.transfers.map((t) => ({
    id: t.id,
    customerId: t.customerId,
    driverId: t.driverId,
    startDateTime: t.startDateTimeISO,
    pickupDateTime: t.pickupDateTimeISO,
    endDateTime: t.endDateTimeISO,
    pickupLocation: t.pickupLocation,
    dropoffLocation: t.dropoffLocation,
    subject: t.subject,
    price: t.price,
    paymentMethode: t.paymentMethode,
    payingParty: t.payingParty,
    transferCategory: t.transferCategory,
    transferType: t.transferType,
    state: t.state,
    requestedAt: t.requestedAtISO,
    carId: t.carId
  }))

  const detailRows = seed.transfers
    .map((t) => t.details)
    .filter(Boolean)
    .map((d) => ({
      transferId: d!.transferId,
      flightNumber: d!.flightNumber,
      message: d!.message,
      luggage: d!.luggage,
      childSeats: d!.childSeats,
      extraTime: d!.extraTime,
      preferredCarClass: d!.preferredCarClass,
      preferredCarName: d!.preferredCarName
    }))

  const passengerRows = seed.transfers
    .map((t) => t.passenger)
    .filter(Boolean)
    .map((p) => ({
      id: p!.id,
      transferId: p!.transferId,
      firstName: p!.firstName,
      lastName: p!.lastName,
      email: p!.email,
      phone: p!.phone,
      language: p!.language
    }))

  const parts: string[] = []
  if (wrapTransaction) parts.push('BEGIN TRANSACTION;')
  if (reset) {
    parts.push(
      ['DELETE FROM "Passenger";', 'DELETE FROM "TransferDetails";', 'DELETE FROM "Transfer";', 'DELETE FROM "CustomerData";'].join(
        '\n'
      )
    )
  }

  parts.push(...buildInsertStatements('CustomerData', ['id', 'userId', 'createdAt', 'updatedAt'], customerRows, options))
  parts.push(
    ...buildInsertStatements(
      'Transfer',
      [
        'id',
        'customerId',
        'driverId',
        'startDateTime',
        'pickupDateTime',
        'endDateTime',
        'pickupLocation',
        'dropoffLocation',
        'subject',
        'price',
        'paymentMethode',
        'payingParty',
        'transferCategory',
        'transferType',
        'state',
        'requestedAt',
        'carId'
      ],
      transferRows,
      options
    )
  )
  parts.push(
    ...buildInsertStatements(
      'TransferDetails',
      [
        'transferId',
        'flightNumber',
        'message',
        'luggage',
        'childSeats',
        'extraTime',
        'preferredCarClass',
        'preferredCarName'
      ],
      detailRows,
      options
    )
  )
  parts.push(
    ...buildInsertStatements(
      'Passenger',
      ['id', 'transferId', 'firstName', 'lastName', 'email', 'phone', 'language'],
      passengerRows,
      options
    )
  )
  if (wrapTransaction) parts.push('COMMIT;')

  return parts.join('\n\n')
}

async function seedWithPrisma(seed: SeedData, reset: boolean) {
  const db = new PrismaClient()
  try {
    if (reset) {
      await db.passenger.deleteMany()
      await db.transferDetails.deleteMany()
      await db.transfer.deleteMany()
      await db.customerData.deleteMany()
    }

    if (seed.customers.length) {
      await db.customerData.createMany({
        data: seed.customers.map((c) => ({
          id: c.id,
          userId: c.userId,
          createdAt: new Date(c.createdAtISO),
          updatedAt: new Date(c.updatedAtISO)
        }))
      })
    }

    for (const transfer of seed.transfers) {
      await db.transfer.upsert({
        where: { id: transfer.id },
        update: {},
        create: {
          id: transfer.id,
          customerId: transfer.customerId,
          driverId: transfer.driverId,
          startDateTime: transfer.startDateTimeISO ? new Date(transfer.startDateTimeISO) : null,
          pickupDateTime: new Date(transfer.pickupDateTimeISO),
          endDateTime: transfer.endDateTimeISO ? new Date(transfer.endDateTimeISO) : null,
          pickupLocation: transfer.pickupLocation,
          dropoffLocation: transfer.dropoffLocation,
          subject: transfer.subject,
          price: transfer.price,
          paymentMethode: transfer.paymentMethode,
          payingParty: transfer.payingParty,
          transferCategory: transfer.transferCategory,
          transferType: transfer.transferType,
          state: transfer.state,
          requestedAt: new Date(transfer.requestedAtISO),
          carId: transfer.carId,
          details: transfer.details
            ? {
                create: {
                  flightNumber: transfer.details.flightNumber,
                  message: transfer.details.message,
                  luggage: transfer.details.luggage,
                  childSeats: transfer.details.childSeats,
                  extraTime: transfer.details.extraTime,
                  preferredCarClass: transfer.details.preferredCarClass,
                  preferredCarName: transfer.details.preferredCarName
                }
              }
            : undefined,
          passengers: transfer.passenger
            ? {
                create: [
                  {
                    id: transfer.passenger.id,
                    firstName: transfer.passenger.firstName,
                    lastName: transfer.passenger.lastName,
                    email: transfer.passenger.email,
                    phone: transfer.passenger.phone,
                    language: transfer.passenger.language
                  }
                ]
              }
            : undefined
        } as any
      })
    }
  } finally {
    await db.$disconnect()
  }
}

async function main() {
  const args = process.argv.slice(2)
  const outIndex = args.indexOf('--out')
  const envOut = process.env.SEED_SQL_OUT
  const emitSql = args.includes('--sql') || args.includes('--out') || Boolean(envOut)
  const outPath = outIndex >= 0 ? args[outIndex + 1] : envOut
  const reset = args.includes('--reset') || process.env.SEED_RESET === '1'
  const noTx =
    args.includes('--no-tx') || args.includes('--no-transaction') || process.env.SEED_NO_TX === '1'
  const maxRows = parsePositiveInt(process.env.SEED_SQL_MAX_ROWS) ?? 50
  const maxChars = parsePositiveInt(process.env.SEED_SQL_MAX_CHARS) ?? 200000

  const sqlPath = resolveSqlPath()
  const sqlText = fs.readFileSync(sqlPath, 'utf8')
  const legacyRows = parseIslemlerSql(sqlText)

  if (!legacyRows.length) {
    console.log('No rows found in islemler.sql; nothing to seed.')
    return
  }

  const seed = buildSeedData(legacyRows)

  if (emitSql) {
    const sqlOut = buildSeedSql(seed, reset, {wrapTransaction: !noTx, maxRows, maxChars})
    if (outPath) {
      fs.writeFileSync(outPath, sqlOut, 'utf8')
      console.log(`Seed SQL written to ${outPath}`)
    } else {
      console.log(sqlOut)
    }
    return
  }

  await seedWithPrisma(seed, reset)
  console.log(
    `Seeded ${seed.transfers.length} transfers for ${seed.customers.length} customers from ${path.basename(
      sqlPath
    )}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
