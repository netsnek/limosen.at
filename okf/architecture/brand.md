---
type: OKF Architecture
title: One repository per brand
description: >
  Why this tree stopped building two brands, what the switch cost, and what is
  left of it.
tags: [limosen, booklimo, build]
timestamp: 2026-09-04T21:30:00+02:00
---

# One repository per brand

`netsnek/limosen.at` builds limosen.at and nothing else. The other brand lives
in `netsnek/booklimo.at` with its own copy of the same structure.

## What it was

`src/vars/site-variants.ts` held two records, `gatsby-config.ts` mirrored
`SITE_VARIANT` into `GATSBY_SITE_VARIANT`, `Logo.tsx` chose between two marks on
it, and `src/favicon-booklimo.ico` sat next to `src/favicon.ico`. A build with
`SITE_VARIANT=booklimo` produced the other company's site out of this tree.

## Why it is gone

The principle is the owner's: two companies, two repositories, each maintained
on its own. A shared tree makes every change to one brand a change to the other
whether or not that was intended.

The evidence is a defect the arrangement produced. `ACTIVE_VARIANT` read
`process.env.SITE_VARIANT`, and Gatsby inlines only `GATSBY_` prefixed variables
into the browser bundle. Server rendering therefore resolved to booklimo and
hydration to limosen: a visitor watched the contact mail address change from
KRC's to this company's a moment after the page appeared.

And the trap outlived the split. On 2026-09-04 the working tree's `public/` was
found carrying the other company's phone number, because a build had been run
with the variable set and nothing said so. That is why the deploy script now
unsets `SITE_VARIANT` explicitly rather than trusting it to be absent, and
refuses a build that carries the other brand's contact details or is missing
this one's.

## What replaced it

| was | is |
|---|---|
| `VARIANTS` with two records, `ACTIVE_VARIANT` | one `SITE` constant in `src/vars/site-variants.ts` |
| `Logo.tsx` choosing on a build variable | `Logo.tsx` re-exporting `Logo-limosen` |
| `src/favicon-booklimo.ico` | deleted |
| `SITE_VARIANT=booklimo npx gatsby build` here | that brand's own repository |

The file is still called `site-variants.ts` and still exports `SITE`, so no call
site had to move. The name is now wrong and that is the only reason to rename it.

## What the two still share

Nothing at build time. They share a jaen checkout as a sibling (`../jaen`),
because the jaen packages are `link:` dependencies, and they share the app and
the pylon source in `netsnek/taxi-app`.
