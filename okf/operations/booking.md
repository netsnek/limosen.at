---
type: OKF Operations
title: The booking form
description: >
  What the form posts, the mismatch that made every booking on this site fail
  silently for months, and what pins it now.
tags: [limosen, booking, graphql, pylon]
timestamp: 2026-09-04T23:30:00+02:00
---

# Booking

A visitor fills the modal, the page posts one `bookTransfer` mutation to
`api.limosen.at`, and only then sends the enquiry mail. The two steps are
independent on purpose: a refused booking must not swallow the enquiry.

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
- **`transferCategory` and `transferType` are enums.** A bare member, not a
  quoted string. `toCategory` and `toType` map the words the form asks in onto
  members.
- **`luggage`, `childSeats` and `extraTime` are typed `String`** and the form
  registers those inputs with `valueAsNumber`. They are coerced before the
  document is built. Left unquoted they produce *String cannot represent a non
  string value: 2*, and left empty they produce `NaN`, which serialises to the
  bare word `null` and is accepted. That is what would make it look intermittent.

The catch logs the real error before showing the visitor a calm sentence.
Swallowing it whole is why a plain schema mismatch stayed invisible.

## What keeps it honest

`tests/09-website-booking.ipynb` in `netsnek/taxi-app`, which checks both brands.
