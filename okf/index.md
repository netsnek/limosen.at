---
type: OKF Bundle
title: limosen, Knowledge and Provenance Bundle
description: >
  Open Knowledge Format bundle for limosen.at, the site of LIMOSEN KG. Records
  what the site is, how it stopped being one tree serving two brands, how its
  content, identity, booking and mail work, how it is deployed, and which
  decisions are settled.
tags: [limosen, okf, netsnek, jaen, chakra, cloudflare-pages, zitadel, emailwerk]
timestamp: 2026-09-04T21:30:00+02:00
---

# limosen, Knowledge and Provenance Bundle

## limosen in one sentence

limosen.at is the marketing site and dispatch app of **LIMOSEN KG**: a Gatsby
site on jaen v3 and Chakra v3, deployed to Cloudflare Pages, with its users in
its own Zitadel organization and its data behind `api.limosen.at`.

## What makes it distinctive

1. **It is the older and richer of two sibling sites.** booklimo.at was derived
   from this tree and is now `netsnek/booklimo.at`, maintained separately. A fix
   that matters to both is applied twice, deliberately.
2. **The variant switch is gone.** This tree used to build both brands on
   `SITE_VARIANT`, and that produced a defect a visitor could see: Gatsby inlines
   only `GATSBY_` prefixed variables, so server rendering resolved to one brand
   and hydration to the other, and the contact address changed under the reader.
3. **Two things had been silently broken for a long time**, both found on
   2026-09-04 and both invisible from the outside: the booking form posted to a
   schema that no longer existed, and the contact form's mail template was not
   public, so a signed-out visitor's enquiry was refused. Neither produced an
   error anybody saw.

## Contents

- [architecture/brand.md](architecture/brand.md) — one repository per brand, and what replaced the switch
- [architecture/identity.md](architecture/identity.md) — the Zitadel organization, the shared client, the app's users
- [operations/deploy.md](operations/deploy.md) — building and shipping, the checks, why not in CI
- [operations/content.md](operations/content.md) — the jaen patch chain and how the CMS publishes
- [operations/booking.md](operations/booking.md) — the one call the booking form makes
- [operations/mail.md](operations/mail.md) — the contact template and why it delivered nothing
- [decisions/hard-rules.md](decisions/hard-rules.md) — what must not be reopened
- [provenance/timeline.md](provenance/timeline.md) — how it got here
