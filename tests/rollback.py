#!/usr/bin/env python3
"""Put the previous Cloudflare Pages deployment back on limosen.at.

The gate in `.github/workflows/post-deploy.yaml` runs the two notebooks against
production after every upload. When they fail and the upload's deployment id is
known, this script is what undoes it: Pages keeps every deployment's output
forever, so a rollback is a new production deployment made from an old one's
content, which takes seconds and needs no build.

It is deliberately narrow about what it will touch. A rollback only ever helps
when the deployment that was just published is still the live one; if something
newer has gone out in the meantime, reverting would throw that away as well, so
the script refuses (exit 4) rather than guess. It also refuses when the given
deployment cannot be identified (exit 3): either nothing recent matches it, or
the prefix fits more than one deployment and the caller meant one of them. And
it refuses when there is nothing older to go back to (exit 2).

    python tests/rollback.py --project limosen --deployment <uuid or short id> --plan
    python tests/rollback.py --project limosen --deployment <uuid or short id>

`--plan` decides nothing and changes nothing: it prints one JSON line naming
the deployment that is live and the one that would replace it, with the commit
behind each, and that is what the workflow puts in its summary and what a
maintainer reads before running it for real.

`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` come from the environment.
Locally they are in this repository's `.env`, which is gitignored and which
wrangler reads by itself; in CI they are the repository secrets of the same
names. The token is never printed, not even in an error.
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

API = "https://api.cloudflare.com/client/v4"

# The two failures the caller is expected to act on differently, so they get
# their own exit codes rather than a message somebody has to parse.
EXIT_NOTHING_OLDER = 2
EXIT_NOT_FOUND = 3
EXIT_NOT_LIVE = 4


def fail(message: str, code: int = 1):
    print(message, file=sys.stderr)
    raise SystemExit(code)


def call(path: str, token: str, method: str = "GET", soft: bool = False):
    """One Cloudflare API call. The token goes into the header and nowhere else.

    `soft` is for the calls that only ask again. Once the rollback has been
    POSTed, a 429 or a dropped connection says nothing about whether the domain
    moved, so a soft caller gets `None` and waits instead of the script ending
    on a blip and sending somebody to fix a site that is already back.
    """
    request = urllib.request.Request(
        API + path,
        method=method,
        headers={"Authorization": "Bearer " + token,
                 "Content-Type": "application/json",
                 "User-Agent": "limosen-post-deploy"},
        data=b"" if method == "POST" else None,
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            payload = json.load(response)
    except urllib.error.HTTPError as err:
        if soft:
            return None
        body = err.read().decode("utf-8", "replace")[:400]
        fail(f"Cloudflare answered HTTP {err.code} for {path}: {body}")
    except Exception as err:
        if soft:
            return None
        fail(f"Cloudflare could not be reached for {path}: {err}")

    if not payload.get("success"):
        if soft:
            return None
        fail(f"Cloudflare refused {path}: {json.dumps(payload.get('errors'))[:400]}")
    return payload


def describe(deployment: dict) -> dict:
    """The handful of fields anybody reading a plan actually needs."""
    trigger = deployment.get("deployment_trigger") or {}
    return {
        "id": deployment.get("id"),
        "short_id": deployment.get("short_id"),
        "url": deployment.get("url"),
        "created_on": deployment.get("created_on"),
        "commit_hash": (trigger.get("metadata") or {}).get("commit_hash"),
    }


def usable(deployment: dict) -> bool:
    """A production deployment that finished and was not skipped.

    A preview never served the domain, a skipped one has no output of its own,
    and a failed one would put a broken site back. None of them is a candidate.
    """
    return (deployment.get("environment") == "production"
            and ((deployment.get("latest_stage") or {}).get("status") == "success")
            and not deployment.get("is_skipped"))


def production_deployments(account: str, project: str, token: str, max_pages: int):
    """Every usable production deployment, newest first, as far as we look.

    This project has hundreds of deployments and the interesting ones are
    always the last few, so the walk stops after `max_pages`; a deployment
    older than that is not something an automatic rollback should reach for
    anyway.
    """
    out = []
    for page in range(1, max_pages + 1):
        payload = call(f"/accounts/{account}/pages/projects/{project}/deployments"
                       f"?per_page=25&page={page}", token)
        rows = payload.get("result") or []
        out.extend(d for d in rows if usable(d))
        info = payload.get("result_info") or {}
        if len(rows) < info.get("per_page", 25) or page * info.get("per_page", 25) >= info.get("total_count", 0):
            break
    return out


def locate(deployments, needle: str):
    """Every deployment the needle is a prefix of, with its place in the list.

    `wrangler pages deploy` prints only `https://<short>.<project>.pages.dev`,
    so the short id is what `scripts/deploy.sh` can capture, and the workflow
    input accepts either that or the full uuid, which begins with the same eight
    characters. A prefix match is what makes both work.

    Every match comes back rather than the first one, because the caller meant
    one deployment and a prefix that fits two does not say which. Guessing there
    is guessing about production, so `main` refuses instead.
    """
    return [(index, deployment) for index, deployment in enumerate(deployments)
            if (deployment.get("id") or "").lower().startswith(needle)
            or (deployment.get("short_id") or "").lower().startswith(needle)]


def github_output(**values):
    """Hand the plan to the workflow, when there is one listening."""
    path = os.environ.get("GITHUB_OUTPUT")
    if not path:
        return
    with open(path, "a", encoding="utf-8") as handle:
        for key, value in values.items():
            handle.write(f"{key}={value or ''}\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Roll limosen.at back to the deployment before a given one, or put a named one back.")
    parser.add_argument("--project", default=os.environ.get("CF_PAGES_PROJECT", "limosen"),
                        help="the Cloudflare Pages project (default: this brand's, limosen)")
    parser.add_argument("--deployment",
                        help="the deployment that was just published, as a uuid or a short id")
    parser.add_argument("--to",
                        help="put THIS deployment back, whatever is live: the way forward after a "
                             "drill or a rollback that should not have happened (uuid or short id)")
    parser.add_argument("--plan", action="store_true",
                        help="say what would happen and change nothing")
    parser.add_argument("--max-pages", type=int, default=20,
                        help="how far back to look, in pages of 25 (default 20)")
    parser.add_argument("--timeout", type=float, default=120.0,
                        help="how long to wait for the rollback to become canonical")
    args = parser.parse_args()

    # An empty or half-copied id is not an id, and argparse's `required=True` is
    # satisfied by an empty string. `locate` matches on a prefix so that the
    # eight hex characters wrangler prints are enough, and a prefix of nothing is
    # a prefix of every deployment: the newest one would match, that is normally
    # the live one, so the "is this still what is being served" guard below would
    # wave it through and production would be reverted without anybody having
    # named it. `scripts/deploy.sh` and the README both call this with a shell
    # variable that is explicitly allowed to be empty, so it is checked here.
    # The generic exit 1 rather than 2, 3 or 4: those three are statements about
    # a deployment, and this is a statement about the argument.
    if bool(args.deployment) == bool(args.to):
        fail("name exactly one of --deployment (roll back to the one before it) "
             "or --to (put this one back).")
    named = args.deployment or args.to
    needle = named.strip().lower()
    if len(needle) < 8 or needle.strip("0123456789abcdef-") != "":
        fail("--deployment and --to want at least the eight hex characters of a short id: "
             f"{named!r} cannot name a deployment.")

    token = os.environ.get("CLOUDFLARE_API_TOKEN", "")
    account = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "")
    if not token or not account:
        fail("CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID have to be in the environment. "
             "Locally they are in this repository's .env.")

    project = call(f"/accounts/{account}/pages/projects/{args.project}", token)["result"]
    canonical = (project.get("canonical_deployment") or {}).get("id")

    deployments = production_deployments(account, args.project, token, args.max_pages)
    matches = locate(deployments, needle)
    if not matches:
        fail(f"{needle} is not among the last {len(deployments)} production "
             f"deployments of {args.project}", EXIT_NOT_FOUND)
    if len(matches) > 1:
        fail(f"{needle} fits {len(matches)} of the last {len(deployments)} production "
             f"deployments of {args.project} "
             f"({', '.join(describe(d)['short_id'] for _, d in matches)}). "
             f"Name one of them in full.", EXIT_NOT_FOUND)
    index, current = matches[0]

    if args.to:
        # Roll forward. Cloudflare's rollback points production at the named
        # deployment itself, the id stays, so after a rollback the "deployment
        # before the live one" is an even older one: on 2026-09-17 the drill
        # put 7231a4af back and --deployment 7231a4af then walked to 1f118c85
        # rather than to the build the drill had reverted. `--to` names the
        # target outright and asks nothing about order; it still has to be a
        # successful production deployment of this project.
        target = current
        if target.get("id") == canonical:
            print(json.dumps({"already_serving": describe(target)}))
            return
        if args.plan:
            print(json.dumps({"put_back": describe(target), "replacing": canonical}))
            return
        call(f"/accounts/{account}/pages/projects/{args.project}"
             f"/deployments/{target['id']}/rollback", token, method="POST")
        github_output(rolled_back_to=target["id"])
        deadline = time.time() + args.timeout
        while time.time() < deadline:
            now = call(f"/accounts/{account}/pages/projects/{args.project}", token, soft=True)
            live = ((now or {}).get("result") or {}).get("canonical_deployment") or {}
            if live.get("id") == target["id"]:
                print(json.dumps({"put_back": describe(target), "now_serving": {"id": live.get("id"), "url": live.get("url")}}))
                return
            time.sleep(5)
        print(f"{describe(target)['short_id']} was put back but the project still names "
              f"another deployment after {args.timeout:.0f} s; ask again in a moment.", file=sys.stderr)
        return

    if current.get("id") != canonical:
        fail(f"{describe(current)['short_id']} is not what {args.project} is serving "
             f"(that is {canonical}). Something newer went out since, and rolling back "
             f"would revert that too.", EXIT_NOT_LIVE)

    previous = deployments[index + 1] if index + 1 < len(deployments) else None
    if previous is None:
        fail(f"there is no successful production deployment older than "
             f"{describe(current)['short_id']} to go back to", EXIT_NOTHING_OLDER)

    plan = {"current": describe(current), "previous": describe(previous)}
    github_output(current_id=plan["current"]["id"],
                  previous_id=plan["previous"]["id"],
                  previous_url=plan["previous"]["url"])

    if args.plan:
        # The commit is printed on both sides even when it is the same one: a
        # rollback between two uploads of the same commit reverts content, not
        # code, which is worth knowing before it happens.
        print(json.dumps(plan))
        return

    call(f"/accounts/{account}/pages/projects/{args.project}"
         f"/deployments/{previous['id']}/rollback", token, method="POST")

    # The point of no return. Everything below only asks whether the domain has
    # caught up, so what was restored is recorded here rather than after the
    # loop: a step that ends without this line makes the workflow's summary say
    # "the rollback itself did not complete" about a site that is already back.
    github_output(rolled_back_to=previous["id"])

    # What decides whether the domain moved is the project's canonical
    # deployment, so that is what is waited on. The asking is soft: a 429 or a
    # dropped connection in one of the forty polls says nothing about a rollback
    # that has already been accepted, and ending on it would send an operator to
    # repair a site that is serving again.
    started = time.time()
    landed = None
    while time.time() - started < args.timeout:
        time.sleep(3)
        payload = call(f"/accounts/{account}/pages/projects/{args.project}", token, soft=True)
        if payload is None:
            continue  # a blip while the domain moves is not a failed rollback
        now = (payload.get("result") or {}).get("canonical_deployment") or {}
        if now.get("id") and now.get("id") != canonical:
            landed = now
            break
    if landed is None:
        print(f"the rollback to {describe(previous)['short_id']} was accepted but "
              f"{args.project} was not seen serving it within {int(args.timeout)} s; "
              f"the recheck against production decides now", file=sys.stderr)

    print(json.dumps({"rolled_back_to": describe(previous),
                      "now_serving": ({"id": landed.get("id"), "url": landed.get("url")}
                                      if landed else None),
                      "replaced": describe(current)}))


if __name__ == "__main__":
    main()
