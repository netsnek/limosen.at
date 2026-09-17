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

# The upload is not the end of a deploy. Since 2026-09-17 the script starts the
# post-deploy gate and waits for its verdict, because an upload that leaves the
# contact form refusing every enquiry looked exactly like a good deploy for ten
# days. --no-wait starts the gate and returns; the run still happens and still
# rolls back on its own if it has to.
WAIT_FOR_GATE=1
for arg in "$@"; do
  case "$arg" in
    --no-wait) WAIT_FOR_GATE=0 ;;
    *) echo "unknown argument: $arg (only --no-wait)" >&2; exit 1 ;;
  esac
done

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
# One machine user per organisation, so the brand's own file wins over the
# shared one: a token of the other organisation reads none of this site's
# files and the build would stop on the first of them.
for f in "$HOME/.config/jaen/osg-limosen.env" "$HOME/.config/jaen/osg.env"; do
  if [ -z "${OSG_TOKEN:-}" ] && [ -f "$f" ]; then
    # shellcheck disable=SC1090
    set -a && . "$f" && set +a
  fi
done
[ -n "${OSG_TOKEN:-}" ] || {
  echo "OSG_TOKEN is required to fetch media from the storage gateway." >&2
  echo "Put it in ~/.config/jaen/osg-limosen.env (mode 0600) or export it." >&2
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
# tee, because the gate below needs the deployment wrangler just created and
# wrangler only prints it. pipefail is on, so a failed upload still ends the
# script here rather than being swallowed by the pipe.
upload_log="$(mktemp)"
trap 'rm -f "$upload_log"' EXIT
NODE_OPTIONS="--no-network-family-autoselection" \
  npx wrangler pages deploy public --project-name limosen --branch main --commit-dirty=true \
  | tee "$upload_log"

echo "==> gate"
# "✨ Deployment complete! Take a peek over at https://<short>.limosen.pages.dev"
# is the only place the id appears; the short id is the first label of that
# host and is what the workflow and tests/rollback.py accept beside a uuid.
deployment_id="$(sed -n 's#.*https://\([0-9a-f]\{8\}\)\.limosen\.pages\.dev.*#\1#p' "$upload_log" | tail -1)"

# Wrangler changes that sentence from time to time. The same answer is in the
# API, as the project's canonical deployment, and .env already holds a token
# that may read it. Sourced in a subshell so the token never reaches this
# script's environment or its output.
if [ -z "$deployment_id" ] && [ -f .env ]; then
  deployment_id="$(
    set -a
    # shellcheck disable=SC1091
    . ./.env
    set +a
    curl -fsS -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN:-}" \
      "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID:-}/pages/projects/limosen" \
      | python3 -c 'import json,sys; print(((json.load(sys.stdin).get("result") or {}).get("canonical_deployment") or {}).get("id") or "")'
  )" || deployment_id=""
fi

[ -n "$deployment_id" ] || echo "could not work out which deployment this was; the gate will run but cannot roll back" >&2

# Without gh the upload has happened and the deploy has not finished, so this
# must not end green. The exact command is printed rather than described.
if ! command -v gh >/dev/null 2>&1 || ! gh auth status >/dev/null 2>&1; then
  echo "the upload is done, but the gate did not run: gh is missing or not logged in." >&2
  echo "install it (or run 'gh auth login'), then:" >&2
  echo "  gh workflow run post-deploy.yaml -R netsnek/limosen.at --ref main -f deployment_id=\"$deployment_id\"" >&2
  exit 1
fi

# Which run is this one? The dispatch answers nothing machine-readable and the
# run is created asynchronously, so it has to be looked up, and the newest run
# of this workflow is not necessarily it: the previous deploy's run is in that
# list and so is the six-hourly monitoring one. Watching one of those reports
# the verdict of an upload that is not this one, and a finished run answers
# instantly, so the terminal goes green on a deploy whose gate has not started
# yet. That is the single outcome --exit-status was added to prevent. So the id
# the list holds before the dispatch is remembered and the loop waits for a
# different one. Comparing ids rather than timestamps keeps this independent of
# whether the machine's clock agrees with GitHub's. The event filter is what
# keeps a scheduled run that starts in the meantime out of the answer.
newest_gate_run() {
  gh run list -R netsnek/limosen.at --workflow post-deploy.yaml \
    --event workflow_dispatch -L 1 --json databaseId \
    --jq '.[0].databaseId // empty' 2>/dev/null || true
}

# The `2>/dev/null || true` is deliberate and belongs inside the helper:
# --workflow 404s while post-deploy.yaml is not yet on the default branch, and
# that has to read as "no run yet" rather than kill this script under set -e.
# An empty answer is also the honest one the first time this workflow is ever
# dispatched, and then the first run that appears is the right one.
before_run_id="$(newest_gate_run)"

gh workflow run post-deploy.yaml -R netsnek/limosen.at --ref main \
  -f deployment_id="$deployment_id"

run_id=""
for _ in $(seq 1 24); do
  sleep 5
  candidate="$(newest_gate_run)"
  if [ -n "$candidate" ] && [ "$candidate" != "$before_run_id" ]; then
    run_id="$candidate"
    break
  fi
done

# Two minutes without a run of its own. The upload has happened and the gate's
# verdict is unknown, which is not a finished deploy, so this ends red with the
# command that says what is going on.
if [ -z "$run_id" ]; then
  echo "the gate was started but its own run did not appear within two minutes:" >&2
  echo "  gh run list -R netsnek/limosen.at --workflow post-deploy.yaml" >&2
  exit 1
fi

echo "gate: https://github.com/netsnek/limosen.at/actions/runs/$run_id"

if [ "$WAIT_FOR_GATE" -eq 0 ]; then
  echo "not waiting (--no-wait). The gate rolls back by itself if it has to."
  exit 0
fi

# --exit-status so a failing gate fails this script. A gate that rolled the
# site back still fails: the site is serving again, but this deploy did not.
watch_status=0
gh run watch "$run_id" -R netsnek/limosen.at --exit-status || watch_status=$?

if [ "$watch_status" -ne 0 ]; then
  # A run that is still queued when a newer gate joins the group is cancelled by
  # GitHub, and the watch reports that as a failure although nothing ever looked
  # at the site. A failing gate and an upload nobody checked are not the same
  # thing and must not read the same here.
  conclusion="$(gh run view "$run_id" -R netsnek/limosen.at --json conclusion --jq .conclusion 2>/dev/null || true)"
  if [ "$conclusion" = "cancelled" ]; then
    echo "the gate was superseded by a newer run before it started, so this upload is unverified." >&2
    echo "start it again once the other gate is done:" >&2
    echo "  gh workflow run post-deploy.yaml -R netsnek/limosen.at --ref main -f deployment_id=\"$deployment_id\"" >&2
  fi
  exit "$watch_status"
fi
