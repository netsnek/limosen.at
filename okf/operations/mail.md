---
type: OKF Operations
title: Mail
description: >
  The contact template pair, and the one flag that meant no enquiry from this
  site ever reached the company.
tags: [limosen, emailwerk, mail, cors, transfer-code]
timestamp: 2026-09-05T19:30:00+02:00
---

# Mail

Both forms post to emailwerk at `https://emailwerk.com/graphql`, from the
visitor's browser, with no credential.

| | id | recipients |
|---|---|---|
| Contact, the parent | `cmsmguuq3002lrb2pa47hpmc5` | `office@limosen.at`, `office@erebos.xyz`, `limosen@netsnek.com` |
| Confirmation, the child | `cmsmgut2u000prb2p216pcfwn` | the visitor, through `envelope.replyTo` |

The site sends **only the parent**. The server enqueues the confirmation itself,
which is why sending the child from the site would double every confirmation.
The booking form points at the same pair as the contact form; it wants its own,
with the fleet and transfer values in the body, and that is a content change.

## No enquiry from this site ever arrived

Both rows carried **`isPublic: false`**, and emailwerk refuses a template that
is not public to a signed-out caller. The site's visitors are all signed out.
emailwerk's message log contained **zero** messages for limosen: not a failure,
not a bounce, nothing, because the send was refused before a message row existed.

Both templates were set public on 2026-09-04 and the path was verified by
submitting the real form on `limosen.at` once. Three messages, all `SENT`, one
per recipient. 28 of the 38 templates on this emailwerk are public, so this was
an oversight rather than a policy.

A note in `src/services/mail-templates.ts` had said so all along, listing
`isPublic: false` and a missing sender as the two open items. The sender had been
fixed since; the flag had not.

## CORS

Mail is sent by the browser, so `EMAILWERK_CORS_ORIGINS` on the emailwerk
deployment decides whether it happens at all. `limosen.at`, `www.limosen.at` and
`new.limosen.at` are on the allowlist. A missing origin answers the preflight
with 401, which curl from a terminal never sees: the only honest check is a real
browser.

## The templates have a source in git, 2026-09-05

### Measured

Both rows lived only in the emailwerk database. Every edit was a change in a
web editor nobody could diff, and the sibling brand had a script and eight
files while this brand had none. The request listed `transferId`, the
transfer's uuid, and a return trip was one row without a date.

### What changed

`mail-templates/` holds the two bodies as they were fetched on 2026-09-05
(`limosen-request.html`, `limosen-confirmation.html`), plus `subjects.json` and
`ids.json`. The request lists the booking first, "Booking: BQ7Q4W (outbound
BQ7Q4W-1, return BQ7Q4W-2)", then a "Rückfahrt" row with the return date, time
and the route swapped, and the copy block for WhatsApp starts with "Buchung
BQ7Q4W". The confirmation repeats both legs to the visitor. When the pylon
refused, all three codes are empty and both templates say the booking is not in
the system yet. The uuid is not a variable any more.

The variables a template may read are declared by the script: contact, ride,
`returnDate`, `returnTime`, `bookingCode`, `code`, `returnCode`, vehicle,
payment, `agreeToTerms`, `locale`, `invokedOnUrl`, `year`. None is required, an
undeclared variable renders empty.

### How to push a template

```sh
EMAILWERK_AUTH='user:pass' ./scripts/update-mail-templates.py            # dry run
EMAILWERK_AUTH='user:pass' ./scripts/update-mail-templates.py --commit   # update in place
```

The script updates the two ids from `ids.json` with `templateUpdate`, never
creates a row, keeps the recipients, the sender and the parent link, and sets
the variable list. Check a change without sending anything through
`templatePreview(args: {content, engine: TWIG, values})`, which renders the
raw body with the values the form would send; a return booking previewed that
way shows `BQ7Q4W`, `BQ7Q4W-1` and `BQ7Q4W-2` on both templates, and the "no
code" line when the three are empty.
