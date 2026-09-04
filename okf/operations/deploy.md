---
type: OKF Operations
title: Deploying limosen
description: >
  The build, the checks that stand between it and the live site, the two flags
  that decide whether it reaches the domain, and why there is no CI.
tags: [limosen, cloudflare-pages, wrangler, deployment]
timestamp: 2026-09-04T23:30:00+02:00
---

# Deploying limosen

```sh
./scripts/deploy.sh
```

It builds this repository and uploads `public/` to the Cloudflare Pages project
`limosen` in account `92920a0740087f4d54d9201675220d43`, which serves
`limosen.at` and `new.limosen.at`.

## What the build needs

`../jaen` has to exist next to this checkout, because the jaen packages are
`link:` dependencies. The script says so before it starts rather than failing
three minutes in.

Three environment settings are not decoration:

- **`SITE_VARIANT` and `GATSBY_SITE_VARIANT` are unset explicitly**, not merely
  left alone. This tree used to build both brands and a stale export in a shell
  was enough to publish a competitor's phone number to this domain. The working
  tree's `public/` was found in exactly that state on 2026-09-04.
- `SENTRY_OFF=1`, because `gatsby-plugin-jaen` derives `SENTRY_URL` from the
  DSN's origin, which is the ingest host and not the API host, and the release
  step then fails the whole bundle.
- `NODE_OPTIONS=--no-network-family-autoselection`, because this machine
  publishes AAAA records it cannot reach and node's fetch tries IPv6 first. The
  build downloads every media file from the storage gateway.

## The checks

```
grep -q "https://limosen.at" public/index.html
test -d public/loading
grep -rq office@krclimo.at | 699 109 983 52 | KRC Limousinenservice  -> refuse
grep -rq "660 876 06 06"                                             -> require
```

The third one earned its place on its first run: it found
`jaen-data/2026-09-04-krc-branding.json` still in this repository's patch list,
left there when the two brands were split. Without it this site would have
introduced itself as KRC Limousinenservice in all four languages.

`/loading` is where the OIDC redirect lands. Without the route the login bounces
into a 404.

## The two flags

```sh
npx wrangler pages deploy public --project-name limosen --branch main
```

`--project-name` because wrangler 4 no longer reads `CLOUDFLARE_PROJECT_NAME`.
`--branch main` because wrangler otherwise infers the branch from git, and any
branch that is not the production branch produces a preview deployment that
never reaches `limosen.at`.

The credentials come from `.env`, which wrangler loads itself. That token can
deploy Pages and read the zone list. It cannot touch DNS.

## Why there is no GitHub Actions workflow

`link:` dependencies pointing at a sibling checkout of an unpublished branch. A
runner has no such sibling. It stops being true when the jaen packages are
published.

## Rolling back

`npx wrangler pages deployment list --project-name limosen`, then roll back in
the dashboard. Instant, no rebuild. It does not undo the service worker: the app
plugin ships `gatsby-plugin-offline`, so a visitor keeps the cached shell until
the new worker takes over.
