#!/usr/bin/env python3
"""Push this brand's two mail templates to emailwerk from the files in git.

The Contact parent and its confirmation child lived only in the emailwerk
database until 2026-09-05, so every edit was a change nobody could diff. The
files under mail-templates/ are the source now: edit them, run this, and the
live rows are updated in place. The ids are fixed and come from ids.json,
nothing is ever created, because the site posts these two ids and a new row
would be a template nobody sends.

The parent carries the enquiry to the company and the server sends the child
by itself to envelope.replyTo, so the site must never send the child.

    EMAILWERK_AUTH='user:pass' ./scripts/update-mail-templates.py           # dry run
    EMAILWERK_AUTH='user:pass' ./scripts/update-mail-templates.py --commit
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

# The sender both rows already carry, office@snek.at. A template without a
# verified sender is refused before it reaches a mailbox.
SENDER_ID = os.environ.get("EMAILWERK_SENDER", "cmsmhy0ag004drb2pzezqi0v2")

# The company plus the two copies the row has always carried. The envelope has
# no bcc field, so a copy is another recipient and the company can see it.
RECIPIENTS = ["office@limosen.at", "office@erebos.xyz", "limosen@netsnek.com"]

# Every value the booking form sends. Declaring them is what lets the template
# editor show them, and an undeclared variable renders empty. None is required:
# the contact form sends a handful of these and the wishes field is optional,
# and a required variable left empty is a refused send.
#
# bookingCode is the six characters both legs share, code the outbound leg
# (-1), returnCode the way back (-2). All three are empty when the pylon
# refused the booking, and the template says so. The transfer's uuid is not
# among them on purpose, nobody reads a uuid.
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

DESCRIPTIONS = {
    "limosen-request": "Contact",
    "limosen-confirmation": "Confirmation of Your Contact Request",
}


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


def main() -> None:
    commit = "--commit" in sys.argv
    subjects = json.loads((MAILDIR / "subjects.json").read_text(encoding="utf-8"))
    ids = json.loads((MAILDIR / "ids.json").read_text(encoding="utf-8"))

    for base in ("limosen-request", "limosen-confirmation"):
        body = (MAILDIR / f"{base}.html").read_text(encoding="utf-8")
        is_request = base.endswith("request")
        envelope = {
            "subject": subjects[base],
            # The confirmation carries no recipient: the server sends it to
            # the address the parent was answered from.
            "to": RECIPIENTS if is_request else [],
        }
        payload = {
            "id": ids[base],
            "description": DESCRIPTIONS[base],
            "content": body,
            "engine": "TWIG",
            "senderId": SENDER_ID,
            "isPublic": True,
            "verifyReplyTo": False,
            "variables": [
                {"name": v, "type": "STRING", "isRequired": False, "isConstant": False}
                for v in VARIABLES
            ],
            "envelope": envelope,
        }
        if not is_request:
            payload["parentId"] = ids["limosen-request"]

        if not commit:
            print(f"  would update {DESCRIPTIONS[base]:38} {ids[base]}  {len(body):6} bytes  to={envelope['to']}")
            continue

        call(
            "mutation($a: TemplateUpdateArgsInput!){ templateUpdate(args:$a){ id } }",
            {"a": payload},
        )
        print(f"  updated {DESCRIPTIONS[base]:38} {ids[base]}")

    if not commit:
        print("\ndry run, nothing was written. Add --commit.")


if __name__ == "__main__":
    main()
