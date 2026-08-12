// src/finance/sheets.ts
import {getContext, getEnv} from '@getcronit/pylon'

type SheetValue = string | number | boolean | null

const MASTER_TITLE = 'AllRequests'

// keep the sheet row shape unchanged
const MASTER_HEADERS = [
  'transferId', // A
  'customerId', // B
  'customerName', // C (kept for legacy sheet layout; we write empty)
  'rideDateISO', // D
  'rideTime', // E
  'pickup', // F
  'dropoff', // G
  'roomOrName', // H
  'vehicle', // I
  'amountEUR', // J
  'payment', // K
  'driverId', // L
  'driverName', // M
  'state', // N
  'requestedAtISO' // O
]

const te = new TextEncoder()

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let b64: string
  // @ts-ignore
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    // @ts-ignore
    b64 = Buffer.from(bytes).toString('base64')
  } else {
    let bin = ''
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
    // @ts-ignore
    b64 = btoa(bin)
  }
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlEncodeJSON(obj: unknown): string {
  return base64UrlEncodeBytes(te.encode(JSON.stringify(obj)))
}

function pemToPkcs8(pem: string): ArrayBuffer {
  const clean = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '')
  // @ts-ignore
  const raw = typeof atob !== 'undefined' ? atob(clean) : Buffer.from(clean, 'base64').toString('binary')
  const buf = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i)
  return buf.buffer
}

function spreadsheetId(): string {
  const env: any = getEnv()
  const id = env?.GOOGLE_SHEETS_SPREADSHEET_ID
  if (!id) throw new Error('Missing GOOGLE_SHEETS_SPREADSHEET_ID')
  return String(id)
}

async function googleAccessToken(): Promise<string> {
  const env: any = getEnv()
  const clientEmail = env?.GOOGLE_SHEETS_CLIENT_EMAIL
  let privateKey = env?.GOOGLE_SHEETS_PRIVATE_KEY
  if (!clientEmail || !privateKey) throw new Error('Missing GOOGLE_SHEETS_CLIENT_EMAIL or GOOGLE_SHEETS_PRIVATE_KEY')
  privateKey = String(privateKey).replace(/\\n/g, '\n')

  const now = Math.floor(Date.now() / 1000)
  const ctx = getContext() as any
  const cached = ctx.get('gsheets_token') as {token: string; exp: number} | undefined
  if (cached && cached.exp > now + 60) return cached.token

  const header = {alg: 'RS256', typ: 'JWT'}
  const claim = {
    iss: String(clientEmail),
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  }

  const unsigned = `${base64UrlEncodeJSON(header)}.${base64UrlEncodeJSON(claim)}`

  const subtle = (globalThis.crypto && globalThis.crypto.subtle) as SubtleCrypto
  if (!subtle) throw new Error('WebCrypto SubtleCrypto is not available in this runtime')

  const cryptoKey = await subtle.importKey(
    'pkcs8',
    pemToPkcs8(privateKey),
    {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
    false,
    ['sign']
  )
  const signature = await subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, te.encode(unsigned))
  const jwt = `${unsigned}.${base64UrlEncodeBytes(new Uint8Array(signature))}`

  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }).toString()
  })

  const j: any = await r.json()
  if (!r.ok) throw new Error(`Token error: ${r.status} ${JSON.stringify(j)}`)

  const exp = now + (typeof j.expires_in === 'number' ? j.expires_in : 3600)
  ctx.set('gsheets_token', {token: j.access_token as string, exp})
  return j.access_token as string
}

async function sheetsGet<T = any>(path: string, accessToken: string): Promise<T> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId()}${path}`
  const r = await fetch(url, {headers: {Authorization: `Bearer ${accessToken}`}})
  if (!r.ok) throw new Error(`Sheets GET ${path}: ${await r.text()}`)
  return r.json()
}

async function sheetsPost<T = any>(path: string, body: any, accessToken: string): Promise<T> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId()}${path}`
  const r = await fetch(url, {
    method: 'POST',
    headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
  if (!r.ok) throw new Error(`Sheets POST ${path}: ${await r.text()}`)
  return r.json()
}

async function sheetsPut<T = any>(path: string, body: any, accessToken: string): Promise<T> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId()}${path}`
  const r = await fetch(url, {
    method: 'PUT',
    headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
  if (!r.ok) throw new Error(`Sheets PUT ${path}: ${await r.text()}`)
  return r.json()
}

function colLetter(idx1: number): string {
  let s = ''
  let n = idx1
  while (n > 0) {
    const r = (n - 1) % 26
    s = String.fromCharCode(65 + r) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

async function ensureMaster(accessToken: string) {
  // ensure sheet exists
  const meta = await sheetsGet<{sheets?: any[]}>(`?fields=sheets.properties`, accessToken)
  const has = meta?.sheets?.some(s => s?.properties?.title === MASTER_TITLE)
  if (!has) {
    await sheetsPost(`:batchUpdate`, {requests: [{addSheet: {properties: {title: MASTER_TITLE}}}]}, accessToken)
  }

  // ensure headers exist
  const headerRange = `${MASTER_TITLE}!A1:${colLetter(MASTER_HEADERS.length)}1`
  const r = await sheetsGet<{values?: SheetValue[][]}>(`/values/${encodeURIComponent(headerRange)}`, accessToken)
  const ok = !!r.values && (r.values[0]?.length ?? 0) >= MASTER_HEADERS.length
  if (!ok) {
    await sheetsPut(
      `/values/${encodeURIComponent(headerRange)}?valueInputOption=USER_ENTERED`,
      {values: [MASTER_HEADERS], range: headerRange, majorDimension: 'ROWS'},
      accessToken
    )
  }
}

async function valuesAppend(rangeA1: string, values: SheetValue[][], accessToken: string) {
  return sheetsPost(
    `/values/${encodeURIComponent(rangeA1)}:append?insertDataOption=INSERT_ROWS&valueInputOption=USER_ENTERED`,
    {values, majorDimension: 'ROWS'},
    accessToken
  )
}

export async function appendTransferToSheet(t: {
  transferId: string
  customerId: string
  rideDateISO: string
  rideTime: string
  pickup: string
  dropoff: string
  roomOrName?: string
  vehicle?: string
  price?: number
  payment?: string
}) {
  const accessToken = await googleAccessToken()
  await ensureMaster(accessToken)

  const row: SheetValue[] = [
    t.transferId,
    t.customerId,
    '', // customerName (kept in sheet layout, but not used)
    t.rideDateISO,
    t.rideTime,
    t.pickup,
    t.dropoff,
    t.roomOrName ?? '',
    t.vehicle ?? '',
    typeof t.price === 'number' ? t.price : '',
    t.payment ?? '',
    '', // driverId
    '', // driverName
    'pending', // state
    new Date().toISOString() // requestedAtISO
  ]

  await valuesAppend(`${MASTER_TITLE}!A:A`, [row], accessToken)
}
