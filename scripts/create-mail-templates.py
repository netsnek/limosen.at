#!/usr/bin/env python3
"""Create or update this brand's mail templates in emailwerk, one pair per language.

Until 2026-09-06 the site sent one English pair for every language, and the
German, Turkish and Arabic rows that existed beside it were unpublished, two of
them without a parent, so a German visitor got an English confirmation. The
rule since then: the confirmation follows the language the booking or the
contact was made in. Eight rows that have to agree with each other, four of
them children of the other four, is not something to click together twice, so
this script owns them. Running it again updates what exists rather than
creating a second set, which is what lets the files in mail-templates/ be
edited and pushed like source.

The parent carries the enquiry to the company and the child confirms to the
visitor. The server sends the child by itself to envelope.replyTo, so the site
must never send it a second time.

    EMAILWERK_AUTH='user:pass' ./scripts/create-mail-templates.py           # dry run
    EMAILWERK_AUTH='user:pass' ./scripts/create-mail-templates.py --commit
"""

import base64
import json
import os
import pathlib
import sys
import urllib.error
import urllib.request

API = os.environ.get("EMAILWERK_URL", "https://emailwerk.com/graphql")
AUTH = os.environ.get("EMAILWERK_AUTH", "")

# office@snek.at, the sender the old pair and the other tenants' public
# templates already use. A template without a verified sender is refused
# before it reaches a mailbox.
SENDER_ID = os.environ.get("EMAILWERK_SENDER", "cmsmhy0ag004drb2pzezqi0v2")

# The company plus a copy to netsnek. The envelope has no bcc field, only
# `to`, so a copy is another recipient and the company can see it.
# limosen@netsnek.com is the address the limosen account in the identity
# server is registered under. office@erebos.xyz, which the old English pair
# carried as a third recipient, is not on the new rows (owner, 2026-09-06).
RECIPIENTS = ["office@limosen.at", "limosen@netsnek.com"]
LANGUAGES = ["de", "en", "tr", "ar"]

# Every value the booking form sends. Declaring them is what lets the template
# editor show them, and an undeclared variable renders empty. None is required:
# the contact form sends a handful of these, and a required variable left
# empty is a refused send.
# The booking a person reads: bookingCode is the six characters both legs
# share, code the outbound leg (-1), returnCode the way back (-2). All three
# are empty when the pylon refused the booking, and the template says so.
# The transfer's uuid is not among them on purpose, nobody reads a uuid.
VARIABLES = [
    "firstName", "lastName", "email", "phone", "message", "flightNumber",
    "rideCategory", "rideType", "date", "time", "returnDate", "returnTime",
    "pickupAddress", "destinationAddress",
    "passengers", "luggage", "childSeats", "extraTime",
    "carClass", "carTitle", "paymentOption", "agreeToTerms",
    "bookingCode", "code", "returnCode",
    "locale", "invokedOnUrl", "year",
]

HERE = pathlib.Path(__file__).resolve().parent.parent
MAILDIR = pathlib.Path(os.environ.get("LIMOSEN_MAIL_DIR", HERE / "mail-templates"))


def call(query: str, variables: dict) -> dict:
    if not AUTH:
        sys.exit("EMAILWERK_AUTH is not set (expects 'user:pass')")

    request = urllib.request.Request(
        API,
        data=json.dumps({"query": query, "variables": variables}).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": "Basic " + base64.b64encode(AUTH.encode()).decode(),
            "User-Agent": "limosen-mail-templates",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            payload = json.load(response)
    except urllib.error.HTTPError as err:
        sys.exit(f"HTTP {err.code}: {err.read().decode()[:300]}")

    if payload.get("errors"):
        sys.exit("GraphQL: " + json.dumps(payload["errors"])[:400])

    return payload["data"]


def description_of(lang: str, kind: str) -> str:
    return f"Limosen {lang.upper()} Booking {kind.capitalize()}"


def existing() -> dict:
    """The rows this script owns, by description. Other tenants' rows and the
    old 'Contact' pair of this brand start differently and are never touched."""
    data = call(
        "query($a: TemplateListArgsInput){ templates(args:$a){ nodes { id description } } }",
        {"a": {"first": 200}},
    )
    return {
        n["description"]: n["id"]
        for n in data["templates"]["nodes"]
        if (n.get("description") or "").startswith("Limosen ")
    }


def main() -> None:
    commit = "--commit" in sys.argv
    subjects = json.loads((MAILDIR / "subjects.json").read_text(encoding="utf-8"))
    known = existing() if commit else {}
    written = {}

    for lang in LANGUAGES:
        for kind in ("request", "confirmation"):
            base = f"limosen-{lang}-{kind}"
            body = (MAILDIR / f"{base}.html").read_text(encoding="utf-8")
            description = description_of(lang, kind)
            envelope = {
                "subject": subjects[base],
                # A confirmation carries no recipient: the server sends it to
                # the address the parent was answered from.
                "to": RECIPIENTS if kind == "request" else [],
            }
            payload = {
                "description": description,
                "content": body,
                "engine": "TWIG",
                "senderId": SENDER_ID,
                # Public, or a signed-out visitor's send is refused outright.
                # That flag alone kept every enquiry from this site out of the
                # log until 2026-09-04.
                "isPublic": True,
                "verifyReplyTo": False,
                "variables": [{"name": v, "type": "STRING", "isRequired": False, "isConstant": False} for v in VARIABLES],
                "envelope": envelope,
            }

            if not commit:
                print(f"  would write {description:38} {len(body):6} bytes  to={envelope['to']}")
                continue

            if description in known:
                call(
                    "mutation($a: TemplateUpdateArgsInput!){ templateUpdate(args:$a){ id } }",
                    {"a": {"id": known[description], **payload}},
                )
                written[base] = known[description]
                print(f"  updated {description:38} {written[base]}")
            else:
                data = call(
                    "mutation($a: TemplateCreateInput!){ templateCreate(args:$a){ id } }",
                    {"a": payload},
                )
                written[base] = data["templateCreate"]["id"]
                print(f"  created {description:38} {written[base]}")

    if not commit:
        print("\ndry run, nothing was written. Add --commit.")
        return

    # The child is linked afterwards because templateCreate takes no parentId,
    # and it is relinked on every run so a child never keeps a stale parent.
    for lang in LANGUAGES:
        call(
            "mutation($a: TemplateUpdateArgsInput!){ templateUpdate(args:$a){ id } }",
            {"a": {"id": written[f"limosen-{lang}-confirmation"],
                   "parentId": written[f"limosen-{lang}-request"]}},
        )
        print(f"  linked  limosen-{lang}-confirmation -> limosen-{lang}-request")

    out = MAILDIR / "ids.json"
    out.write_text(json.dumps(written, indent=2) + "\n", encoding="utf-8")
    print(f"\nids written to {out}")


if __name__ == "__main__":
    main()
