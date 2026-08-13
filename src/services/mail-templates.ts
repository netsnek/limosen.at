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
 * TWO THINGS ARE STILL OPEN on the server side, and until they are done a send
 * from a signed-out visitor is refused rather than silently dropped:
 *
 *   1. both rows carry isPublic = false, so the anonymous door does not admit
 *      them
 *   2. both carry senderId = NULL, so there is no verified sender to send from
 *
 * The booking form deliberately keeps pointing at the same template as the
 * contact form, because that is what it did before this change. It wants its own
 * pair, with the fleet and transfer values in the body, and that is a content
 * change rather than a migration step.
 */
export const CONTACT_TEMPLATE_ID = 'cmsmguuq3002lrb2pa47hpmc5'

/** Same template as the contact form, unchanged from before. */
export const BOOKING_TEMPLATE_ID = CONTACT_TEMPLATE_ID
