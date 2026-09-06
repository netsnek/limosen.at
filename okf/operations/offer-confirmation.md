---
type: OKF Operations
title: The offer confirmation page
description: >
  The page a customer lands on from the offer mail, /angebot/<token>, what it
  reads and writes on api.limosen.at without an account, the words it has
  for every state in the four languages, and how it was measured on a local
  production build against a local worker with the offer backend.
tags: [limosen, offer, confirmation, graphql, pylon, i18n]
timestamp: 2026-09-06T19:30:00+02:00
---

# The offer confirmation page

The offer mail (see taxi-app's
[okf/architecture/offers-and-documents.md](https://github.com/netsnek/taxi-app/blob/main/okf/architecture/offers-and-documents.md))
carries two links to this site, `/angebot/<token>` for Bestätigen and
`/angebot/<token>/ablehnen` for Ablehnen. The page behind both is
`src/pages/angebot/[...].tsx`, a client route on Gatsby's splat, with the
transport in `src/services/offer.ts`. The build writes `_redirects` with
`/angebot/* /angebot/[...]/ 200`, so Cloudflare Pages serves the one
document for every token.

## What it is

A bare page, without the site's frame, on the letterhead the offer PDF is
set on: white paper, the mark top right, the sender line in small print,
the bold title "Angebot Nr. AN-260001" at 1.5 rem (set explicitly, the
site's heading recipe sizes its headlines for a landing page), the code and
"Gültig bis", the ride with its date and time in Vienna and its route, the
grey total row "Gesamtbetrag brutto" with the euro amount, the terms, the
button, the grey footer with the company and how to reach it. The colours
are the letterhead's own (`#ededed` for the grey row, `#666666` for the
footer, the brand gold `#d4af37` for the button), not the site's tokens,
because the page sits outside the routes that carry a colour mode and is
forced light like every public page. The number never wraps, the phone
number and the route are isolated left to right so they read the same
under Arabic.

## One link, one button

The pylon signs the action into the token (`pylon/src/offers/token.ts`):
the confirm link's token confirms, the decline link's token declines, and
the other call answers `OFFER_LINK_INVALID`. So the page shows one button,
the one for the action the summary names (`action`, the path's `/ablehnen`
only until the summary is there), and a line below it that the other
answer is the other link in the mail. Two buttons that both work off one
token would need the pylon to sign one token for both actions, and the
brief's "Ablehnen refused after a confirmation" is what the decline link
meets: a ride already confirmed shows the confirmed words and no button.

The button follows the hard rule on touch: at least 44 px high, full
width below `sm`.

## What it reads and writes

Three public operations of the brand's pylon, the token from the url the
only credential, no bearer token:

| operation | when |
|---|---|
| `offerByToken(args:{token})` | on open, the summary |
| `confirmOffer(args:{token})` | Bestätigen |
| `declineOffer(args:{token})` | Ablehnen |

All three answer the pylon's `OfferSummary`: `code`, `number`, `language`,
`pickupDateTime`, `pickupLocation`, `dropoffLocation`, `total`,
`validUntil`, `customerStatus`, `state`, `action`, `changed`, `statusAt`.
No uuid, no passenger. The selection is one string in
`src/services/offer.ts`, so a renamed field is one edit. Both mutations
answer the summary, so the page shows the new state without a second read.
Arguments are written into the document as literals, not as variables,
for the reason [booking.md](booking.md) gives.

## Every word in the booking's language

The summary carries the booking's language, and that decides every word on
the page: a Turkish booking gets a Turkish page whatever the browser says.
Until the summary is there, and on a link the pylon refuses (there is no
booking to read a language off), the browser's language decides, reduced to
the four the sites speak, German otherwise. Arabic is right to left with
Latin digits, so the code, the price and the date read as they do on the
PDF. Dates are formatted for Vienna in the language's locale.

## The states, in words

| state | the page |
|---|---|
| `OFFERED` | the summary, the intro, the button of the link's action |
| Bestätigen answered | "Vielen Dank! Ihre Fahrt BQ7Q4W-1 ist bestätigt." and the mail hint, no button |
| Ablehnen answered | "Sie haben das Angebot abgelehnt.", no button |
| `CONFIRMED`, `INVOICED`, `PAID` on open | "Dieses Angebot ist bereits bestätigt.", no button (a confirmation is idempotent on the pylon, the second visit of the link is this) |
| `DECLINED` on open, declined before its validity ran out | "Dieses Angebot wurde abgelehnt." |
| `DECLINED` on open, declined at or after its validity | "Dieses Angebot ist verfallen. Die Fahrt wurde nicht rechtzeitig bestätigt und ist storniert." (the 24 hour rule) |
| `NEW` on open | "Für diese Fahrt liegt noch kein Angebot vor." |
| `OFFER_EXPIRED` on open | "Dieser Link ist abgelaufen." |
| `OFFER_LINK_INVALID`, no token, anything else | "Dieser Link ist ungültig. Bitte öffnen Sie den Link aus Ihrer E-Mail." |
| `OFFER_CONFIRMED` on Ablehnen | "Das Angebot wurde bereits bestätigt und kann nicht mehr abgelehnt werden.", the summary stays |
| `OFFER_DECLINED` on Bestätigen | "Das Angebot wurde bereits abgelehnt und kann nicht mehr bestätigt werden." |
| `OFFER_EXPIRED` on the button | the "verfallen" sentence above |
| the wire down | "Die Verbindung ist fehlgeschlagen." and a button "Erneut versuchen" |

Every state ends with the contact line, phone and mail from `src/vars`.

## Measured, 2026-09-06

On a local production build of this repository (an rsync copy beside a
copy of the jaen checkout with the app plugin at its committed tree, built
the way `scripts/deploy.sh` builds, served by `gatsby serve`) against a
local `wrangler dev` of the pylon with the offer backend, a throwaway D1
with every migration applied and an `OFFER_KEY` of the run's own. Every
call the page made to `api.limosen.at` was intercepted by playwright and
answered by that worker, so the bundle under test carried the real
`SITE.appPylonUrl`. Eleven rides were booked through the public
`bookTransfer` with a passenger in the case's language and moved into
their states with SQL on the throwaway database, an `OFFER` document row
per ride so the summary carries a number, and the tokens signed the way
`token.ts` signs them, the forged one under another key, the expired one
with an expiry in the past.

54 checks, at 1280 wide in a German browser and once at 390:
the German confirm link shows the letterhead, the title with the number,
the code, "Gültig bis", the ride's date in Vienna and its route, "€ 245,00"
brutto, Bestätigen alone at 44 px and the line about the other link.
Bestätigen answers "Vielen Dank! Ihre Fahrt CODE ist bestätigt.", one
`confirmOffer` with the token on the wire, the ride read back `CONFIRMED`,
the link opened again "bereits bestätigt" without a button, the decline
link of that ride the same. The English decline link shows "Offer no.",
Decline alone in the brand gold, answers "You have declined the offer.",
the ride read back `DECLINED` and `CANCELED`, its confirm link afterwards
"has been declined". Turkish "Teklif No." with Onayla and "Geçerlilik
tarihi", Arabic right to left with تأكيد and the price in Latin digits. A
ride confirmed elsewhere says "bereits bestätigt" on both links, a
declined one "wurde abgelehnt", a lapsed one "verfallen" and "storniert".
The decline link opened while the ride was `OFFERED`, the ride confirmed
through the API meanwhile, then Ablehnen: `OFFER_CONFIRMED` from the
pylon, "bereits bestätigt und kann nicht mehr abgelehnt werden" on the
page, the summary still there. An expired token "abgelaufen" with no
summary (`OFFER_EXPIRED`), a forged one "ungültig" (`OFFER_LINK_INVALID`),
an unknown one and an empty `/angebot/` the same, the empty one without a
request, and in an English browser "This link is not valid". With the wire
cut, "Die Verbindung ist fehlgeschlagen" with "Erneut versuchen", and the
retry loads the summary. At 390 the button is full width (350 px on a 350
px main) and 44 px, nothing scrolls sideways. No page error of the page's
own.

Two things the run measured that are not this page's:

- **React #418 and #423 on a repeat visit.** The second visit of any
  unprefixed page of the site in one browser, `/imprint/` and `/loading/`
  included, logs a recoverable hydration mismatch, the persisted
  `jaenjs-state` (the ui-locale store) disagreeing with the route's
  server-rendered locale. `/de/…` pages are clean. The page works either
  way, the check counts it separately.
- **The consent banner, in English.** The offer link is unprefixed, so
  the route's locale is the site's default and jaen's cookie banner
  appears in English under a German offer until answered. The page sets
  no cookie of its own. Excluding `/angebot` from the banner is jaen's
  route list (`wrap-root-element.tsx`), and a link under the language
  prefix would need the i18n plugin to translate the splat's `matchPath`,
  which it does not: `_redirects` maps `/angebot/*` three times and
  `/de/angebot/*` never.
