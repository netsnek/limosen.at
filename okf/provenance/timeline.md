---
type: OKF Provenance
title: Timeline
description: How this site got to where it is, with dates that can be checked.
tags: [limosen, provenance]
timestamp: 2026-09-04T23:30:00+02:00
---

# Timeline

**2025-11-27** The backend gets a database. Before this the worker had none and
kept its data in Google Sheets. The first `schema.prisma` says
`provider = "sqlite"`, on Cloudflare D1 through the adapter, and every schema
since has said the same. There has never been a Postgres interval.

**2026-02-27** The build that was still live in September. From here the source
kept moving and the deployment did not.

**2026-08 to 2026-09** The migration from Chakra 2.8 to 3.36 against a pinned
jaen v3, on this tree. The sibling brand's second configuration was not migrated
and by the end could not build at all.

**2026-09-04** Three things that had been quietly wrong came out on the same day,
and the site was deployed for the first time since February.

- **Every booking made on this site had been refused.** The form posted the flat
  argument list of a schema that had taken a single `args` object for months, so
  the visitor got "Booking not created" next to a green success for the mail, the
  enquiry arrived, and nothing ever reached dispatch.
- **No enquiry from this site had ever reached emailwerk.** Both templates
  carried `isPublic: false`, which is refused for a signed-out caller before a
  message row exists. The message log held zero rows for limosen. Set public and
  verified by submitting the real form once: three messages, all `SENT`.
- **The other brand's page metadata was still in this repository's patch list.**
  `2026-09-04-krc-branding.json` would have made this site introduce itself as
  KRC Limousinenservice in all four languages on the next build. The new deploy
  script's check found it on its first run.

Also that day: the WhatsApp links were built from the formatted phone number and
went to `%2B43%20660...`; the header login button called a function that throws
outside three specific routes; the variant switch, the sibling brand's logo and
its favicon were removed from this tree; and the app's driver picker learned to
offer only people who actually hold the driver role.

## What is still open

The OIDC application is shared with the sibling brand, so both present the same
`client_id` and cannot have different consent screens, token lifetimes or scopes.
A dedicated application per organization has to be created in the Zitadel
console.

Login V2 is not deployed on `accounts.netsnek.com`: `/ui/v2/login` answers 404
while the discovery document is fine.

And the permission model of the app, which is not this repository's to fix. See
`netsnek/taxi-app`, `okf/architecture/permissions.md`.
