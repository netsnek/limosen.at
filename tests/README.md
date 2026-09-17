# The post-deploy gate

Two notebooks that ask the deployed limosen.at whether a visitor's enquiry can
still reach the company, a script that puts the previous deployment back when
it cannot, and the workflow that runs both after every upload.

## Why it exists

On 2026-09-07 at 18:40 UTC `taxi-app/scripts/mail-audience-templates.py` ran
`templateUpdate` over every template of this tenant with
`"envelope": {"subject": …, "to": []}`. emailwerk writes `to: input.to ?? []`,
so all four request templates of this brand lost their stored recipients.

The site sends its contact form and its booking form anonymously, and the
anonymous branch of `sendTemplateMail` takes the recipients from the template's
stored envelope and refuses a template without one:

    {"errors":[{"message":"Diese Vorlage hat keinen hinterlegten Empfänger.",
      "extensions":{"code":"PUBLIC_SEND_NO_STORED_RECIPIENT","statusCode":400}}]}

From that moment every enquiry on limosen.at ended in "Error / Something went
wrong." It stayed broken for ten days and nine deploys, because nothing looked
at the live templates after an upload. The recipients were restored on
2026-09-17 and verified with one real send.

Nothing about that failure was visible in the repository, in the build or in
the deploy log. It could only be found by asking the live system, which is what
this suite does.

## What each notebook proves

### `01-contact-mail-contract.ipynb` — no browser, read only

1. the site serves a page and an `/app-<hash>.js` bundle that names
   `https://emailwerk.com/graphql`;
2. the bundle's own `de/en/tr/ar` template map, which is what the deployed site
   sends, and whether it agrees with `mail-templates/ids.json` (a difference is
   a warning: the live site was built from another commit);
3. neither the HTML nor the bundle carries KRC's address, phone number, name or
   domain, this company's own number is there, and no workflow in
   `.github/workflows/` names the sibling's Cloudflare Pages project. The last
   one is the only brand question asked of a file the build never writes, and it
   is the one the sibling repository failed for months;
4. a browser on `https://limosen.at` is allowed to call emailwerk (the CORS
   preflight, which once failed silently and was invisible to curl);
5. the anonymous send path is open and still has the shape the site posts,
   proven with a deliberately invalid `replyTo`: emailwerk validates arguments
   before the rate limit and before the template lookup, so the probe is
   refused with `PUBLIC_SEND_INVALID_REPLY_TO` and nothing at all is created.
   `GRAPHQL_VALIDATION_FAILED`, HTTP 401 and `TEMPLATE_NOT_FOUND` are ruled out
   by name, because each would mean something different. Ruled out, not looked
   for: validation runs before the template lookup, so this probe can never
   reach a missing or private template and only section 6 can say whether the
   deployed ids still exist and are still public;
6. **every deployed template is readable, public, sendable without a signature
   or a verified reply-to, sends from this tenant's sender, and still carries
   `office@limosen.at` and `limosen@netsnek.com` in its stored envelope.** This
   is the check that would have caught 2026-09-07;
7. no recipient, subject or body of those templates, or of their confirmation
   children, names the other company. The palette is asked separately, so that
   neither question can go amber for the other's reason: none of the bodies
   carries KRC's gold `#bf9c60`, and a template that has lost limosen's own
   `#d4af37` is a warning;
8. each request template has exactly one public child, with an empty `to`, so
   the server answers the visitor in their own language and not a fixed
   address;
9. `src/services/mail-templates.ts` and `mail-templates/ids.json` agree;
   the booking form's backend (`https://api.limosen.at/graphql`) answers the
   preflight, still deploys `bookTransfer(args: …)` — proven with a planted
   field that stops the call during validation, so no row is written — and the
   bundle names no sibling pylon.

### `02-contact-form-browser.ipynb` — Chromium, headless, read only

Both backends are intercepted before the request leaves the browser, so no mail
is sent and no booking is written. The interception is the safety and it is the
only one: `smoke@example.invalid` in the email field would only bounce the
visitor's own confirmation copy, while the request template carries the
company's stored recipients, so an enquiry that escaped would arrive. The routes
therefore match a host rather than a URL, which a query string or a new path
segment cannot slip past, and a backstop on the browser context aborts anything
naming a mutation that no route claimed.

1. `?contact=<text>` opens the dialog with the text already in the textarea;
2. submitting posts exactly one request to emailwerk;
3. that request selects only `sendTemplateMail`, carries the template of the
   page's own language (`<html lang>`), the visitor's address as `replyTo`, no
   recipient and no subject of its own, the values the form collected, and no
   `Authorization` header;
4. a success closes the dialog and shows a green toast;
5. a refusal keeps the dialog open, with everything the visitor typed, and
   shows a red one;
6. `?booking` posts `bookTransfer` to this brand's pylon **first** and the mail
   afterwards, so the mail can carry the code the pylon minted
   (`bookingCode`, `code`);
7. a refused booking still sends the enquiry, with an empty code, and warns the
   visitor that the booking is not in the system yet, which is what
   `booking.tsx` is written to do;
8. and, last, that the backstop caught nothing. It is empty on every healthy
   run; the run it is not empty on is the one where an endpoint moved and a
   route stopped matching, which is the only way this notebook could put mail in
   the company's inbox.

A failing check writes a screenshot and the page as it stood into `tests/out/`.

## Running it locally

```sh
python3 -m venv tests/.venv
tests/.venv/bin/pip install -r tests/requirements.txt
tests/.venv/bin/playwright install chromium

EMAILWERK_AUTH="$(cat ~/.config/taxi-app/emailwerk-basic.txt)" \
tests/.venv/bin/jupyter nbconvert --to notebook --execute \
  --ExecutePreprocessor.timeout=900 --output-dir tests/out \
  tests/01-contact-mail-contract.ipynb tests/02-contact-form-browser.ipynb
```

Every variable is optional and every default is this brand's own.

| variable | what it does |
| --- | --- |
| `SITE_URL` | where pages and the bundle are fetched from. Default `https://limosen.at`. Point it at a `https://<short>.limosen.pages.dev` to test one particular deployment. |
| `SITE_ORIGIN` | the origin a browser would send, used for the CORS checks. Stays `https://limosen.at` even when `SITE_URL` is a preview, because what is under test is whether a visitor on the domain may make the call. |
| `EMAILWERK_AUTH` | `user:pass` for the admin read in section 6. Locally `~/.config/taxi-app/emailwerk-basic.txt`; in CI the repository secret of the same name. Never print it, never paste it into a cell: export it into the command's environment as above. |
| `EMAILWERK_URL` | default `https://emailwerk.com/graphql`. |
| `SITE_OUT_DIR` | where the transcript and the screenshots go. Default `tests/out`. The workflow uses it to keep the production run, the re-run, the run against the previous deployment and the run after a rollback apart. |
| `SMOKE_DRILL` | see below. |
| `CI` | when set, a missing `EMAILWERK_AUTH` is a failure instead of a skip. |

`tests/out/` is gitignored. Each run also writes `tests/out/<notebook>.json`
with every check, its status and its evidence, because `nbconvert` does not
write the executed notebook when a cell raised, and the cell that raises is the
last one.

A fetch that fails at the transport layer, or that answers 502, 503 or 504, is
tried up to three times with a short backoff, and the number of attempts is part
of the evidence. Sixteen calls go out over the open internet on every run, and
one of them failing once is not a broken deployment; it used to be enough to
fail the gate and, under the workflow, to revert a good upload. A deliberate
refusal, a 400, a 401, a 404 or a 429, is a real answer and is never
retried.

## The rollback

```sh
python tests/rollback.py --project limosen --deployment <uuid or short id> --plan
python tests/rollback.py --project limosen --deployment <uuid or short id>
```

`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` come from the environment;
locally they are in this repository's `.env`, which wrangler reads by itself.
The token is never printed.

Cloudflare Pages keeps every deployment's output, so a rollback is a new
production deployment made from an older one's content: seconds, no rebuild.
`--plan` prints one JSON line with the deployment that is live and the one that
would replace it, with the commit behind each, and changes nothing.

It refuses in three cases, each with its own exit code, because each needs a
different answer:

| exit | what it means |
| --- | --- |
| 2 | there is no successful production deployment older than this one |
| 3 | the given deployment could not be identified: it is not among the recent production deployments, or the prefix fits more than one of them |
| 4 | the given deployment is not the one being served any more, so something newer went out since and rolling back would revert that too |

An empty or half-copied `--deployment` is refused before any of that, with the
generic exit 1: the match is on a prefix so that wrangler's eight characters are
enough, and a prefix of nothing is a prefix of the newest deployment, which is
normally the live one. Both `scripts/deploy.sh` and the command above pass a
shell variable that is allowed to be empty, so it is checked rather than trusted.

After the rollback has been POSTed the script only asks whether the domain has
caught up, and a transient Cloudflare error during that poll is waited through
rather than acted on: the rollback is already made at that point, and ending on
a blip would send somebody to repair a site that is serving again. The
deployment it restored is named either way.

A rollback does not undo the service worker: the app plugin ships
`gatsby-plugin-offline`, so a visitor keeps the cached shell until the new
worker takes over.

## The workflow

`.github/workflows/post-deploy.yaml`, one job:

1. run the two notebooks against production, each as its own step. `nbconvert`
   stops at the first cell that raises, so one call for both would mean a
   failing notebook 01 leaves no browser evidence at all on exactly the run
   somebody has to diagnose;
2. if either failed, ask again: whatever failed is re-run once against
   production, into `tests/out/retry/`. Notebook 02 does four full page loads
   behind a CDN on a shared runner and notebook 01 makes sixteen calls over the
   open internet, so a single failure is not yet a verdict. Only what fails
   twice decides anything below;
3. if something failed twice **and** the run was told which deployment published
   the site, plan a rollback;
4. run the notebooks that failed twice — those, not a fixed list — against the
   deployment that would replace it. This is the decision: if that deployment
   fails the same way, the fault is not in what was uploaded, it is on emailwerk
   or on the pylon, and rolling back would only lose content. Deciding a browser
   failure with a contract run would be deciding it with a test that never saw
   it, and notebook 01 asks the shared backends the same questions from both
   sides, so it passes against the older deployment by construction;
5. only then roll back, and run both notebooks again;
6. write all of it into the run summary and upload `tests/out` as an artifact;
7. exit non-zero whenever the live site failed. A rolled back deploy is still a
   failed deploy. A failure that did not survive being asked again is not one,
   and the summary says so rather than borrowing the sentence for a broken site;
   so does a job that stopped before the notebooks ever ran.

`scripts/deploy.sh` starts it after the upload, with the deployment wrangler
just printed, and waits for the verdict with `gh run watch --exit-status`, so
the terminal that ran the deploy is where the failure appears. `--no-wait`
starts the gate and returns; the gate still rolls back on its own.

The schedule (`23 */6 * * *`) carries no deployment id, so a monitoring run can
never roll anything back. It only reports, which is what would have raised a
hand on 2026-09-08.

## The drill

`SMOKE_DRILL=1` makes the last check of notebook 01 fail on purpose and changes
nothing else:

```sh
SMOKE_DRILL=1 tests/.venv/bin/jupyter nbconvert --to notebook --execute \
  --output-dir tests/out tests/01-contact-mail-contract.ipynb
```

Starting the workflow by hand with `drill: true` sets it for the **first**
production run only, which exercises the whole rollback path on a healthy
system: plan, the check against the previous deployment, a real rollback, and
the recheck after it. The site is then serving the deployment before the
current one, so the operator deploys again with `scripts/deploy.sh`.
