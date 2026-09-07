import {SITE} from '../vars/site-variants'

/**
 * The customer's own ride, read without a login.
 *
 * Section 7 of taxi-app's okf/architecture/customer-experience.md: every ride
 * has one public page, `/fahrt/<token>`, and every message to the customer
 * links to it. The token is the offer token's sibling (pylon/src/offers/
 * token.ts, purpose `ride`): the ride's code as base64url JSON and an HMAC
 * under the same Worker secret, no expiry, derivable from the ride at any
 * time so no column carries it. It is the only credential the page holds, no
 * bearer token, no account.
 *
 * One public operation takes it, `rideByToken(args:{token})`, which answers
 * the ride's summary or refuses a forged token with NOT_FOUND. There is no
 * mutation here: the page shows, it does not answer, the answering is the
 * offer page's job.
 *
 * Arguments are written into the document rather than declared as variables,
 * for the reason book-transfer.ts and offer.ts give: pylon derives input type
 * names from the resolver signature, and a document that names one breaks on
 * the next deploy. A token is a string and JSON.stringify quotes it safely.
 */

export type RideLanguage = 'de' | 'en' | 'tr' | 'ar'

export type CustomerStatus =
  | 'NEW'
  | 'OFFERED'
  | 'CONFIRMED'
  | 'INVOICED'
  | 'PAID'
  | 'DECLINED'

/** The Prisma enum TransferState, the twelve the screens name. */
export type TransferState =
  | 'PENDING'
  | 'ASSIGNED'
  | 'REJECTED'
  | 'ABORTED'
  | 'ON_THE_WAY'
  | 'AT_PICKUP'
  | 'NO_SHOW'
  | 'FAILED'
  | 'CANCELED'
  | 'TERMINATED'
  | 'ONGOING'
  | 'COMPLETED'

/** The driver's answer to the assignment. ACCEPTED is the yes the card waits for. */
export type DriverStatus =
  | 'NONE'
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'WITHDRAWN'

/**
 * The car as the card "Ihr Fahrzeug" shows it, the fields the app's own
 * booking read uses so one name means one thing on both ends
 * (okf/architecture/media.md). The pylon answers this only once the driver
 * said yes; before that the ride's car is the dispatcher's intention and the
 * customer is told nothing about it.
 */
export interface RideCar {
  licensePlate: string
  carName: string | null
  /** BUSINESS_CLASS, FIRST_CLASS, BUSINESS_VAN, ELECTRIC_CLASS. */
  carClass: string | null
  /** #RRGGBB, the colour dot beside the plate. */
  color: string | null
  imageUrl: string | null
  imageThumbUrl: string | null
}

export type DocumentKind = 'OFFER' | 'INVOICE'

/**
 * The customer's paper. `url` is the pylon's signed link, minted for this
 * read and good for fifteen minutes, so the page opens it rather than
 * holding a permanent address.
 */
export interface RideDocument {
  kind: DocumentKind
  /** AN-260001, RE-260017. */
  number: string | null
  url: string
  createdAt: string | null
}

/**
 * What the pylon answers as RideSummary. No uuid, no passenger contact, no
 * driver phone and no live position: the page shows what the customer
 * already got by mail, see section 7 under "Privacy".
 */
export interface RideSummary {
  /** BQ7Q4W-1, the code a person reads. */
  code: string
  language: RideLanguage
  customerStatus: CustomerStatus
  state: TransferState
  driverStatus: DriverStatus
  /** The driver's first name, only once the driver said yes. */
  driverFirstName: string | null
  /** An ISO instant. */
  pickupDateTime: string
  pickupLocation: string
  dropoffLocation: string
  /** How many people ride. Zero where the booking names none. */
  passengers: number
  /** The gross total in euro, VAT included, or null while none is set. */
  price: number | null
  /** The return leg's code, BQ7Q4W-2, null where there is no return. */
  returnCode: string | null
  /** The return leg's own page on the brand's origin, null where there is none. */
  returnUrl: string | null
  /** /app/booking/<code>/, the second link a signed-in customer is offered. */
  appUrl: string
  car: RideCar | null
  documents: RideDocument[]
}

/**
 * The selection, one string, so the contract with the pylon lives in one
 * place and a renamed field is one edit here.
 */
const SUMMARY_FIELDS = `
  code
  language
  customerStatus
  state
  driverStatus
  driverFirstName
  pickupDateTime
  pickupLocation
  dropoffLocation
  passengers
  price
  returnCode
  returnUrl
  appUrl
  car {
    licensePlate
    carName
    carClass
    color
    imageUrl
    imageThumbUrl
  }
  documents {
    kind
    number
    url
    createdAt
  }
`

/**
 * A refusal with the pylon's code on it. The page turns the code into words.
 *
 * The codes this read answers: NOT_FOUND (a token that is malformed, forged
 * or names no ride), RIDES_NOT_CONFIGURED (the Worker has no key).
 */
export class RideError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = 'RideError'
  }
}

/** The transport failed before the pylon could answer. */
export const NETWORK = 'NETWORK'

const LANGUAGES: RideLanguage[] = ['de', 'en', 'tr', 'ar']

const toLanguage = (value: unknown): RideLanguage => {
  const code = String(value ?? '')
    .toLowerCase()
    .slice(0, 2)
  return (LANGUAGES as string[]).includes(code) ? (code as RideLanguage) : 'de'
}

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const toText = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value : null

/**
 * The state, upper cased the way the app's `asTransferState` does it: the
 * first migration defaulted the column to lowercase and legacy rows still
 * carry it, so `pending` has to find PENDING.
 */
const toState = (value: unknown): TransferState => {
  const upper = String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')
  return (upper || 'PENDING') as TransferState
}

const toCar = (row: any): RideCar | null => {
  if (!row) return null
  return {
    licensePlate: String(row.licensePlate ?? ''),
    carName: toText(row.carName),
    carClass: toText(row.carClass),
    color: toText(row.color),
    imageUrl: toText(row.imageUrl),
    imageThumbUrl: toText(row.imageThumbUrl)
  }
}

const toDocuments = (rows: any): RideDocument[] => {
  if (!Array.isArray(rows)) return []
  return rows
    .map(row => ({
      kind: (String(row?.kind ?? '').toUpperCase() === 'INVOICE'
        ? 'INVOICE'
        : 'OFFER') as DocumentKind,
      number: toText(row?.number),
      url: String(row?.url ?? ''),
      createdAt: toText(row?.createdAt)
    }))
    .filter(doc => doc.url !== '')
}

const toSummary = (row: any): RideSummary => ({
  code: String(row?.code ?? ''),
  language: toLanguage(row?.language),
  customerStatus: (row?.customerStatus as CustomerStatus) ?? 'NEW',
  state: toState(row?.state),
  driverStatus: (toText(row?.driverStatus)?.toUpperCase() as DriverStatus) ?? 'NONE',
  driverFirstName: toText(row?.driverFirstName),
  pickupDateTime: toText(row?.pickupDateTime) ?? '',
  pickupLocation: String(row?.pickupLocation ?? ''),
  dropoffLocation: String(row?.dropoffLocation ?? ''),
  passengers: toNumber(row?.passengers) ?? 0,
  price: toNumber(row?.price),
  returnCode: toText(row?.returnCode),
  returnUrl: toText(row?.returnUrl),
  appUrl: String(row?.appUrl ?? ''),
  car: toCar(row?.car),
  documents: toDocuments(row?.documents)
})

/**
 * One round trip. A GraphQL error becomes a RideError with the pylon's
 * `extensions.code`, a transport failure one with NETWORK, so the page can
 * tell "this link is no good" from "try again".
 */
const call = async (document: string): Promise<any> => {
  let response: Response
  try {
    response = await fetch(SITE.appPylonUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: document})
    })
  } catch (error) {
    throw new RideError(String((error as Error)?.message ?? error), NETWORK)
  }

  let payload: any
  try {
    payload = await response.json()
  } catch {
    throw new RideError(`HTTP ${response.status}`, NETWORK)
  }

  if (payload?.errors?.length) {
    const first = payload.errors[0]
    const code =
      typeof first?.extensions?.code === 'string'
        ? first.extensions.code
        : 'APP_ERROR'
    throw new RideError(String(first?.message ?? code), code)
  }

  return payload?.data
}

export const rideByToken = async (token: string): Promise<RideSummary> => {
  const data = await call(
    `query { rideByToken(args: {token: ${JSON.stringify(token)}}) { ${SUMMARY_FIELDS} } }`
  )
  // A token the pylon cannot place answers null rather than an error on some
  // deployments. Treating that as NOT_FOUND keeps the page's two refusals
  // apart: a link that is no good, and a transport that failed.
  if (!data?.rideByToken) {
    throw new RideError('rideByToken answered no ride', 'NOT_FOUND')
  }
  return toSummary(data.rideByToken)
}
