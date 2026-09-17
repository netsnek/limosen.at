---
type: OKF Decisions
title: Hard rules
description: Decisions that are settled for limosen and must not be reopened without a reason that is written down.
tags: [limosen, decisions]
timestamp: 2026-09-17T14:40:00+02:00
---

# Hard rules

## The two brands are never mixed

limosen.at is LIMOSEN KG. The sibling site is KRC Limousinenservice KG on
booklimo.at, in `netsnek/booklimo.at`. That is another company, not another
configuration of this one, and since 2026-09-17 this is the owner's first rule
rather than a consequence of the others.

Brand data is anything a reader or a system could tell the two apart by: the
mail recipients and every sender-facing address, the phone numbers, the
template ids and their descriptions and bodies, the pylon host, the domains,
the logos and the favicon, the page metadata, the Google Business entry, and
the colours from the moment each brand has its own. None of it is shared, none
of it is copied "for now", and nothing here describes the other brand, not a
number, not an address, not a link. Shared infrastructure is not brand data:
the Cloudflare account, the emailwerk tenant, the sender `office@snek.at` and
`https://emailwerk.com/graphql` carry both companies and are named in both
repositories.

Three mechanisms enforce it, one before the upload, two after.

`scripts/deploy.sh` refuses a build that carries `office@krclimo.at`,
`699 109 983 52` or `KRC Limousinenservice`, and refuses one that is missing
this company's own `660 876 06 06`. It caught a real case on its first run:
`jaen-data/2026-09-04-krc-branding.json` was still in this repository's patch
list and would have made this site introduce itself as KRC Limousinenservice in
all four languages.

The suite in `tests/` asks the same question of the site that is live and of
everything the build cannot see: the served HTML and the bundle, the recipients
and the subject and the body of every template this site sends, the bodies of
their confirmation children, the palette (`#bf9c60` is KRC's gold and is a
failure here, `#d4af37` is ours), and the backend the bundle talks to, which
has to be `api.limosen.at` and never the sibling's.

The third is the one the other two cannot reach. Both of them read what the
build produced, and `.github/workflows/` is never part of that, so a workflow
naming the sibling's Cloudflare Pages project would put this tree on the other
company's domain without one string of theirs appearing anywhere a grep looks.
That is not a hypothetical: the sibling repository's own deploy workflow named
this project, on every push, until 2026-09-17. Section 3 of the contract
notebook reads every workflow file in this repository and fails if the project
it names is not this brand's.

## This tree serves one brand

No variant flag, no second record in the config, no conditional on the site url
inside a component. The sibling brand lives in `netsnek/booklimo.at` and is
maintained separately.

This is the owner's rule and it is also the lesson of the switch it replaced:
`ACTIVE_VARIANT` read `process.env.SITE_VARIANT`, Gatsby inlines only `GATSBY_`
prefixed variables, and a visitor watched the contact address change under them
between render and hydration.

## limosen is where a shared fix usually starts, and it is not a dependency

This is the older and more complete of the two sites, so a feature is likely to
appear here first. Applying it to the other brand is a deliberate second act.
The notebook suite checks both brands for exactly that reason: the booking form
was correct on one brand and broken on the other for months, and nobody noticed
because nothing looked at both.

## The app's rules are the platform's rules

Who may see a price, whose transfers a driver receives, what a customer may do:
none of that is decided here. It belongs to `netsnek/taxi-app`, and the
specification is
[its permissions bundle](https://github.com/netsnek/taxi-app/blob/main/okf/architecture/permissions.md).
Do not add a role check in a view in this repository. A rule that lives only in
a component is decoration.

## A public form needs a public template

emailwerk refuses a template that is not `isPublic` to a signed-out caller, and
refuses it before a message row exists, so the failure leaves no trace in the
message log at all. Every template either form sends must be public and must have
a verified sender. This was wrong here for months and produced exactly zero
evidence.

## The deployment is by hand until jaen is published

`link:` dependencies on an unpublished branch cannot resolve on a CI runner. A
workflow that cannot pass is worse than no workflow.

## The public website has no colour mode, the CMS and the app default to dark

`colorMode: {default: 'dark'}` in gatsby-config's `gatsby-plugin-jaen` block
applies to jaen's own pages and to `/app/*` only. Every public page is forced
light by the plugin, whatever a visitor stored, so the marketing site is exactly
the site it always was and needs no dark audit. Inside the CMS and the app the
first paint is dark and the toggle still reaches light. The palette dark
resolves to is this site's, not the app's and not jaen's: the app's screens
read `bg.*`, `fg.*`, `border.*` and the `brand` palette from the `_dark`
halves in `src/styles/theme/system.ts`, and jaen merges them over its own
grey. The values are the old app's charcoal and gold, measured from
`git show 265b18a:app/shared/styles/tokens.css` in the taxi-app repository,
and they are written there once as `dark`. A dark colour that needs changing
is changed there, never in `gatsby-jaen-app` and never as a hardcoded value in
a component.

## A jaen grey in dark is a bug, and the fix is a name

Measured 2026-09-05 on the live 1.0.0 in dark, signed in as the admin: the
avatar in the bar sat on `#1A202C` with `#E2E8F0` on it, every ghost and
secondary button of the frame, the drawer entries, the settings tabs and the
pagination read `#E2E8F0`, every input was `#1A202C`, and `/settings/`,
`/app/me/` and the first screen after the login redirect had a `#1A202C` body
under charcoal cards. All of it was jaen's v2 grey ramp, and none of it could
be reached from `bg.*`, `fg.*` or `border.*`, because those places did not
read a semantic name at all.

Three rules follow.

The frame never writes a grey literal that a site token could stand for. Where
jaen wants gray.200 on a dark label it says `fg.emphasized`, where it wants
gray.800 under a dark input it says `bg.subtle`, and it chooses the name whose
jaen value is the very grey it replaces, so jaen and the sibling brand render
as before and only a site with its own dark half moves.
A canvas is no exception: the page tree on `/cms/pages/` is WebGL and was a
white block in dark, and it now reads the frame's `bg.surface`, `border.*` and
`fg.*` off the document and paints those.

The `gray` palette slots are the site's too. v3 fills `gray.fg`, `gray.muted`,
`gray.subtle` and their siblings off the grey ramp, and everything that is not
a button resolves against them under `html {colorPalette: gray}`. The site
defines the eight slots beside `brand` in `src/styles/theme/system.ts`, with
the same charcoal values its surfaces use, and jaen's `theme/system.ts` merges
them, together with the `focus` shadow, over its own.

The site's own `body` rule carries the charcoal in its `_dark` half. The
public site is forced light, so that half never renders on a public page, but
the rule does reach the frame on a page rendered before the page config says
`jaen`, and there it competes with jaen's `body` on equal specificity. With
the same charcoal in both, the winner does not matter.

## An SVG id is per instance, or the second logo is a ghost

The frame mounts the mark up to three times on one page, the bar's left slot,
the bar's centred slot for the narrow widths, and the drawer's header, and
displays one bar slot at a time. `fill="url(#silverGrad)"` resolves against
the document, to the first element with that id, and at 390px wide that is
the gradient inside the hidden slot, which the browser does not paint.
Measured on the live site in both modes: the centred logo and the drawer's
logo were a dark ghost of their outline strokes, in dark invisible on the
charcoal. `Logo-limosen.tsx` prefixes every id with `useId()` now. Any
gradient, clip path or `<use>` added to the mark takes the same prefix.
