/**
 * The emailwerk templates this site sends, one per language.
 *
 * Both forms used to post one hardcoded id, the English "Contact" pair, for
 * every language: a German visitor booked in German and was confirmed in
 * English. The German, Turkish and Arabic rows beside it were unpublished and
 * two of them had no parent, so nothing else could have been sent.
 *
 * Each entry here is a parent that carries the enquiry to office@limosen.at
 * with a copy to limosen@netsnek.com. Every parent has a confirmation child
 * in the same language, and the server enqueues that child itself to
 * envelope.replyTo, which is why neither form may send it a second time.
 *
 * The ids come from mail-templates/ids.json, written by
 * scripts/create-mail-templates.py. Editing the HTML in mail-templates/ and
 * running that script again updates the live templates in place. The
 * variables a template may read are declared there, not here: the booking
 * form sends the ride, the way back (returnDate, returnTime) and the booking
 * as a person reads it (bookingCode, code, returnCode), see booking.tsx.
 */
export type MailLocale = 'de' | 'en' | 'tr' | 'ar'

const BOOKING_TEMPLATES: Record<MailLocale, string> = {
  de: 'cmtpcq5hb018fps2pkeapmunv',
  en: 'cmtpcq6q301a5ps2p9vjrwdvm',
  tr: 'cmtpcq7r701bvps2pildtg46n',
  ar: 'cmtpcq8i701dlps2pwth09w43'
}

/**
 * The site speaks de-AT, en-US, tr-TR and ar-EG, and react-intl hands the full
 * tag over. Only the language part decides the mail, because a template is
 * written in a language rather than for a region.
 *
 * German is the fallback: it is the language of the company and of most of the
 * enquiries, so an unknown tag lands somewhere a reader here can act on rather
 * than in English.
 *
 * The contact form shares these templates. Their body renders only the fields
 * that carry a value, so a plain enquiry produces a mail without the ride and
 * vehicle sections rather than a page of empty labels.
 */
export const templateForLocale = (locale?: string): string => {
  const language = String(locale ?? '').slice(0, 2).toLowerCase()

  return BOOKING_TEMPLATES[language as MailLocale] ?? BOOKING_TEMPLATES.de
}
