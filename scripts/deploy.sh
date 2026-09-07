#!/usr/bin/env bash
#
# Build and deploy limosen.at.
#
# This repository still carries the SITE_VARIANT switch that used to produce
# both brands. The other brand has its own repository now, so a build here is
# always limosen and the variable is deliberately unset below rather than
# merely left alone: a stale export in a shell is otherwise enough to publish
# the wrong company's phone number to this domain, and the checks further down
# exist because that has already happened to the working tree.
#
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"

[ -d "../jaen/packages/gatsby-plugin-jaen" ] || {
  echo "the linked jaen checkout has to be a sibling of this repository: ../jaen" >&2
  exit 1
}

# The storage gateway is private, so the build has to be able to read this
# site's media: gatsby-source-jaen fetches every file the jaen data names with
# OSG_TOKEN and writes them into public/osg/, and the published site serves
# them itself. Without the token the build stops on the first media node.
# The token is the personal access token of this organisation's storage
# machine user; the file is 0600 and lives beside the taxi platform's own
# token files. See jaen docs/architecture/private-storage.md, "The build".
if [ -z "${OSG_TOKEN:-}" ] && [ -f "$HOME/.config/jaen/osg.env" ]; then
  # shellcheck disable=SC1091
  set -a && . "$HOME/.config/jaen/osg.env" && set +a
fi
[ -n "${OSG_TOKEN:-}" ] || {
  echo "OSG_TOKEN is required to fetch media from the storage gateway." >&2
  echo "Put it in ~/.config/jaen/osg.env (mode 0600) or export it." >&2
  exit 1
}

echo "==> build"
rm -rf public .cache
# SENTRY_OFF because gatsby-plugin-jaen derives SENTRY_URL from the DSN origin,
# which is the ingest host and not the API host, so the release step fails the
# whole bundle. The runtime DSN is unaffected.
#
# --no-network-family-autoselection because this machine publishes AAAA records
# it cannot reach: node's fetch tries IPv6 first and sits in ETIMEDOUT where
# curl gets through in a moment. The build pulls every media file from the
# storage gateway, so one stalled lookup is a build that never finishes.
env -u SITE_VARIANT -u GATSBY_SITE_VARIANT \
  SENTRY_OFF=1 \
  NODE_OPTIONS="--max-old-space-size=8192 --no-network-family-autoselection" \
  npx gatsby build

echo "==> scrub"
# Gatsby's HTML renderer leaves two NUL bytes inside Arabic words on
# public/ar/index.html, at a different place on every build; neither the
# patches nor the sources nor page-data carry them. A NUL in HTML text is
# shown as U+FFFD, so the word reads with a "�" in it. Stripped here, and
# counted, so a build that grows more of them is noticed.
# grep exits 1 when it finds nothing, and under pipefail that used to end the
# script right here on the one kind of build that needs no scrub at all.
nuls=$( (grep -l -P '\x00' -r public --include='*.html' || true) | wc -l)
echo "html files with NUL bytes before scrub: $nuls"
find public -type f -name '*.html' -exec perl -pi -e 's/\x00//g' {} +
grep -l -P '\x00' -r public --include='*.html' && { echo "NUL bytes survived the scrub" >&2; exit 1; }

echo "==> checks"
grep -q "https://limosen.at" public/index.html || { echo "built with the wrong site url" >&2; exit 1; }
test -d public/loading || { echo "no /loading route, the login redirect would 404" >&2; exit 1; }

# The other brand must not reach these pages. Its phone number in this build
# means SITE_VARIANT leaked in and every visitor would be given a competitor's
# contact details.
if grep -rq --include='*.html' -e "office@krclimo.at" -e "699 109 983 52" -e "KRC Limousinenservice" public; then
  echo "the other brand's data is in this build, SITE_VARIANT leaked" >&2
  grep -rl --include='*.html' -e "office@krclimo.at" -e "699 109 983 52" public | head -5 >&2
  exit 1
fi

# This company's own contact details have to actually be there.
grep -rq --include='*.html' "660 876 06 06" public || {
  echo "this company's phone number is missing from the build" >&2
  exit 1
}

echo "==> deploy"
# --project-name because wrangler 4 ignores CLOUDFLARE_PROJECT_NAME, and
# --branch main because it would otherwise infer the git branch and publish a
# preview that never reaches limosen.at. The token comes from .env, which
# wrangler loads by itself.
# The same AAAA problem as the build above: wrangler is node and its upload
# died with "fetch failed" on 2026-09-05 when the flag was only on the build.
NODE_OPTIONS="--no-network-family-autoselection" \
  npx wrangler pages deploy public --project-name limosen --branch main --commit-dirty=true
