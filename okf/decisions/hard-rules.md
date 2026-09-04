---
type: OKF Decisions
title: Hard rules
description: Decisions that are settled for limosen and must not be reopened without a reason that is written down.
tags: [limosen, decisions]
timestamp: 2026-09-04T23:30:00+02:00
---

# Hard rules

## This tree serves one brand

No variant flag, no second record in the config, no conditional on the site url
inside a component. The sibling brand lives in `netsnek/booklimo.at` and is
maintained separately.

This is the owner's rule and it is also the lesson of the switch it replaced:
`ACTIVE_VARIANT` read `process.env.SITE_VARIANT`, Gatsby inlines only `GATSBY_`
prefixed variables, and a visitor watched the contact address change under them
between render and hydration.

## Nothing about the other brand appears here

Not a phone number, not a mail address, not a logo, not a favicon, not a link,
and not in the page metadata. The deploy script refuses a build that carries the
other brand's data or is missing this one's, and it caught a real case on its
first run.

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
