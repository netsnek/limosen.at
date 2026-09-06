import {SITE} from '../vars/site-variants'

/**
 * The customer's side of an offer, read and answered without a login.
 *
 * The offer mail carries two links to this site, `/angebot/<token>` and
 * `/angebot/<token>/ablehnen`, see okf/operations/offer-confirmation.md and
 * taxi-app's okf/architecture/offers-and-documents.md. The token is the
 * pylon's own (pylon/src/offers/token.ts): the ride's code, the action and
 * an expiry as base64url JSON, then an HMAC under the Worker secret
 * OFFER_KEY. It is the only credential the page holds, no bearer token, no
 * account. The confirm token and the decline token differ in the action
 * they sign, so each link answers one question and the pylon refuses the
 * other with OFFER_LINK_INVALID. Three public operations take it:
 * `offerByToken` for the summary the page shows, `confirmOffer` and
 * `declineOffer` for the button.
 *
 * Arguments are written into the document, not declared as variables, for
 * the reason book-transfer.ts gives: pylon derives input type names from
 * the resolver signature, and a document that names one breaks on the
 * next deploy. A token is a string and JSON.stringify quotes it safely.
 */

export type OfferLanguage = 'de' | 'en' | 'tr' | 'ar'

export type CustomerStatus =
  | 'NEW'
  | 'OFFERED'
  | 'CONFIRMED'
  | 'INVOICED'
  | 'PAID'
  | 'DECLINED'

export type OfferAction = 'confirm' | 'decline'

/**
 * What the pylon answers as OfferSummary (pylon/src/offers/Offer.ts): the
 * ride as the offer PDF shows it, no uuid, no passenger.
 */
export interface OfferSummary {
  /** The booking's code, BQ7Q4W-1. */
  code: string
  /** The document number, AN-260001, null before an offer was stored. */
  number: string | null
  language: OfferLanguage
  /** ISO instants. */
  pickupDateTime: string
  pickupLocation: string
  dropoffLocation: string
  /** The gross total in euro, VAT included, or null when none is set. */
  total: number | null
  /** The instant the offer stops being valid, or null. */
  validUntil: string | null
  customerStatus: CustomerStatus
  /** The ride state, CANCELED after a decline or an expiry. */
  state: string
  /** The action the token carried. */
  action: OfferAction | null
  /** Whether the call moved the status. False on the read and on a repeat. */
  changed: boolean
  /** The instant of the current customer status. */
  statusAt: string | null
}

/**
 * The selection, one string, so the contract with the pylon lives in one
 * place and a renamed field is one edit here.
 */
const SUMMARY_FIELDS = `
  code
  number
  language
  pickupDateTime
  pickupLocation
  dropoffLocation
  total
  validUntil
  customerStatus
  state
  action
  changed
  statusAt
`

/**
 * A refusal with the pylon's code on it. The page turns the code into
 * words, so the code is what matters and the message is kept for the log.
 *
 * The codes the offer module answers: OFFER_LINK_INVALID (a token that is
 * malformed, forged, of the other action, or names no ride),
 * OFFER_EXPIRED (the link past the pickup, or the offer past its "gültig
 * bis"), OFFER_DECLINED (a confirm on a declined ride), OFFER_CONFIRMED (a
 * decline on a confirmed ride), INVALID_TRANSITION (no offer was sent),
 * OFFERS_NOT_CONFIGURED (the Worker has no key).
 */
export class OfferError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = 'OfferError'
  }
}

/** The transport failed before the pylon could answer. */
export const NETWORK = 'NETWORK'

const LANGUAGES: OfferLanguage[] = ['de', 'en', 'tr', 'ar']

const toLanguage = (value: unknown): OfferLanguage => {
  const code = String(value ?? '')
    .toLowerCase()
    .slice(0, 2)
  return (LANGUAGES as string[]).includes(code) ? (code as OfferLanguage) : 'de'
}

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const toInstant = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value : null

const toSummary = (row: any): OfferSummary => ({
  code: String(row?.code ?? ''),
  number: typeof row?.number === 'string' && row.number ? row.number : null,
  language: toLanguage(row?.language),
  pickupDateTime: toInstant(row?.pickupDateTime) ?? '',
  pickupLocation: String(row?.pickupLocation ?? ''),
  dropoffLocation: String(row?.dropoffLocation ?? ''),
  total: toNumber(row?.total),
  validUntil: toInstant(row?.validUntil),
  customerStatus: (row?.customerStatus as CustomerStatus) ?? 'OFFERED',
  state: String(row?.state ?? ''),
  action:
    row?.action === 'confirm' || row?.action === 'decline' ? row.action : null,
  changed: Boolean(row?.changed),
  statusAt: toInstant(row?.statusAt)
})

/**
 * One round trip. A GraphQL error becomes an OfferError with the pylon's
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
    throw new OfferError(String((error as Error)?.message ?? error), NETWORK)
  }

  let payload: any
  try {
    payload = await response.json()
  } catch {
    throw new OfferError(`HTTP ${response.status}`, NETWORK)
  }

  if (payload?.errors?.length) {
    const first = payload.errors[0]
    const code =
      typeof first?.extensions?.code === 'string'
        ? first.extensions.code
        : 'APP_ERROR'
    throw new OfferError(String(first?.message ?? code), code)
  }

  return payload?.data
}

const withToken = (token: string) => `(args: {token: ${JSON.stringify(token)}})`

export const offerByToken = async (token: string): Promise<OfferSummary> => {
  const data = await call(
    `query { offerByToken${withToken(token)} { ${SUMMARY_FIELDS} } }`
  )
  return toSummary(data?.offerByToken)
}

export const confirmOffer = async (token: string): Promise<OfferSummary> => {
  const data = await call(
    `mutation { confirmOffer${withToken(token)} { ${SUMMARY_FIELDS} } }`
  )
  return toSummary(data?.confirmOffer)
}

export const declineOffer = async (token: string): Promise<OfferSummary> => {
  const data = await call(
    `mutation { declineOffer${withToken(token)} { ${SUMMARY_FIELDS} } }`
  )
  return toSummary(data?.declineOffer)
}
