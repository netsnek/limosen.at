---
type: OKF Bundle
title: limosen, Knowledge and Provenance Bundle
description: >
  Open Knowledge Format bundle for limosen.at, the site of LIMOSEN KG. Records
  what the site is, how it stopped being one tree serving two brands, how its
  content, identity, booking and mail work, how it is deployed, and which
  decisions are settled.
tags: [limosen, okf, netsnek, jaen, chakra, cloudflare-pages, zitadel, emailwerk]
timestamp: 2026-09-17T14:40:00+02:00
---

# limosen, Knowledge and Provenance Bundle

## limosen in one sentence

limosen.at is the marketing site and dispatch app of **LIMOSEN KG**: a Gatsby
site on jaen v3 and Chakra v3, deployed to Cloudflare Pages, with its users in
its own Zitadel organization and its data behind `api.limosen.at`.

## What makes it distinctive

1. **The two brands are never mixed.** This site is LIMOSEN KG; KRC
   Limousinenservice KG on booklimo.at is another company, not another
   configuration. No address, number, template, logo, backend or colour crosses
   between them, the deploy script refuses a build that carries the other
   brand's data, and the suite in `tests/` asks the same of the site that is
   live. The owner's first rule since 2026-09-17, see
   [decisions/hard-rules.md](decisions/hard-rules.md).
2. **It is the older and richer of two sibling sites.** booklimo.at was derived
   from this tree and is now `netsnek/booklimo.at`, maintained separately. A fix
   that matters to both is applied twice, deliberately.
3. **The variant switch is gone.** This tree used to build both brands on
   `SITE_VARIANT`, and that produced a defect a visitor could see: Gatsby inlines
   only `GATSBY_` prefixed variables, so server rendering resolved to one brand
   and hydration to the other, and the contact address changed under the reader.
4. **Three things had been silently broken for a long time**, all three
   invisible from the outside: the booking form posted to a schema that no
   longer existed, the contact form's mail template was not public so a
   signed-out visitor's enquiry was refused (both found 2026-09-04), and the
   request templates lost their stored recipients on 2026-09-07, which broke
   every enquiry for ten days and nine deploys. None of them produced an error
   anybody saw, which is why there is a gate after the upload now.

## Contents

- [architecture/brand.md](architecture/brand.md) — one repository per brand, and what replaced the switch
- [architecture/identity.md](architecture/identity.md) — the Zitadel organization, the shared client, the app's users
- [operations/deploy.md](operations/deploy.md) — building and shipping, the checks, why not in CI
- [operations/content.md](operations/content.md) — the jaen patch chain and how the CMS publishes
- [operations/booking.md](operations/booking.md) — the one call the booking form makes
- [operations/mail.md](operations/mail.md) — the contact template and why it delivered nothing
- [../tests/README.md](../tests/README.md) — the post-deploy gate, what each notebook proves and how the rollback decides
- [operations/offer-confirmation.md](operations/offer-confirmation.md) — the page behind the offer mail's two links, what it reads and writes without an account, the states in words
- [decisions/hard-rules.md](decisions/hard-rules.md) — what must not be reopened
- [provenance/timeline.md](provenance/timeline.md) — how it got here
- [what was live without a source, across the platform](https://github.com/netsnek/taxi-app/blob/main/okf/provenance/lost-and-found.md) — including this site's own unpushed branch and its content on osg.snek.at
