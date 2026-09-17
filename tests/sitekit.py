"""Shared foundation for this site's post-deploy notebooks.

The suite is a READ ONLY probe of the deployed site and of the two backends it
talks to. Three properties hold everywhere in this module and every notebook is
expected to keep them:

* Nothing here sends mail and nothing here writes a booking. The helpers post
  whatever document they are given and the suite's rule is that only reads, and
  probes that are refused during argument or schema validation, are given to
  them. A real send belongs in a markdown cell for a human to run deliberately,
  because it lands in the company's inbox.
* Nothing here prints a credential. `EMAILWERK_AUTH` and the Cloudflare token
  are read from the environment and never recorded as evidence. Recipients,
  template ids and subjects are recorded in full on purpose: they are the very
  thing the checks are about, and a redacted `envelope.to` would prove nothing.
* Nothing raises at the caller. Checks record PASS, FAIL, SKIP or WARN, and an
  unexpected exception inside a check becomes a FAIL instead of killing the run.

Typical use::

    import sitekit as k
    k.start_run("01-contact-mail-contract")

    with k.check("the site serves a bundle") as c:
        page = c.require(k.http(k.CONFIG["site_url"] + "/"))
        c.expect(page.status == 200, "GET / answers 200")

    k.finish()

`finish()` is what makes this a gate: it raises `SystemExit(1)` when anything
failed, which is how `jupyter nbconvert --execute` ends non-zero and how the
workflow learns that the deploy is bad.

Everything brand-specific is written out below. This file belongs to
`netsnek/limosen.at` and describes LIMOSEN KG only; the sibling brand has its
own copy in its own repository and the two are never merged (see
`okf/decisions/hard-rules.md`).
"""

from __future__ import annotations

import base64 as _base64
import importlib.util as _importlib_util
import json as _json
import os as _os
import pathlib as _pathlib
import re as _re
import time as _time
import traceback as _traceback
import urllib.error as _urlerror
import urllib.request as _urlrequest
from contextlib import contextmanager as _contextmanager
from dataclasses import dataclass as _dataclass
from dataclasses import field as _dcfield
from urllib.parse import urlsplit as _urlsplit

try:
    from IPython.display import HTML as _HTML
    from IPython.display import display as _display

    _HAVE_IPYTHON = True
except Exception:  # plain python
    _HAVE_IPYTHON = False


# --------------------------------------------------------------------------
# this brand
# --------------------------------------------------------------------------
#
# The two sites are two companies. Every value below is limosen's own, and the
# foreign markers are the sibling's: a check that finds one of them in this
# site's bundle or in this site's templates has found the brand mix that
# `scripts/deploy.sh` refuses at build time, this time in something the build
# cannot see.

BRAND = "limosen"
COMPANY = "LIMOSEN KG"
PRODUCTION_URL = "https://limosen.at"
CF_PAGES_PROJECT = "limosen"
TEMPLATE_PREFIX = "limosen-"
DESCRIPTION_PREFIX = "Limosen "
PYLON_URL = "https://api.limosen.at/graphql"
# The one address a test recipe may use as a reply-to, because a mail sent to
# it lands at netsnek rather than in a customer's mailbox.
NETSNEK_COPY = "limosen@netsnek.com"

FOREIGN_MARKERS = [
    "office@krclimo.at",
    "krc@netsnek.com",
    "699 109 983 52",
    "KRC Limousinenservice",
    # The sibling's domains. Not contact data, but still the other company
    # inside this build, and this is what a footer link or an inherited
    # `og:url` looks like from here. Measured free on this side on 2026-09-17
    # (bundle, served HTML and all eight template bodies: zero hits), so the
    # marker costs nothing and catches the mirror image of what the sibling
    # repository is carrying today.
    "booklimo.at",
    "krclimo.at",
]

# The brand gold on charcoal, measured 2026-09-17 from src/styles/theme/system.ts
# and from the templates as emailwerk stores them. `#bf9c60` is KRC's muted gold
# from krclimo.at and has no business in a limosen mail.
BRAND_GOLD = "#d4af37"
FOREIGN_GOLD = "#bf9c60"


def foreign_markers() -> list:
    """The sibling brand's fingerprints, as a fresh list per caller."""
    return list(FOREIGN_MARKERS)


# --------------------------------------------------------------------------
# configuration
# --------------------------------------------------------------------------

def _truthy(value: str) -> bool:
    return str(value or "").strip().lower() not in ("", "0", "false", "no")


CONFIG = {
    # Where pages and the bundle are fetched from. A run against a
    # `*.pages.dev` deployment (the workflow does this to find out whether a
    # rollback would even help) only changes this one.
    "site_url": (_os.environ.get("SITE_URL") or PRODUCTION_URL).rstrip("/"),
    # The origin a browser would send. It stays the production domain even when
    # SITE_URL points at a preview, because what is under test is whether the
    # visitor's browser may call the backends, and the visitor is on limosen.at.
    "site_origin": (_os.environ.get("SITE_ORIGIN") or PRODUCTION_URL).rstrip("/"),
    "emailwerk_url": _os.environ.get("EMAILWERK_URL") or "https://emailwerk.com/graphql",
    "timeout": float(_os.environ.get("SITE_TIMEOUT", "30")),
    # A forced failure, so the workflow's rollback path can be exercised on a
    # healthy system. See tests/README.md, "The drill".
    "drill": _truthy(_os.environ.get("SMOKE_DRILL", "")),
    # On a runner a missing admin credential is a failure rather than a skip:
    # the read of the live templates is the check that would have caught the
    # recipient wipe of 2026-09-07, and a gate that silently skips it is no gate.
    "ci": _truthy(_os.environ.get("CI", "")),
}

# Cloudflare answers a default library user agent differently from a browser,
# and the site sits behind it.
USER_AGENT = "Mozilla/5.0 (X11; Linux aarch64) limosen-post-deploy"


def have_emailwerk_auth() -> bool:
    return bool(_os.environ.get("EMAILWERK_AUTH"))


# --------------------------------------------------------------------------
# evidence
# --------------------------------------------------------------------------
#
# Only credentials are hidden. Everything else recorded here is public brand
# data that the checks exist to inspect.

_SECRETS = [
    (_re.compile(r"\bBasic\s+[A-Za-z0-9+/=]+", _re.I), "Basic <credential>"),
    (_re.compile(r"\bBearer\s+[A-Za-z0-9._~+/=-]+", _re.I), "Bearer <token>"),
    (_re.compile(r"\b[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+"), "<jwt>"),
]


def redact(value, limit: int = 700) -> str:
    text = value if isinstance(value, str) else _json.dumps(value, default=str)
    credential = _os.environ.get("EMAILWERK_AUTH", "")
    if credential:
        text = text.replace(credential, "<EMAILWERK_AUTH>")
        user = credential.split(":", 1)[0]
        if len(user) > 3:
            text = text.replace(user, "<user>")
    for token_pattern, replacement in _SECRETS:
        text = token_pattern.sub(replacement, text)
    return text[:limit]


# --------------------------------------------------------------------------
# transport
# --------------------------------------------------------------------------

@_dataclass
class Response:
    status: int
    headers: dict
    text: str
    elapsed_ms: int
    error: str = ""
    attempts: int = 1

    def header(self, name: str) -> str:
        """One header, case insensitively.

        `response.headers` is case insensitive and `dict()` of it is not, which
        is how an `access-control-allow-origin` that was there all along once
        read as absent.
        """
        for key, value in self.headers.items():
            if key.lower() == name.lower():
                return value
        return ""

    def json(self):
        try:
            return _json.loads(self.text)
        except ValueError:
            return None


def _http_once(url: str, method: str, headers: dict | None,
               body: bytes | str | None, timeout: float | None) -> Response:
    """One attempt. A transport failure is status 0, never an exception."""
    payload = body.encode() if isinstance(body, str) else body
    sent = {"User-Agent": USER_AGENT}
    sent.update(headers or {})
    request = _urlrequest.Request(url, data=payload, headers=sent, method=method)
    started = _time.time()
    try:
        with _urlrequest.urlopen(request, timeout=timeout or CONFIG["timeout"]) as response:
            return Response(response.status, dict(response.headers),
                            response.read().decode("utf-8", "replace"),
                            int((_time.time() - started) * 1000))
    except _urlerror.HTTPError as err:
        return Response(err.code, dict(err.headers or {}),
                        err.read().decode("utf-8", "replace"),
                        int((_time.time() - started) * 1000))
    except Exception as err:  # DNS, TLS, timeout
        return Response(0, {}, "", int((_time.time() - started) * 1000), str(err))


# A runner's DNS, a TLS handshake and a CDN edge each fail once in a while, and a
# single such blip in any of the sixteen calls a run makes would fail the gate.
# On a deploy triggered run that is worse than a false alarm: the workflow asks
# the same backends again a minute later against the deployment before this one,
# by then the blip is gone, that run passes, and an upload that was never at
# fault is rolled back. So a transport failure and the three gateway statuses
# are tried again before they count. Anything a server answers deliberately
# (400, 401, 404, 429) is a real answer and is not retried.
#
# Retrying is only safe because every POST this suite makes is refused during
# argument or schema validation and sends nothing. A real send must never go
# through here.
RETRY_STATUS = (502, 503, 504)
RETRY_ATTEMPTS = 3
RETRY_BACKOFF = (1.0, 3.0)


def http(url: str, method: str = "GET", headers: dict | None = None,
         body: bytes | str | None = None, timeout: float | None = None) -> Response:
    """One HTTP call that never raises. A transport failure is status 0.

    Tried up to `RETRY_ATTEMPTS` times when the transport failed or the answer
    was 502, 503 or 504, with a short backoff between. The number of attempts
    travels with the response so the evidence can say so: a site that only
    answers every other time is worth seeing, not worth hiding behind a PASS.
    """
    for attempt in range(1, RETRY_ATTEMPTS + 1):
        response = _http_once(url, method, headers, body, timeout)
        response.attempts = attempt
        if response.status not in (0, *RETRY_STATUS) or attempt == RETRY_ATTEMPTS:
            return response
        _time.sleep(RETRY_BACKOFF[min(attempt - 1, len(RETRY_BACKOFF) - 1)])
    return response


@_dataclass
class Result:
    ok: bool
    status: int
    data: dict | None
    errors: list
    elapsed_ms: int
    raw: str = ""
    attempts: int = 1

    @property
    def error_message(self) -> str:
        if not self.errors:
            return ""
        first = self.errors[0]
        return first.get("message", "") if isinstance(first, dict) else str(first)

    @property
    def codes(self) -> list:
        """`extensions.code` of every error, which is what these APIs answer in."""
        out = []
        for err in self.errors or []:
            if isinstance(err, dict):
                out.append(((err.get("extensions") or {}).get("code") or ""))
        return out


def gql(url: str, query: str, variables: dict | None = None,
        headers: dict | None = None) -> Result:
    """POST one GraphQL document. Never raises."""
    sent = {"Content-Type": "application/json"}
    sent.update(headers or {})
    body = _json.dumps({"query": query, "variables": variables or {}})
    response = http(url, "POST", sent, body)
    if response.status == 0:
        return Result(False, 0, None, [{"message": "transport: " + response.error}],
                      response.elapsed_ms, attempts=response.attempts)
    payload = response.json()
    if payload is None:
        return Result(False, response.status, None, [{"message": "no JSON in response"}],
                      response.elapsed_ms, response.text[:400], response.attempts)
    return Result(response.status == 200 and not payload.get("errors"),
                  response.status, payload.get("data"), payload.get("errors") or [],
                  response.elapsed_ms, response.text[:400], response.attempts)


def emailwerk(query: str, variables: dict | None = None, auth: str | None = None,
              origin: str | None = None) -> Result:
    """POST one document to emailwerk.

    Anonymous by default, because that is how a visitor's contact form reaches
    it and the interesting question is whether the deployed template accepts
    one. `EMAILWERK_AUTH`, as `user:pass`, switches to the admin surface, where
    reading a template's own definition needs it. The credential is never
    recorded: see `redact`.
    """
    headers = {}
    credential = auth if auth is not None else _os.environ.get("EMAILWERK_AUTH", "")
    if credential:
        headers["Authorization"] = "Basic " + _base64.b64encode(credential.encode()).decode()
    if origin:
        headers["Origin"] = origin
    return gql(CONFIG["emailwerk_url"], query, variables, headers)


def preflight(url: str, origin: str, request_headers: str = "content-type") -> Response:
    """The OPTIONS a browser sends before it posts JSON to another origin.

    This is not decoration. A preflight that stopped answering is invisible to
    curl and to every server side probe, and it once took a whole form down
    without leaving a trace anywhere.
    """
    return http(url, "OPTIONS", {
        "Origin": origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": request_headers,
    })


def browser_origin() -> str:
    """The origin the page under test is really served from.

    `site_origin` is the visitor's origin and stays the production domain,
    because that is what the preflight checks of notebook 01 are about. A route
    fulfilled inside the browser is a different question: Chromium applies CORS
    to a fulfilled response like any other, so an `access-control-allow-origin`
    naming the production domain while the page is on `<short>.pages.dev` fails
    the fetch with ERR_FAILED before the site ever sees the answer. A header
    that answers the page gets this one.
    """
    parts = _urlsplit(CONFIG["site_url"])
    return f"{parts.scheme}://{parts.netloc}"


def on_host(url: str):
    """A route predicate that cuts a backend, not one spelling of its URL.

    Playwright reads a wildcard free string as an exact match, so a route
    registered on `https://emailwerk.com/graphql` stops matching the day the
    site appends `?op=send` or a path segment, and the request notebook 02
    meant to intercept leaves the runner for real: an enquiry in the company's
    inbox and a row in its dispatch, four times a day on the schedule. What
    identifies a backend is its host, so that is what is matched. A glob is not
    used for this either, because `?` is a wildcard inside one.
    """
    host = _urlsplit(url).netloc
    return lambda seen: _urlsplit(seen).netloc == host


# --------------------------------------------------------------------------
# the repository
# --------------------------------------------------------------------------

def repo_root():
    """This checkout's root, found by walking up from wherever python started.

    The notebooks run from `tests/` under nbconvert and from the repository
    root by hand, and several checks compare the deployed site against the
    source that produced it, so the root has to be found rather than assumed.
    Returns None outside a checkout, and every caller treats that as SKIP.
    """
    here = _pathlib.Path.cwd().resolve()
    for candidate in [here, *here.parents]:
        if (candidate / "scripts" / "create-mail-templates.py").is_file():
            return candidate
    return None


def load_create_script():
    """`scripts/create-mail-templates.py` as a module, for the values it owns.

    The recipients, the sender and the languages are not retyped here. That
    script is what writes them to emailwerk, so importing it is what makes a
    drift between the script and the live templates visible instead of making
    the test agree with itself. Reading `EMAILWERK_AUTH` happens at import and
    is harmless; the script only exits when `call()` runs, which it does not
    here.
    """
    root = repo_root()
    if root is None:
        return None
    path = root / "scripts" / "create-mail-templates.py"
    spec = _importlib_util.spec_from_file_location("limosen_create_mail_templates", path)
    module = _importlib_util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def repo_ids() -> dict:
    """`mail-templates/ids.json`, the ids the last template run wrote."""
    root = repo_root()
    if root is None:
        return {}
    path = root / "mail-templates" / "ids.json"
    if not path.is_file():
        return {}
    return _json.loads(path.read_text(encoding="utf-8"))


def repo_request_ids(languages) -> dict:
    """The request template of each language, as this checkout names them."""
    ids = repo_ids()
    return {lang: ids.get(f"{TEMPLATE_PREFIX}{lang}-request") for lang in languages}


def repo_pylon_url() -> str:
    """`SITE.appPylonUrl` as `src/vars/site-variants.ts` spells it."""
    root = repo_root()
    if root is None:
        return ""
    source = (root / "src" / "vars" / "site-variants.ts").read_text(encoding="utf-8")
    found = _re.search(r"appPylonUrl:\s*'([^']+)'", source)
    return found.group(1) if found else ""


def out_dir() -> _pathlib.Path:
    """Where a run leaves its transcript and a failing browser check its evidence.

    `tests/out/` by default, gitignored, and emptied by hand after a local run.
    The workflow uploads it as the run's artifact, which is the only way to see
    what the headless browser saw. It runs notebook 01 up to three times in one
    job, though, against production, against the previous deployment and again
    after a rollback, so `SITE_OUT_DIR` lets each of those keep its own
    directory instead of overwriting the one before it.
    """
    root = repo_root()
    named = _os.environ.get("SITE_OUT_DIR")
    if named:
        # Relative to the checkout, not to the kernel's directory: nbconvert
        # starts the kernel in the notebook's own folder, so `tests/out/previous`
        # as the workflow writes it would otherwise land in `tests/tests/`.
        base = _pathlib.Path(named)
        if not base.is_absolute() and root:
            base = root / base
    else:
        base = (root / "tests" / "out") if root else _pathlib.Path("out")
    base.mkdir(parents=True, exist_ok=True)
    return base


# --------------------------------------------------------------------------
# the deployed bundle
# --------------------------------------------------------------------------

_BUNDLE_SRC = _re.compile(r'src="(/app-[0-9a-f]+\.js)"')
# The locale map as the minifier leaves it: bare keys, double quoted cuids.
# `src/services/mail-templates.ts` is inlined into the bundle, so this object IS
# the answer to "which templates does the deployed site send", whatever the
# checkout says.
_TEMPLATE_MAP = _re.compile(
    r'de:"(c[a-z0-9]{24})",\s*en:"(c[a-z0-9]{24})",\s*tr:"(c[a-z0-9]{24})",\s*ar:"(c[a-z0-9]{24})"'
)


def bundle_url(html: str, site_url: str | None = None) -> str:
    """The app bundle the served HTML loads, as an absolute URL."""
    found = _BUNDLE_SRC.search(html)
    if not found:
        return ""
    return (site_url or CONFIG["site_url"]).rstrip("/") + found.group(1)


def deployed_template_map(bundle_text: str) -> dict:
    """The locale to template id object the deployed bundle carries."""
    found = _TEMPLATE_MAP.search(bundle_text)
    if not found:
        return {}
    return dict(zip(("de", "en", "tr", "ar"), found.groups()))


def fetch_site() -> dict:
    """The served page and its bundle, fetched once and reused by both notebooks.

    Returns `{"html", "bundle_url", "bundle", "templates", "page", "asset"}`.
    The browser notebook needs the same locale map as the contract notebook, so
    it lives here rather than being pasted twice.
    """
    site = CONFIG["site_url"]
    page = http(site + "/")
    html = page.text if page.status == 200 else ""
    url = bundle_url(html, site)
    asset = http(url) if url else Response(0, {}, "", 0, "no bundle in the HTML")
    text = asset.text if asset.status == 200 else ""
    return {
        "html": html,
        "bundle_url": url,
        "bundle": text,
        "templates": deployed_template_map(text),
        "page": page,
        "asset": asset,
    }


# Anchored, so a longer endpoint cannot come back as a prefix of itself. Without
# the lookahead `https://api.<brand>.at/graphql/v2` would be reported as
# `.../graphql`, notebook 01 would find that it agrees with the repository, and
# notebook 02 would register its route on a URL the site never calls.
_PYLON_IN_BUNDLE = _re.compile(r"https://api\.[a-z0-9-]+\.at/graphql(?![/\w])")


def pylon_urls_in_bundle(bundle_text: str) -> list:
    """Every pylon host the deployed bundle names, in the order they appear."""
    seen = []
    for url in _PYLON_IN_BUNDLE.findall(bundle_text):
        if url not in seen:
            seen.append(url)
    return seen


# --------------------------------------------------------------------------
# reading a GraphQL document the site built
# --------------------------------------------------------------------------

def root_fields(document: str) -> list:
    """The root fields of an operation, aliases resolved and arguments skipped.

    The mail client is gqty and gqty aliases everything it selects, so the
    document on the wire reads
    `mutation($a4e12e:SendTemplateMailArgsInput!){a29379:sendTemplateMail(args:$a4e12e){...}}`.
    A naive `"sendTemplateMail" in query` would also pass for a document that
    selects a second root field beside it, which is exactly what the check
    wants to rule out, so the selection set is walked: an alias is dropped, an
    argument list is stepped over, and only the names at depth one come back.
    """
    text = document or ""
    name = _re.compile(r"[A-Za-z_][A-Za-z0-9_]*")
    index, parens = 0, 0

    def skip_string(i: int) -> int:
        quote = text[i]
        i += 1
        while i < len(text):
            if text[i] == "\\":
                i += 2
                continue
            if text[i] == quote:
                return i + 1
            i += 1
        return i

    # The selection set opens at the first brace outside the variable
    # definitions, which are in parentheses and may themselves carry defaults.
    while index < len(text):
        char = text[index]
        if char in "\"'":
            index = skip_string(index)
            continue
        if char == "(":
            parens += 1
        elif char == ")":
            parens -= 1
        elif char == "{" and parens == 0:
            index += 1
            break
        index += 1
    else:
        return []

    fields, depth = [], 1
    while index < len(text) and depth > 0:
        char = text[index]
        if char in "\"'":
            index = skip_string(index)
            continue
        if char == "{":
            depth += 1
            index += 1
            continue
        if char == "}":
            depth -= 1
            index += 1
            continue
        if char == "(":
            # an argument list, balanced and possibly holding braces of its own
            inner = 0
            while index < len(text):
                if text[index] in "\"'":
                    index = skip_string(index)
                    continue
                if text[index] == "(":
                    inner += 1
                elif text[index] == ")":
                    inner -= 1
                    if inner == 0:
                        index += 1
                        break
                index += 1
            continue
        found = name.match(text, index)
        if not found:
            index += 1
            continue
        index = found.end()
        after = text[index:]
        stripped = after.lstrip()
        if stripped.startswith(":"):
            # an alias: the field is the name behind the colon
            index += len(after) - len(stripped) + 1
            continue
        if depth == 1:
            fields.append(found.group(0))
    return fields


def find_dict_with(payload, key: str):
    """The first dict anywhere in a JSON body that carries `key`.

    gqty names its variables with a hash, so the arguments object cannot be
    addressed by path. Walking for `templateId` finds it whatever the hash is.
    """
    if isinstance(payload, dict):
        if key in payload:
            return payload
        for value in payload.values():
            found = find_dict_with(value, key)
            if found is not None:
                return found
    elif isinstance(payload, list):
        for value in payload:
            found = find_dict_with(value, key)
            if found is not None:
                return found
    return None


def template_for_lang(lang_tag: str, templates: dict) -> str:
    """The template the site would send for a page in this language.

    `templateForLocale` in `src/services/mail-templates.ts` takes the first two
    letters and falls back to German, so `en-US` is `en` and an unknown tag is
    `de`. Mirrored here rather than assumed, because the browser notebook has
    to predict the id before the form is submitted.
    """
    language = str(lang_tag or "")[:2].lower()
    return templates.get(language) or templates.get("de", "")


# --------------------------------------------------------------------------
# checks
# --------------------------------------------------------------------------

@_dataclass
class Check:
    name: str
    status: str = "PASS"
    evidence: list = _dcfield(default_factory=list)

    def note(self, text) -> None:
        self.evidence.append(redact(text))

    def fail(self, text) -> None:
        self.status = "FAIL"
        self.note(text)

    def warn(self, text) -> None:
        if self.status == "PASS":
            self.status = "WARN"
        self.note(text)

    def skip(self, text) -> None:
        self.status = "SKIP"
        self.note(text)

    def expect(self, condition, description: str) -> bool:
        if condition:
            self.note("ok: " + description)
        else:
            self.fail("expected: " + description)
        return bool(condition)

    def require(self, result):
        """Record a call and hand it back, so a check reads as one sentence."""
        again = (f" after {result.attempts} attempts" if result.attempts > 1 else "")
        if isinstance(result, Result):
            self.note(f"HTTP {result.status} in {result.elapsed_ms} ms" + again
                      + (f", error: {result.error_message}" if result.errors else ""))
        elif isinstance(result, Response):
            self.note(f"HTTP {result.status} in {result.elapsed_ms} ms" + again
                      + (f", {result.error}" if result.error else ""))
        return result

    def missing_auth(self) -> bool:
        """SKIP without the admin credential, FAIL without it on a runner.

        The admin read is the point of this gate. Locally it is allowed to be
        absent, so the suite still runs and still says something useful; in CI
        the secret is set on the repository and its absence is a broken gate.
        """
        if have_emailwerk_auth():
            return False
        if CONFIG["ci"]:
            self.fail("EMAILWERK_AUTH is not set, and in CI the admin read is the gate")
        else:
            self.skip("EMAILWERK_AUTH is not set, the admin half is not run")
        return True


_RUN = {"name": "", "checks": []}


def start_run(name: str) -> None:
    _RUN["name"] = name
    _RUN["checks"] = []
    print(f"run {name}  brand={BRAND}  site={CONFIG['site_url']}  origin={CONFIG['site_origin']}")
    print(f"  emailwerk={CONFIG['emailwerk_url']}  admin credential={'yes' if have_emailwerk_auth() else 'no'}"
          f"  ci={'yes' if CONFIG['ci'] else 'no'}  drill={'yes' if CONFIG['drill'] else 'no'}")


@_contextmanager
def check(name: str):
    entry = Check(name)
    try:
        yield entry
    except Exception as err:  # a broken check is a failed check, not a dead run
        entry.status = "FAIL"
        entry.note(f"exception: {err}")
        entry.note(_traceback.format_exc()[-400:])
    _RUN["checks"].append(entry)
    mark = {"PASS": "ok  ", "FAIL": "FAIL", "WARN": "warn", "SKIP": "skip"}[entry.status]
    print(f"  {mark}  {name}")
    for line in entry.evidence:
        print(f"        {line}")


def counts() -> dict:
    tally = {"PASS": 0, "FAIL": 0, "WARN": 0, "SKIP": 0}
    for entry in _RUN["checks"]:
        tally[entry.status] += 1
    return tally


def summary() -> dict:
    tally = counts()
    line = (f"{_RUN['name']} [{BRAND}] {CONFIG['site_url']}: "
            f"{tally['PASS']} pass, {tally['FAIL']} fail, {tally['WARN']} warn, {tally['SKIP']} skip")
    if _HAVE_IPYTHON:
        colour = "#b00" if tally["FAIL"] else ("#a60" if tally["WARN"] else "#070")
        rows = "".join(
            "<tr><td style='color:%s'>%s</td><td>%s</td></tr>" % (
                "#b00" if c.status == "FAIL" else "#a60" if c.status == "WARN"
                else "#777" if c.status == "SKIP" else "#070", c.status, c.name)
            for c in _RUN["checks"])
        _display(_HTML(f"<p style='color:{colour};font-weight:600'>{line}</p>"
                       f"<table style='font-size:90%'>{rows}</table>"))
    else:
        print(line)
    return tally


def verdict() -> bool:
    """False when anything failed, so a caller can act on it without exiting."""
    failed = [c.name for c in _RUN["checks"] if c.status == "FAIL"]
    if failed:
        print("FAILED:\n  " + "\n  ".join(failed))
        return False
    print("all checks passed, warned or were skipped")
    return True


def transcript() -> _pathlib.Path:
    """Every check of this run, written to `tests/out/<run>.json`.

    nbconvert does not write the executed notebook when a cell raised, and the
    cell that raises here is the last one, so a failed run would otherwise
    leave the artifact empty precisely when somebody needs to read it. This is
    written before the exit, so `tests/out/` always carries the verdict and the
    evidence behind it.
    """
    path = out_dir() / f"{_RUN['name']}.json"
    path.write_text(_json.dumps({
        "run": _RUN["name"],
        "brand": BRAND,
        "site_url": CONFIG["site_url"],
        "site_origin": CONFIG["site_origin"],
        "counts": counts(),
        "checks": [{"name": c.name, "status": c.status, "evidence": c.evidence}
                   for c in _RUN["checks"]],
    }, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def finish() -> None:
    """The last cell of every notebook, and the whole reason this is a gate.

    nbconvert reports a cell that raised as an error and ends non-zero, so a
    failed check becomes a failed workflow step and the workflow goes on to
    decide whether a rollback would help.
    """
    summary()
    try:
        print("transcript:", transcript())
    except Exception as err:  # a missing transcript must not hide the verdict
        print("transcript could not be written:", err)
    if not verdict():
        raise SystemExit(1)
