/**
 * The emailwerk templates the two forms send.
 *
 * Both forms posted the same hardcoded id to mailpress v2 at
 * mailpress.netsnek.com, which is a separate legacy instance with its own
 * database. gatsby-jaen-mailpress is gone with the jaen version this site now
 * links against, and its replacement talks to emailwerk instead, where the whole
 * template set already exists under new ids.
 *
 * The id below is the migrated 'Contact' parent, whose linked child sends the
 * visitor's confirmation. The server enqueues that child itself, to
 * envelope.replyTo, so neither form may send it a second time.
 *
 * Both rows are public and carry a verified sender since 2026-09-04. Their
 * bodies live in mail-templates/ as of 2026-09-05, and
 * scripts/update-mail-templates.py pushes an edit back in place, by these two
 * ids, the way the sibling brand's script does. The variables a template may
 * read are declared there, not here: the booking form sends the ride, the way
 * back (returnDate, returnTime) and the booking as a person reads it
 * (bookingCode, code, returnCode), see src/services/booking.tsx.
 *
 * The booking form deliberately keeps pointing at the same template as the
 * contact form, because that is what it did before this change. It wants its own
 * pair, with the fleet and transfer values in the body, and that is a content
 * change rather than a migration step.
 */
export const CONTACT_TEMPLATE_ID = 'cmsmguuq3002lrb2pa47hpmc5'

/** Same template as the contact form, unchanged from before. */
export const BOOKING_TEMPLATE_ID = CONTACT_TEMPLATE_ID
