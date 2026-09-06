# LIMOSEN KG mail templates

Eight Twig templates for the emailwerk mail service, one pair per language, for the booking
form and the contact form on limosen.at.

| locale | to the company | to the visitor |
| --- | --- | --- |
| de (de-AT) | `limosen-de-request.html` | `limosen-de-confirmation.html` |
| en | `limosen-en-request.html` | `limosen-en-confirmation.html` |
| tr | `limosen-tr-request.html` | `limosen-tr-confirmation.html` |
| ar | `limosen-ar-request.html` | `limosen-ar-confirmation.html` |

`subjects.json` holds the subject line for each file, keyed by base name, and `ids.json` the
id of the live row on emailwerk, written by `scripts/create-mail-templates.py`. The request
subject names the site because the office reads it next to enquiries from other channels, the
confirmation subject names the company because that is what the visitor recognises in the inbox.

The four request templates are byte-identical: the office reads German, so the enquiry is the
same mail whatever language the visitor booked in, and it is the confirmation that follows the
visitor's language. A layout change has to be applied to all eight files at once.

## Where they come from

The eight files are the sibling brand's (`booklimo.at/mail-templates/krc-*.html`) with the
brand swapped back: links, addresses, phone number, company name, the Instagram handle, the
copy block's first line. The sibling's files were this brand's English pair with KRC's brand
in the first place, so the wording of the request and of the English confirmation is the
wording the old pair had. One difference from both: the copy block for WhatsApp sits at the
top of the request, above the booking's details, so the office forwards an enquiry without
scrolling past the fields it repeats.

## Variables

Every row is wrapped in `{% if %}` and a whole section disappears when all of its fields are
empty, because the booking form sends the full ride only for a real booking and the contact
form leaves nearly everything blank. No variable is required.

The booking: `bookingCode`, the six characters both legs share (`BQ7Q4W`), `code` for the
outbound leg (`BQ7Q4W-1`) and `returnCode` for the way back (`BQ7Q4W-2`, empty for a one way
booking). All three are empty when the pylon refused the booking, and every template then
says "Buchung noch nicht im System" in its language. The transfer's uuid is not a variable,
nobody reads a uuid. The copy block starts with the code line so a forwarded enquiry names
the booking before anything else.

Contact: `firstName`, `lastName`, `email`, `phone`, `message`, `agreeToTerms`

The ride: `rideCategory`, `rideType`, `date`, `time`, `pickupAddress`, `destinationAddress`,
`flightNumber`, `passengers`, `luggage`, `childSeats`, `extraTime`

The way back, only for a return: `returnDate`, `returnTime`. The route is the outbound's
swapped, so the templates print it that way and need no addresses of their own.

Vehicle and payment: `carClass`, `carTitle`, `paymentOption`

Internal, request only: `locale`, `invokedOnUrl`

Both: `year`, which falls back to 2026 when the caller does not pass it.

Values go through `|escape`, only `message` uses `|nl2br` so line breaks from the textarea
survive. The confirmation repeats the ride so the visitor can spot a wrong date or address, but
it never repeats `message` and never shows `invokedOnUrl`, because those are notes for the
office and reading them back adds nothing for the customer.

The Arabic pair sets `dir="rtl"` on the html element, on the layout tables and on the field
tables, and mirrors alignment and label padding in the inline styles. Mail address, phone number
and URL keep an explicit `dir="ltr"` so the bidi algorithm does not reorder the digits and the
leading plus.

## What has to be true on the server

The template must be stored as a public template. Both forms trigger the send from the browser
without a user token, and a template that is not public is refused before it reaches the
transport. That one flag kept every enquiry from this site out of the log until 2026-09-04.

Each confirmation carries the `parentId` of its language's request and no recipient of its
own. The site sends the parent only, and the server delivers every public child of that parent
to `envelope.replyTo`, the visitor. Sending the child from the site would double every
confirmation, and a child hanging under the wrong parent answers in the wrong language, which
is exactly what happened while all four languages sent the one English pair.

The From address must be a verified sender. The rows use `office@snek.at`, the sender the
other tenants' public templates use, and `office@limosen.at` is the reply target that appears
in the body, not the envelope sender.

Pick the pair from the same `locale` value the form sends, in `src/services/mail-templates.ts`,
so subject and body never end up in different languages.
