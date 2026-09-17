---
type: OKF Operations
title: Deploying limosen
description: >
  The build, the checks that stand between it and the live site, the two flags
  that decide whether it reaches the domain, the gate that runs after the
  upload and may roll it back, and why the build itself is still not on a
  runner.
tags: [limosen, cloudflare-pages, wrangler, deployment, ci]
timestamp: 2026-09-17T14:40:00+02:00
---

# Deploying limosen

```sh
./scripts/deploy.sh            # build, upload, and wait for the gate
./scripts/deploy.sh --no-wait  # the same, without watching the gate run
```

It builds this repository, uploads `public/` to the Cloudflare Pages project
`limosen` in account `92920a0740087f4d54d9201675220d43`, which serves
`limosen.at` and `new.limosen.at`, and then starts the gate described below and
waits for its verdict. The upload is not the end of the deploy.

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

## The scrub

Gatsby's HTML renderer leaves two NUL bytes inside Arabic words on
`public/ar/index.html`, at a different place on every build, and they were in
the build of 2026-05 as much as in today's. Neither the patches nor the
sources nor `page-data` carry them. A NUL in HTML text is displayed as U+FFFD,
so a word reads with a "�" in it. The script strips them from every HTML file
after the build and refuses to deploy if any survive.

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
into a 404. Since 2026-09-05 the page is bare: the logo, one progress line that
changes every moment, no footer and no imprint or privacy link (32e9cf8), and
it carries the app's colour mode rather than the website's forced light, so
this brand lands dark. Deployed with app 1.1.0. The one line it shows
carries `role="status"`, it is the status message the page has in place of
a spinner. And the hand over from this dark page to the forced-light home
page once left the cookie consent banner in its dark theme on a light page,
because jaen mirrored the colour mode into the banner's class only when its
hook changed, which a client-side route change does not do. jaen `2df0678`
watches the class on `<html>` instead, verified with the 1.1.0 deploys of
the evening:
after `/loading` the banner on `/` is white with dark text, as on a cold
load.

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

## The gate after the upload

An upload that leaves the contact form refusing every enquiry looks exactly
like a good deploy. It happened: on 2026-09-07 an audience script wiped the
stored recipients off all four request templates, every contact and every
booking on this site answered "Something went wrong", and the site was uploaded
nine more times over the following ten days without anybody noticing, because
nothing asked the live system anything after a deploy.

Since 2026-09-17 `scripts/deploy.sh` ends by starting
`.github/workflows/post-deploy.yaml` with the deployment wrangler has just
published, and watches it:

```sh
gh workflow run post-deploy.yaml -R netsnek/limosen.at --ref main -f deployment_id="<short id>"
gh run watch <run> -R netsnek/limosen.at --exit-status
```

The short id is read out of wrangler's own "Take a peek over at
`https://<short>.limosen.pages.dev`", and when wrangler words that differently
it is read from the API instead, as the project's canonical deployment, with
the token that is already in `.env`. Without `gh`, or without a login, the
script prints the command above and exits non-zero: the upload has happened,
but the deploy is not finished until the gate has run.

The workflow runs the two notebooks of `tests/` against the live site
([tests/README.md](../../tests/README.md) says what they prove). They read the
deployed bundle's own template map, ask emailwerk whether those templates are
still public and still carry `office@limosen.at` and `limosen@netsnek.com`, fill
the contact form and the booking form in a headless Chromium with both backends
intercepted, and assert what the page actually posts. Nothing is sent and
nothing is written.

### What it does when the site fails

Rolling back is not automatic just because something is red. Cloudflare Pages
keeps every deployment's output, so a rollback is a new production deployment
made from an older one's content, which is instant, but it is also useless when
the fault is not in the content. So the workflow first runs the same contract
against the deployment it would roll back to. Not a fixed notebook: the ones
that failed, and only after they have failed twice. Whatever failed against
production is re-run against production once more first, because notebook 02
does four full page loads behind a CDN on a shared runner and notebook 01 makes
sixteen calls over the open internet, and one of those going wrong once is not
something to revert a deploy over. Then:

- **the previous deployment passes** — the upload is what broke it.
  `tests/rollback.py --deployment <id>` makes that older deployment live again,
  both notebooks run once more, and the run summary names what is serving now.
- **the previous deployment fails the same way** — emailwerk or `api.limosen.at`
  is what is broken, and reverting would lose good content for nothing. Nothing
  is rolled back and the summary says why.
- **no deployment id, or the plan refuses** — the run only reports. The plan
  refuses when the given deployment is not the one being served any more
  (something newer went out since), when it cannot be found, and when there is
  nothing older to go back to.

The run always ends non-zero when the live site failed, even after a successful
rollback: the site is serving again, but this deploy did not succeed.

`tests/out`, the executed notebooks plus any screenshot a failing browser check
left behind, is uploaded as the run's artifact.

### The schedule, and the drill

The workflow also runs every six hours (`23 */6 * * *`). Those runs carry no
deployment id, so they can never roll anything back; they only report, which is
what would have raised a hand on 2026-09-08.

Starting it by hand with `drill: true` makes the first production run fail on
purpose (`SMOKE_DRILL=1` fails one check of notebook 01 and nothing else), so
the whole path can be exercised on a healthy system: plan, the check against
the previous deployment, a real rollback, and the recheck. The site is then
serving the deployment before the current one, and the operator deploys again
with `./scripts/deploy.sh`.

## Why the build is still not on a runner

`link:` dependencies pointing at a sibling checkout of an unpublished branch. A
runner has no such sibling. It stops being true when the jaen packages are
published. On 2026-09-05 the sibling was ten commits and an uncommitted
working tree ahead of `netsnek/jaen@feat/chakra-v3`, so even a checkout of
that branch would have built a different site.

`publish.yaml` built a Docker image nobody consumed and was removed on
2026-09-05, together with the push trigger that had `deploy.yaml` call
`atsnek/jaen`'s reusable deploy on every push to main and fail on every run
since 2025-11-27. `deploy.yaml` itself came back two days later without that
trigger: it answers only `workflow_call` and `workflow_dispatch`, so nothing
starts it by itself, and its header says why it is kept, as the one place an
Actions build of this site names `OSG_TOKEN` (the build that actually ships
reads the token in `scripts/deploy.sh`). `jaen-publish.yaml` only records a CMS
publish (see [content.md](content.md)) and `post-deploy.yaml` only checks a site
that is already live. Nothing in `.github/workflows/` builds the site, which is
why these can run on a runner at all; the build is still this script, after a
pull.

The Cloudflare Pages project each of them names is this brand's, and that is not
left to good intentions either: section 3 of
[tests/01-contact-mail-contract.ipynb](../../tests/01-contact-mail-contract.ipynb)
reads every file in `.github/workflows/` and fails if one names the sibling's
project. It is the only brand question asked of a file the build never writes,
and the sibling repository's own deploy workflow had aimed at this project for
months before anybody looked.

## The branch

The site is built from `main`, and `main` on GitHub is the Chakra v3 tree
since 2026-09-05. Before that the tree lived only on a local branch,
`feat/chakra-v3`, while GitHub's `main` still ended at the publish of
2025-11-30, so every CMS publish landed on a branch nobody built from.
Since 2026-09-06 the local checkout is on `main` as well: `scripts/deploy.sh`
runs on the branch the site is published from, a CMS publish and a deploy
see the same history, and `feat/chakra-v3` is no longer checked out anywhere.

## Rolling back by hand

The gate does this by itself when it has to, but the same decision can be made
from a terminal:

```sh
set -a && . ./.env && set +a
python tests/rollback.py --project limosen --deployment <uuid or short id> --plan
python tests/rollback.py --project limosen --deployment <uuid or short id>
```

`--plan` prints the deployment that is live and the one that would replace it,
with the commit behind each, and changes nothing. The dashboard's own rollback
button does the same thing. Either way it is instant and needs no rebuild.

It does not undo the service worker: the app plugin ships
`gatsby-plugin-offline`, so a visitor keeps the cached shell until the new
worker takes over.
