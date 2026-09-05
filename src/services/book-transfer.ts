import {SITE} from '../vars/site-variants'

/**
 * Create a booking on this brand's own backend.
 *
 * It replaces a call through the generated IAM client, whose bookTransfer
 * signature came from a much older schema: flat arguments returning a
 * BookTransfer with a transferId. What api.limosen.at actually deploys takes a
 * single `args` object and answers with a Transfer, so every booking made on
 * this site was refused and the visitor was told "we could not create the
 * booking in our system" while only the enquiry mail went out.
 *
 * Arguments are written into the document rather than declared as variables.
 * Pylon derives input type names from the resolver signature and they change
 * whenever a decorator does, so a document that names one is a document that
 * breaks on the next deploy. A literal names nothing.
 */
/**
 * A GraphQL enum member is spelled bare. Once it is a JavaScript string it is
 * indistinguishable from a quoted one, so wrapping it says which it is. Sending
 * "DISTANCE" with quotes is refused as a non-enum value.
 */
class EnumValue {
  constructor(public readonly name: string) {}
}

const literal = (value: unknown): string => {
  if (value instanceof EnumValue) return value.name
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  // An empty number input read with valueAsNumber is NaN, and JSON.stringify
  // turns that into the bare word null. That happens to be valid GraphQL, which
  // is why nobody noticed; saying so on purpose beats relying on the accident.
  if (typeof value === 'number')
    return Number.isFinite(value) ? String(value) : 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(literal).join(', ')}]`
  if (typeof value === 'object') {
    const fields = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}: ${literal(v)}`)
    return `{${fields.join(', ')}}`
  }
  return 'null'
}

/**
 * The form asks in words a passenger understands and the backend stores an
 * enum. "Flughafentransfer" is not a member of TransferCategory, which is why a
 * booking was refused with 'Enum "TransferCategoryInput" cannot represent
 * non-enum value'.
 *
 * Anything priced by the hour is HOURLY. Everything else is charged by the
 * distance driven, so DISTANCE is the default rather than FLATRATE, which is
 * for an agreed fixed price and is not something this form can establish.
 */
const toCategory = (value?: string): EnumValue | undefined => {
  if (!value) return undefined
  const v = value.toLowerCase()

  if (v.includes('stunde') || v.includes('hour') || v.includes('saat') || v.includes('ساع')) {
    return new EnumValue('HOURLY')
  }
  if (v.includes('pauschal') || v.includes('flat')) return new EnumValue('FLATRATE')

  return new EnumValue('DISTANCE')
}

/**
 * Counts arrive from the form as numbers and the schema types them as String.
 * An empty number input is NaN, which is not a count and has no business in
 * the document at all.
 */
const toText = (value?: string | number): string | undefined => {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'number')
    return Number.isFinite(value) ? String(value) : undefined

  return value
}

export interface BookTransferInput {
  /** One ISO instant. The form collects a date and a time separately. */
  pickupDateTime: string
  /**
   * The way back, one ISO instant, only for a return trip. The pylon creates
   * the second leg from it: addresses swapped, the same passengers, and the
   * booking's code with `-2`. The form no longer sends a type. A return used
   * to be RETURN_TRIP on one row, without a date, and the office typed the
   * way back by hand without knowing when.
   */
  returnPickupDateTime?: string
  pickupLocation: string
  dropoffLocation: string
  subject?: string
  paymentMethode?: string
  payingParty?: string
  passengers?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    language?: string
  }
  details?: {
    flightNumber?: string
    message?: string
    transferCategory?: string
    luggage?: string | number
    childSeats?: string | number
    extraTime?: string | number
    preferredCarClass?: string
    preferredCarName?: string
  }
}

/**
 * What the pylon answers for a booking. `id` is the machine's key and stays
 * out of every screen and mail. `code` is what a person reads, the six
 * characters with `-1`; the return leg, when one was asked for, carries the
 * same stem with `-2`, see `returnCodeOf`.
 */
export interface BookedTransfer {
  id: string
  code: string | null
}

/**
 * The return leg's code, derived rather than read. The pylon mints the
 * return as the outbound's stem with the next leg number, and a booking from
 * the website always starts a fresh stem, so the way back is `-2`. It is not
 * read off the answer because a signed-out visitor may not walk
 * `referencedBy`: the one row they hold is the one the mutation answered.
 */
export const returnCodeOf = (code: string | null | undefined): string | null => {
  if (!code) return null
  const stem = code.split('-')[0]
  return stem ? `${stem}-2` : null
}

/** The six characters both legs share, what the mails call the booking. */
export const bookingStemOf = (code: string | null | undefined): string | null => {
  if (!code) return null
  return code.split('-')[0] || null
}

export const bookTransfer = async (
  input: BookTransferInput
): Promise<BookedTransfer | null> => {
  const args = {
    ...input,
    details: input.details
      ? {
          ...input.details,
          transferCategory: toCategory(input.details.transferCategory),
          // The schema types these three as String and the form registers them
          // with valueAsNumber, so a visitor who typed a suitcase count sent
          // `luggage: 2` unquoted and the booking came back as "String cannot
          // represent a non string value". A visitor who left them empty sent
          // NaN, which serialised to null and went through. That is exactly why
          // some bookings landed and others reported "Booking not created".
          luggage: toText(input.details.luggage),
          childSeats: toText(input.details.childSeats),
          extraTime: toText(input.details.extraTime)
        }
      : undefined
  }

  const response = await fetch(SITE.appPylonUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      query: `mutation { bookTransfer(args: ${literal(args)}) { id code } }`
    })
  })

  const payload = await response.json()

  if (payload?.errors?.length) {
    throw new Error(String(payload.errors[0]?.message ?? 'bookTransfer failed'))
  }

  const row = payload?.data?.bookTransfer
  if (typeof row?.id !== 'string') return null

  return { id: row.id, code: typeof row.code === 'string' ? row.code : null }
}
