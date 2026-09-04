---
type: OKF Operations
title: Mail
description: >
  The contact template pair, and the one flag that meant no enquiry from this
  site ever reached the company.
tags: [limosen, emailwerk, mail, cors]
timestamp: 2026-09-04T23:30:00+02:00
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
