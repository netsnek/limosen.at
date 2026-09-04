---
type: OKF Architecture
title: Identity
description: >
  The Zitadel organization behind this brand, the client it shares with the
  sibling site, and how the app decides who is a driver.
tags: [limosen, zitadel, oidc, identity]
timestamp: 2026-09-04T21:30:00+02:00
---

# Identity

Zitadel at `https://accounts.netsnek.com`, one identity server, one organization
per brand.

| | limosen | booklimo |
|---|---|---|
| Zitadel organization | `339284789469124181` | `356348844407002709`, named `krc` |
| OIDC client | `268283382465631862@cms` | the same one |
| Project | `268283277977065078` | the same one |
| Redirect uri | `https://limosen.at/loading` | `https://new.booklimo.at/loading` |
| IAM worker | `iam.netsnek.workers.dev` | `krc-iam.netsnek.workers.dev` |

`src/pages/loading.tsx` exists to receive the redirect. Without that route the
login bounced into a 404, which is why the deploy script checks for it.

The OIDC **application** is shared. Both brands present the same `client_id`, so
they cannot have different consent screens, token lifetimes, scopes or
post-logout behaviour, and a change made for one is made for both. A dedicated
application per organization is the missing piece and has to be created in the
Zitadel console.

## Drivers

A driver is an account in this organization holding the project role
`limosen:driver`, which `gatsby-config.ts` passes to the app as
`driverRoleKey`. The dispatch screen's picker filters by it and by
`USER_STATE_ACTIVE` and shows given and family names, because offering every
account there put customers and hotel front desks in a dropdown of drivers.

Two Zitadel facts that cost time, recorded so they do not cost it again:

- `CreateAuthorization` takes the organization **in the request body**. The
  `x-zitadel-orgid` header is ignored, so a grant made with only the header lands
  in the wrong organization and the driver appears nowhere.
- The REST v1 and v2 user endpoints are gone. `zitadel.user.v2.UserService/ListUsers`,
  `GetUserByID` and `zitadel.authorization.v2beta.AuthorizationService/ListAuthorizations`
  over Connect are what answer, and the v2 profile spells the names `givenName`
  and `familyName`.

A removed endpoint answers `404 page not found` as plain text. `JSON.parse` on
that fails at position 4, and in psylon that turned every authenticated request
into a bare HTTP 500. Roles now fall back to an empty list when the response
cannot be parsed.
