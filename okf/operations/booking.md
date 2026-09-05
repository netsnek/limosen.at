---
type: OKF Operations
title: The booking form
description: >
  What the form posts, the mismatch that made every booking on this site fail
  silently for months, and what pins it now.
tags: [limosen, booking, graphql, pylon]
timestamp: 2026-09-05T19:30:00+02:00
---

# Booking

A visitor fills the modal, the page posts one `bookTransfer` mutation to
`api.limosen.at`, and only then sends the enquiry mail, with the code the pylon
answered. The two steps are independent on purpose: a refused booking must not
swallow the enquiry, so the mail then goes out without a code and says so.

## Why the failure was invisible

When the mutation is refused the visitor sees an orange **Booking not created**
next to a green **Success** for the mail. The enquiry arrives, the company
answers it, and nothing reaches the dispatch app. It looks almost like success
from every angle except the one that matters.

**Every booking made on this site was refused**, until 2026-09-04. The form
posted the flat argument list of an old schema through the generated client:

```
bookTransfer(rideDateISO:, rideTime:, pickup:, dropoff:, roomOrName:,
             vehicle:, payment:, amountEUR:, details:)
```

What `api.limosen.at` deploys takes a single `args` object and answers with a
`Transfer`. The generated client also pointed at `limosen.netsnek.workers.dev`.

## The contract now

`src/services/book-transfer.ts`, the same file the sibling brand uses.

- **Arguments are written into the document, not declared as variables.** Pylon
  derives input type names from the resolver signature and they change whenever
  a decorator does. A document that names `ArgsInput_11` breaks on the next
  deploy of the backend. A literal names nothing.
- **`transferCategory` is an enum.** A bare member, not a quoted string.
  `toCategory` maps the words the form asks in onto members. `transferType` is
  not sent any more: the type is derived by the pylon from whether a ride has
  a return leg, see below.
- **`luggage`, `childSeats` and `extraTime` are typed `String`** and the form
  registers those inputs with `valueAsNumber`. They are coerced before the
  document is built. Left unquoted they produce *String cannot represent a non
  string value: 2*, and left empty they produce `NaN`, which serialises to the
  bare word `null` and is accepted. That is what would make it look intermittent.

The catch logs the real error before showing the visitor a calm sentence.
Swallowing it whole is why a plain schema mismatch stayed invisible.

## What keeps it honest

`tests/09-website-booking.ipynb` in `netsnek/taxi-app`, which checks both brands.

## Return trips and the code, 2026-09-05

### Measured before the change

"Rückfahrt" in the type field sent `transferType: RETURN_TRIP` on **one**
transfer, with no date and no time for the way back. The pylon never created a
second ride and the office typed it by hand without knowing when. The mail went
out after `bookTransfer` and carried the transfer's uuid as `transferId`, which
nobody can read aloud, and the "Wünsche" textarea was `required` on this brand
while it was optional on the sibling, so a visitor with nothing to say had to
type something.

### What changed

- Choosing "Rückfahrt" unfolds **Rückfahrtdatum** and **Abholzeit Rückfahrt**.
  Both are required then, and a return before the outbound ride is refused in
  the form ("Die Rückfahrt muss nach der Hinfahrt liegen"). One way bookings
  never see the two fields and are not asked for them.
- `src/services/book-transfer.ts` sends `returnPickupDateTime` as one ISO
  instant (`2026-09-24T17:15:00`) and stops sending `type`. The pylon creates
  the second leg from it, addresses swapped, same passengers, and the code of
  the booking with `-2`. The contract is
  `taxi-app/okf/architecture/transfer-codes.md`.
- The order in `src/services/booking.tsx` is create first, then mail. The
  answer's `code` (`BQ7Q4W-1`) is split into `bookingCode` (`BQ7Q4W`), `code`
  and `returnCode` (`BQ7Q4W-2`, empty for one way) and handed to the template,
  together with `returnDate` and `returnTime`. When the pylon refuses, the mail
  still goes out with the three empty and the template prints "Buchung noch
  nicht im System". The uuid is no longer a template variable.
- The "Wünsche" textarea is optional, as on the sibling brand.
- `BookingModal` accepts `carClass` and `carTitle` through `defaultValues`, so
  the fleet cards open it with the car already chosen.

### What keeps it honest

A headless Chromium against a local production build, with both backends
answered by route mocks so nothing reaches the company: "Rückfahrt" shows the
two fields, the submit is refused without them and with a return before the
outbound, a complete return posts `bookTransfer` first and the mail second with
`BQ7Q4W`, `BQ7Q4W-1` and `BQ7Q4W-2` in its values, and a refused `bookTransfer`
still sends the mail with an empty code. 32 checks, all passing on 2026-09-05.
The two legs in the rendered mail are checked through emailwerk's
`templatePreview`, see [mail.md](mail.md).
