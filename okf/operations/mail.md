---
type: OKF Operations
title: Mail
description: >
  One template pair per language, the confirmation in the language the booking
  was made in, and the one flag that meant no enquiry from this site ever
  reached the company.
tags: [limosen, emailwerk, mail, cors, transfer-code, i18n]
timestamp: 2026-09-06T08:00:00+02:00
---

# Mail

Both forms post to emailwerk at `https://emailwerk.com/graphql`, from the
visitor's browser, with no credential.

## One pair per language, since 2026-09-06

| language | request, to the company | confirmation, to the visitor |
|---|---|---|
| de | `cmtpcq5hb018fps2pkeapmunv` | `cmtpcq6cp019aps2py08a3xp3` |
| en | `cmtpcq6q301a5ps2p9vjrwdvm` | `cmtpcq72w01b0ps2p9tf5p4za` |
| tr | `cmtpcq7r701bvps2pildtg46n` | `cmtpcq83x01cqps2pb9ijue2i` |
| ar | `cmtpcq8i701dlps2pwth09w43` | `cmtpcq8v501egps2p4f5oqrv8` |

The request goes to `office@limosen.at` and `limosen@netsnek.com`, the
confirmation to the visitor through `envelope.replyTo`. The site sends
**only the parent**. The server enqueues the confirmation itself, which is why
sending the child from the site would double every confirmation. Both forms
pick the pair by locale in `src/services/mail-templates.ts`, the booking form
and the contact form alike.

Until the switch is deployed the live site still posts the old English pair,
`Contact` (`cmsmguuq3002lrb2pa47hpmc5`, to `office@limosen.at`,
`office@erebos.xyz`, `limosen@netsnek.com`) with `Confirmation of Your
Contact Request` (`cmsmgut2u000prb2p216pcfwn`) as its child. See "The chain"
below for when it is unpublished.

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

`mail-templates/` held the two bodies as they were fetched on 2026-09-05
(`limosen-request.html`, `limosen-confirmation.html`, replaced by the eight
files of 2026-09-06 below), plus `subjects.json` and `ids.json`. The request lists the booking first, "Booking: BQ7Q4W (outbound
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

The 2026-09-05 script, `update-mail-templates.py`, updated the two ids of the
English pair in place. It went with that pair on 2026-09-06, and the eight
files are pushed by the script the sibling brand has:

```sh
EMAILWERK_AUTH='user:pass' ./scripts/create-mail-templates.py            # dry run
EMAILWERK_AUTH='user:pass' ./scripts/create-mail-templates.py --commit   # create or update
```

The script finds the eight rows by their `Limosen <LANG> Booking <Kind>`
description and updates them with `templateUpdate`, creating one only when
it is missing, sets `isPublic`, the sender, the recipients and the variable
list, relinks each confirmation to its request through `parentId`, and
rewrites `ids.json`. Check a change without sending anything through
`templatePreview(args: {content, engine: TWIG, values})`, which renders the
raw body with the values the form would send; a return booking previewed that
way shows `BQ7Q4W`, `BQ7Q4W-1` and `BQ7Q4W-2` on both templates, and the "no
code" line when the three are empty.

## The chain, measured 2026-09-06

The confirmation to the visitor is emailwerk's one level of public
children: the site sends the parent, the server delivers every public child
template to the requester address (`envelope.replyTo`, else `values.email`).
Read from the emailwerk API on 2026-09-06: booklimo's four language pairs are
linked and public, and its message log shows request plus confirmation for
every booking, in the form's language. This site's are not: the live pair is
the English "Contact" (`…2pa47hpmc5`, to office@limosen.at, office@erebos.xyz,
limosen@netsnek.com) with the English "Confirmation of Your Contact Request"
(`…2p216pcfwn`) as its only child, used for all four languages of both the
booking and the contact form. The German, Turkish and Arabic templates exist
(`DE Contact …2pzrfi73rb`, `TR Contact …2pqsano4c2`, `AR Contact …2pj8pi6ron`
with their confirmations) but are unpublished, the German and Arabic
confirmations carry no parent, and their recipient is limosen@netsnek.com
alone. A German visitor gets an English confirmation.

Rule (owner, 2026-09-06): the confirmation is decided by the language the
booking or the contact was made in, on both brands, for the booking form and
the contact form alike. Target: four pairs "Limosen DE|EN|TR|AR Booking
Request" (to office@limosen.at and limosen@netsnek.com) each with a public
confirmation child in the same language, filed as `mail-templates/*.html`
with `subjects.json` and `ids.json` and pushed by a `scripts/create-mail-
templates.py` like booklimo's, the site choosing the pair by locale in
`src/services/mail-templates.ts` the way booklimo does, the contact form
included. The old English pair stays until the switch is verified and is
then unpublished. Acceptance: `templatePreview` of a Turkish booking shows the
Turkish confirmation as the child, and a test booking in each language logs
one request per office address and one confirmation to the visitor in that
language.

### What changed, 2026-09-06

`mail-templates/` holds eight files, `limosen-{de,en,tr,ar}-{request,
confirmation}.html`, with `subjects.json`, `ids.json` and a `README.md`. They
are the sibling brand's eight files with the brand swapped back (links,
addresses, phone number, company name, the Instagram handle, the first line of
the copy block), so the request and the English confirmation carry the wording
the old pair had, and the German, Turkish and Arabic confirmations are the
ones booklimo's visitors already get. One change of layout: the copy block for
WhatsApp sits at the top of the request, above the fields it repeats. The four
requests are byte-identical, the office reads German whatever language the
visitor booked in. `scripts/create-mail-templates.py` pushed them on
2026-09-06 as `Limosen DE|EN|TR|AR Booking Request` (public, to
`office@limosen.at` and `limosen@netsnek.com`, the sender `office@snek.at` the
old pair used) each with `Limosen <LANG> Booking Confirmation` as its public
child, the ids in the table at the top. `office@erebos.xyz`, the old pair's
third recipient, is not on the new rows.

`src/services/mail-templates.ts` maps a locale onto the pair by its first two
characters, German as the fallback, the way booklimo does, and both
`booking.tsx` and `contact.tsx` send `templateForLocale(locale)` alone, with
the visitor as `replyTo`. The contact form reads the locale from
`react-intl`, which it did not before.

Measured on 2026-09-06 against the live emailwerk, before any deploy:

- `templatePreview` of a return booking on every pair: the codes on the
  request and on the confirmation, no unrendered tag, nothing of the other
  brand, and the child of each request is the confirmation of the same
  language, with its subject in that language ("Bestätigung Ihrer
  Kontaktanfrage", "Confirmation of Your Contact Request", "İletişim
  Talebinizin Onayı", "تأكيد طلب التواصل الخاص بك").
- One real booking per language on a local production build of this site
  (an rsync copy, served under `https://limosen.at` through a certificate of
  the run's own so the Origin is the real one), the visitor
  `office@netsnek.com`, plus one Turkish contact enquiry. The browser sent
  exactly one `sendTemplateMail` per form, the parent of the form's language
  with `envelopeOverride.replyTo` the visitor, and `bookTransfer` minted a
  code each time (`WW55TR-1`, `UM95W6-1`, `PXZBFY-1`, `LJ2ZHD-1`). The
  message log then shows, per booking, the request to `office@limosen.at`
  and to `limosen@netsnek.com` and one confirmation to the visitor from the
  child of that language, fifteen messages, all `SENT` on the first attempt.
  The four transfers were deleted from D1 afterwards.

One thing the run measured that nobody had asked: emailwerk rate limits
anonymous sends per address, and the sixth send within a few minutes was
refused with `PUBLIC_SEND_RATE_LIMITED` (429, "retry in 342 seconds"). A
visitor who sees the error toast and tries again inside that window is
refused again. Not a defect of the templates, but the reason the two brands
have to be verified in separate windows.

Open: the live site posts the old English pair until the switch is deployed.
Unpublishing it before that would refuse every enquiry, the failure this page
opens with. After the deploy and one real enquiry on the live site,
`templateUpdate(args: {id, isPublic: false})` on `cmsmguuq3002lrb2pa47hpmc5`
and `cmsmgut2u000prb2p216pcfwn` retires it, and this page records the date.
