// src/oidc/zitadel.ts
import {getContext, getEnv} from '@getcronit/pylon'
import validator from 'validator'

import type {
  AuthorizationCreateInput,
  AuthorizationUpdateInput,
  GetAllUsersResponse,
  ProjectRole,
  UserCreateResponse,
  UserPushSubscription,
  UserRoute,
  UserUpdateInput,
  ZitadelUser,
  ZitadelUserGrant
} from './types'

// --------------------------------------------------
// Helpers
// --------------------------------------------------
const env = () => getEnv() as any

const apiKey = (): string => env()?.ORG_USER_MANAGER_TOKEN ?? 'API_KEY'

const base = (): string => env()?.AUTH_ISSUER

const headers = (organizationId?: string): Record<string, string> => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${apiKey()}`,
  ...(organizationId ? {'x-zitadel-orgid': organizationId} : {})
})

const parseOrThrow = async <T = any>(res: Response): Promise<T> => {
  const data = (await res.json().catch(() => ({}))) as any
  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`)
  }
  return data as T
}

/**
 * Role displayName formatting:
 * - take everything after ":" from the role key
 * - uppercase first letter
 *
 * Examples:
 * - "limosen:driver" -> "Driver"
 * - "driver" -> "Driver"
 */
function roleDisplayNameFromKey(roleKey?: string | null): string | undefined {
  if (!roleKey) return undefined
  const raw = String(roleKey)
  const afterColon = raw.includes(':') ? (raw.split(':').pop() ?? '') : raw
  const s = afterColon.trim()
  if (!s) return undefined
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Extract user id from v1/v2 payload shapes */
function extractUserId(u: any): string {
  return String(
    u?.id ??
      u?.userId ??
      u?.user_id ??
      u?.user?.id ??
      u?.user?.userId ??
      u?.user?.user_id ??
      ''
  )
}

// --------------------------------------------------
// Request-scoped caches (avoid duplicate HTTP in same query)
// --------------------------------------------------
function getProjectRoleCaches() {
  const ctx = getContext() as any

  let roleCache = ctx.get('projectRoleCache') as Map<string, ProjectRole[]> | undefined
  if (!roleCache) {
    roleCache = new Map<string, ProjectRole[]>()
    ctx.set('projectRoleCache', roleCache)
  }

  let inflight = ctx.get('projectRoleInflight') as Map<string, Promise<ProjectRole[]>> | undefined
  if (!inflight) {
    inflight = new Map<string, Promise<ProjectRole[]>>()
    ctx.set('projectRoleInflight', inflight)
  }

  return {roleCache, inflight}
}

function getUserGrantCaches() {
  const ctx = getContext() as any

  let cache = ctx.get('zitadelUserGrantCache') as Map<string, ZitadelUserGrant[]> | undefined
  if (!cache) {
    cache = new Map<string, ZitadelUserGrant[]>()
    ctx.set('zitadelUserGrantCache', cache)
  }

  let inflight = ctx.get('zitadelUserGrantInflight') as Map<string, Promise<ZitadelUserGrant[]>> | undefined
  if (!inflight) {
    inflight = new Map<string, Promise<ZitadelUserGrant[]>>()
    ctx.set('zitadelUserGrantInflight', inflight)
  }

  return {cache, inflight}
}

function getUserCaches() {
  const ctx = getContext() as any

  let cache = ctx.get('zitadelUserCache') as Map<string, ZitadelUser> | undefined
  if (!cache) {
    cache = new Map<string, ZitadelUser>()
    ctx.set('zitadelUserCache', cache)
  }

  let inflight = ctx.get('zitadelUserInflight') as Map<string, Promise<ZitadelUser>> | undefined
  if (!inflight) {
    inflight = new Map<string, Promise<ZitadelUser>>()
    ctx.set('zitadelUserInflight', inflight)
  }

  return {cache, inflight}
}

// --------------------------------------------------
// Public helpers used by src/user/User.ts
// --------------------------------------------------

/**
 * Flatten roles from grants into unique ProjectRole[].
 * Keeps the "best" displayName encountered.
 */
export function flattenRolesFromGrants(grants: ZitadelUserGrant[]): ProjectRole[] {
  const map = new Map<string, ProjectRole>()

  for (const g of grants ?? []) {
    for (const r of g?.roles ?? []) {
      if (!r?.key) continue
      const existing = map.get(r.key)

      const displayName = roleDisplayNameFromKey(r.key)

      if (!existing) {
        map.set(r.key, {key: r.key, displayName})
      } else if (!existing.displayName && displayName) {
        map.set(r.key, {key: r.key, displayName})
      }
    }
  }

  return Array.from(map.values())
}

/**
 * List all project roles for a given project.
 *
 * - Normal projects: v2 ProjectService/ListProjectRoles
 * - Granted CMS project: mgmt v1 granted project roles search
 *
 * Cached per-request by (orgId + projectId).
 */
export async function listProjectRoles(
  projectId: string,
  limit = 100,
  organizationId?: string
): Promise<ProjectRole[]> {
  const {roleCache, inflight} = getProjectRoleCaches()
  const cacheKey = organizationId ? `${organizationId}:${projectId}` : projectId

  const cached = roleCache.get(cacheKey)
  if (cached) return cached

  const existingPromise = inflight.get(cacheKey)
  if (existingPromise) return existingPromise

  const promise = (async () => {
    const e: any = env()
    const authProjectId = e?.AUTH_PROJECT_ID
    const authProjectGrantId = e?.AUTH_PROJECT_GRANT_ID

    const isGrantedCmsProject = authProjectId && authProjectGrantId && projectId === authProjectId

    const grantedRolesRequest = async (): Promise<ProjectRole[]> => {
      const url = `${base()}/management/v1/granted_projects/${encodeURIComponent(
        authProjectId
      )}/grants/${encodeURIComponent(authProjectGrantId)}/roles/_search`

      const res = await fetch(url, {
        method: 'GET',
        headers: headers(organizationId)
      })

      const data = (await res.json().catch(() => ({}))) as any
      if (!res.ok) return []

      const rolesRaw =
        (Array.isArray(data.result) && data.result) ||
        (Array.isArray(data.projectRoles) && data.projectRoles) ||
        (Array.isArray(data.roles) && data.roles) ||
        []

      return rolesRaw
        .map((r: any) => {
          const key = (r.roleKey ?? r.key ?? '') as string
          return {
            key,
            displayName: roleDisplayNameFromKey(key)
          }
        })
        .filter((r: ProjectRole) => r.key)
    }

    const v2RolesRequest = async (): Promise<ProjectRole[]> => {
      const url = `${base()}/zitadel.project.v2.ProjectService/ListProjectRoles`

      const res = await fetch(url, {
        method: 'POST',
        headers: headers(organizationId),
        body: JSON.stringify({
          projectId,
          pagination: {offset: 0, limit}
        })
      })

      const data = (await res.json().catch(() => ({}))) as any
      if (!res.ok) return []

      const rolesRaw =
        (Array.isArray(data.projectRoles) && data.projectRoles) ||
        (Array.isArray(data.result) && data.result) ||
        (Array.isArray(data.roles) && data.roles) ||
        []

      return rolesRaw
        .map((r: any) => {
          const key = (r.roleKey ?? r.key ?? '') as string
          return {
            key,
            displayName: roleDisplayNameFromKey(key)
          }
        })
        .filter((r: ProjectRole) => r.key)
    }

    try {
      const roles = isGrantedCmsProject ? await grantedRolesRequest() : await v2RolesRequest()
      roleCache.set(cacheKey, roles)
      return roles
    } catch (err) {
      console.error('Failed to fetch project roles for project', projectId, err)
      const empty: ProjectRole[] = []
      roleCache.set(cacheKey, empty)
      return empty
    } finally {
      inflight.delete(cacheKey)
    }
  })()

  inflight.set(cacheKey, promise)
  return promise
}

/**
 * Fetch grants for a user (with ProjectRole objects enriched with displayName when possible).
 * Cached per-request by (orgId + userId).
 *
 * This is the function your src/user/User.ts calls.
 */
export async function getUserGrants(userId: string, organizationId?: string): Promise<ZitadelUserGrant[]> {
  const {cache, inflight} = getUserGrantCaches()
  const cacheKey = organizationId ? `${organizationId}:${userId}` : userId

  const cached = cache.get(cacheKey)
  if (cached) return cached

  const existingPromise = inflight.get(cacheKey)
  if (existingPromise) return existingPromise

  const promise = (async () => {
    const url = `${base()}/management/v1/users/grants/_search`

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: headers(organizationId),
        body: JSON.stringify({
          query: {offset: '0', limit: 100, asc: true},
          queries: [{user_id_query: {user_id: userId}}]
        })
      })

      const data = (await res.json().catch(() => ({}))) as any
      if (!res.ok) {
        console.error('Failed to fetch user grants for user', userId, '-', data?.message ?? `HTTP ${res.status}`)
        const empty: ZitadelUserGrant[] = []
        cache.set(cacheKey, empty)
        return empty
      }

      const results: any[] = Array.isArray(data.result) ? data.result : []
      const grants: ZitadelUserGrant[] = []

      for (const g of results) {
        const details = g.details ?? {}

        const roleKeys: string[] = Array.isArray(g.roleKeys)
          ? g.roleKeys.filter((r: any) => typeof r === 'string')
          : Array.isArray(g.roles)
            ? g.roles.filter((r: any) => typeof r === 'string')
            : []

        let roles: ProjectRole[] = []

        if (roleKeys.length && g.projectId) {
          const projectRoles = await listProjectRoles(String(g.projectId), 200, organizationId).catch(() => [])
          roles = roleKeys.map((key) => {
            const match = projectRoles.find((r) => r.key === key)
            return {key, displayName: match?.displayName ?? roleDisplayNameFromKey(key)}
          })
        } else {
          roles = roleKeys.map((key) => ({key, displayName: roleDisplayNameFromKey(key)}))
        }

        grants.push({
          organizationId: g.organizationId ?? g.orgId ?? undefined,
          creationDate: details.creationDate,
          changeDate: details.changeDate,
          projectId: g.projectId,
          projectName: g.projectName,
          state: g.state,
          roles
        })
      }

      cache.set(cacheKey, grants)
      return grants
    } catch (e) {
      console.error('Error while fetching user grants for user', userId, e)
      const empty: ZitadelUserGrant[] = []
      cache.set(cacheKey, empty)
      return empty
    } finally {
      inflight.delete(cacheKey)
    }
  })()

  inflight.set(cacheKey, promise)
  return promise
}

/** Convenience: flatten to unique role keys */
export async function getUserRoleKeys(userId: string, organizationId?: string): Promise<string[]> {
  const grants = await getUserGrants(userId, organizationId)
  const roles = flattenRolesFromGrants(grants)
  return roles.map((r) => r.key)
}

// --------------------------------------------------
// Metadata helpers (base64 values)
// --------------------------------------------------
function encodeMetadataValue(value: string): string {
  const g: any = globalThis as any
  if (typeof g?.btoa === 'function') return g.btoa(value)
  throw new Error('No base64 encoder available for metadata values')
}

function decodeMetadataValue(value: string | undefined | null): string | undefined {
  if (!value) return undefined
  const g: any = globalThis as any
  if (typeof g?.atob === 'function') {
    try {
      return g.atob(value)
    } catch {
      return undefined
    }
  }
  return undefined
}

export async function getUserNumericMetadata(userId: string, key: string, organizationId?: string): Promise<number | null> {
  const url = `${base()}/management/v1/users/${encodeURIComponent(userId)}/metadata/${encodeURIComponent(key)}`

  try {
    const res = await fetch(url, {method: 'GET', headers: headers(organizationId)})

    if (res.status === 404) {
      await res.text().catch(() => '')
      return null
    }

    const payload = (await res.json().catch(() => ({}))) as any
    if (!res.ok) return null

    const encoded =
      payload?.metadata?.value ??
      payload?.value ??
      (Array.isArray(payload?.result) ? payload.result[0]?.value : undefined)

    const decoded = decodeMetadataValue(encoded)
    if (!decoded) return null

    const numeric = parseFloat(decoded)
    return Number.isNaN(numeric) ? null : numeric
  } catch (e) {
    console.error(`Error while fetching numeric metadata "${key}" for user`, userId, e)
    return null
  }
}

export async function setUserNumericMetadata(
  userId: string,
  key: string,
  value: number,
  organizationId?: string
) {
  const url = `${base()}/management/v1/users/${encodeURIComponent(userId)}/metadata/_bulk`
  const encoded = encodeMetadataValue(String(value))

  const res = await fetch(url, {
    method: 'POST',
    headers: headers(organizationId),
    body: JSON.stringify({
      metadata: [{key, value: encoded}]
    })
  })

  return parseOrThrow(res)
}

export async function getUserJsonMetadata<T>(userId: string, key: string, organizationId?: string): Promise<T | null> {
  const url = `${base()}/management/v1/users/${encodeURIComponent(userId)}/metadata/${encodeURIComponent(key)}`

  try {
    const res = await fetch(url, {method: 'GET', headers: headers(organizationId)})

    if (res.status === 404) {
      await res.text().catch(() => '')
      return null
    }

    const payload = (await res.json().catch(() => ({}))) as any
    if (!res.ok) return null

    const encoded =
      payload?.metadata?.value ??
      payload?.value ??
      (Array.isArray(payload?.result) ? payload.result[0]?.value : undefined)

    const decoded = decodeMetadataValue(encoded)
    if (!decoded) return null

    try {
      return JSON.parse(decoded) as T
    } catch (e) {
      console.error(`Failed to parse JSON metadata "${key}" for user`, userId, e)
      return null
    }
  } catch (e) {
    console.error(`Error while fetching JSON metadata "${key}" for user`, userId, e)
    return null
  }
}

export async function setUserJsonMetadata(userId: string, key: string, value: any, organizationId?: string) {
  const url = `${base()}/management/v1/users/${encodeURIComponent(userId)}/metadata/_bulk`
  const encoded = encodeMetadataValue(JSON.stringify(value))

  const res = await fetch(url, {
    method: 'POST',
    headers: headers(organizationId),
    body: JSON.stringify({
      metadata: [{key, value: encoded}]
    })
  })

  return parseOrThrow(res)
}

// --------------------------------------------------
// Optional: User CRUD / listing (kept compatible with your old service)
// --------------------------------------------------
export async function getIsUnique(loginName: string): Promise<boolean | null> {
  const e: any = env()
  let url = ''

  if (validator.isEmail(loginName) === true) {
    url = `${e?.AUTH_ISSUER}/management/v1/users/_is_unique?email=${encodeURIComponent(loginName)}`
  } else if (validator.isAlphanumeric(loginName) === true) {
    url = `${e?.AUTH_ISSUER}/management/v1/users/_is_unique?userName=${encodeURIComponent(loginName)}`
  }

  if (!url) throw new Error('Invalid email/username format')

  const response: Response = await fetch(url, {method: 'GET', headers: headers()})
  const data = (await response.json().catch(() => ({}))) as any
  if (!response.ok) throw new Error(data?.message || 'Something has gone Wrong')

  return data?.isUnique ? true : false
}

export async function userCreate(
  values: {
    emailAddress: string
    username: string
    password?: string
    hashedPassword?: string
    details?: {firstName?: string; lastName?: string}
  },
  organizationId?: string,
  createProfile?: boolean,
  skipEmailVerification?: boolean
): Promise<UserCreateResponse> {
  const e: any = env()
  const emailAddress = values.emailAddress.toLowerCase()
  const username = values.username.toLowerCase()

  const url = `${e?.AUTH_ISSUER}/management/v1/users/human/_import`

  if (!(await getIsUnique(username)) || !(await getIsUnique(emailAddress))) {
    throw new Error(`${username} <${emailAddress}> already exists`)
  }

  const response: Response = await fetch(url, {
    method: 'POST',
    headers: headers(organizationId),
    body: JSON.stringify({
      userName: values.username,
      ...(createProfile === false
        ? {}
        : {
            profile: {
              firstName: values.details?.firstName ?? '',
              lastName: values.details?.lastName ?? '',
              preferredLanguage: 'en'
            }
          }),
      ...(values.hashedPassword ? {hashedPassword: {value: values.hashedPassword}} : {}),
      email: {
        email: values.emailAddress,
        isEmailVerified: skipEmailVerification || false
      },
      ...(values.password
        ? {
            password: values.password,
            passwordChangeRequired: false
          }
        : {})
    })
  })

  const data = (await response.json().catch(() => ({}))) as UserCreateResponse
  if (!response.ok) throw new Error((data as any)?.details?.toString?.() || 'Something has gone Wrong')

  return data
}

export async function getZitadelUserById(userId: string, organizationId?: string): Promise<ZitadelUser> {
  const {cache, inflight} = getUserCaches()
  const cacheKey = organizationId ? `${organizationId}:${userId}` : userId

  const cached = cache.get(cacheKey)
  if (cached) return cached

  const existingPromise = inflight.get(cacheKey)
  if (existingPromise) return existingPromise

  const promise = (async () => {
    const url = `${base()}/management/v1/users/${encodeURIComponent(userId)}`

    try {
      const response = await fetch(url, {method: 'GET', headers: headers(organizationId)})
      const data = (await response.json().catch(() => ({}))) as any

      if (!response.ok) {
        if (response.status === 404) throw new Error(`User not found: ${userId}`)
        throw new Error(data?.message || 'Something has gone Wrong')
      }

      const user = (data?.user ?? data) as ZitadelUser
      if (!user?.id) throw new Error('Malformed user payload')

      cache.set(cacheKey, user)
      return user
    } finally {
      inflight.delete(cacheKey)
    }
  })()

  inflight.set(cacheKey, promise)
  return promise
}

export async function listAllZitadelUsers(limit = 100, organizationId?: string): Promise<ZitadelUser[]> {
  // Use v2 list to include BOTH humans + machines, then hydrate via v1 get-by-id
  // because v2 list/search responses differ in field names (username/user_id)
  // and creation date has historically been missing in v2 user search responses.
  try {
    const url = `${base()}/v2/users`

    const response = await fetch(url, {
      method: 'POST',
      headers: headers(organizationId),
      body: JSON.stringify({
        query: {offset: 0, limit, asc: true},
        sorting_column: 'USER_FIELD_NAME_USER_NAME',
        queries: [
          {
            or_query: {
              queries: [{type_query: {type: 'TYPE_HUMAN'}}, {type_query: {type: 'TYPE_MACHINE'}}]
            }
          }
        ]
      })
    })

    const payload = (await response.json().catch(() => ({}))) as any
    if (!response.ok) throw new Error(payload?.message || 'Something has gone Wrong')

    const raw =
      (Array.isArray(payload?.result) && payload.result) ||
      (Array.isArray(payload?.users) && payload.users) ||
      []

    const out: ZitadelUser[] = []
    for (const item of raw) {
      const id = extractUserId(item)
      if (!id) continue
      const full = await getZitadelUserById(id, organizationId).catch(() => null)
      if (full) out.push(full)
    }

    return out
  } catch (e) {
    // Fallback to legacy v1 search
    const url = `${base()}/management/v1/users/_search`

    const response = await fetch(url, {
      method: 'POST',
      headers: headers(organizationId),
      body: JSON.stringify({limit, offset: 0})
    })

    const payload = (await response.json().catch(() => ({}))) as any
    if (!response.ok) throw new Error(payload?.message || 'Something has gone Wrong')

    const data = payload as GetAllUsersResponse
    return data.result ?? []
  }
}

export async function getUserCount(): Promise<number> {
  // Prefer v2 (includes both human + machine), fallback to v1
  try {
    const url = `${base()}/v2/users`

    const response = await fetch(url, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        query: {offset: 0, limit: 1, asc: true},
        sorting_column: 'USER_FIELD_NAME_USER_NAME',
        queries: [
          {
            or_query: {
              queries: [{type_query: {type: 'TYPE_HUMAN'}}, {type_query: {type: 'TYPE_MACHINE'}}]
            }
          }
        ]
      })
    })

    const payload = (await response.json().catch(() => ({}))) as any
    if (!response.ok) throw new Error(payload?.message || 'Something has gone Wrong')

    const totalRaw =
      payload?.details?.total_result ??
      payload?.details?.totalResult ??
      payload?.details?.total_results ??
      payload?.details?.totalResults

    const n = typeof totalRaw === 'string' ? parseInt(totalRaw) : typeof totalRaw === 'number' ? totalRaw : 0
    return Number.isFinite(n) ? n : 0
  } catch {
    const url = `${base()}/management/v1/users/_search`

    const response = await fetch(url, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({limit: 1, offset: 0})
    })

    const payload = (await response.json().catch(() => ({}))) as any
    if (!response.ok) throw new Error(payload?.message || 'Something has gone Wrong')

    const data = payload as GetAllUsersResponse
    return parseInt(data.details.totalResult) || 0
  }
}

export async function listUsersByRole(roleKey: string, limit = 100, organizationId?: string): Promise<ZitadelUser[]> {
  const allUsers = await listAllZitadelUsers(limit, organizationId)
  const matches: ZitadelUser[] = []

  for (const u of allUsers) {
    try {
      const userId = String((u as any)?.id ?? '')
      if (!userId) continue
      const grants = await getUserGrants(userId, organizationId)
      const roles = flattenRolesFromGrants(grants)
      if (roles.some((r) => r.key === roleKey)) matches.push(u)
    } catch (e) {
      console.error('Failed to filter by role for user', (u as any)?.id, e)
    }
  }

  return matches
}

// --------------------------------------------------
// Project role management (create/delete roles)
// --------------------------------------------------
export async function addProjectRole(projectId: string, roleKey: string, displayName?: string, organizationId?: string) {
  const url = `${base()}/zitadel.project.v2.ProjectService/AddProjectRole`
  const body: any = {projectId, roleKey}
  if (displayName) body.displayName = displayName

  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify(body)})
  return parseOrThrow(res)
}

export async function removeProjectRole(projectId: string, roleKey: string, organizationId?: string) {
  const url = `${base()}/zitadel.project.v2.ProjectService/RemoveProjectRole`
  const res = await fetch(url, {
    method: 'POST',
    headers: headers(organizationId),
    body: JSON.stringify({projectId, roleKey})
  })
  return parseOrThrow(res)
}

// --------------------------------------------------
// User lifecycle / updates / credentials
// --------------------------------------------------
export async function deleteUser(userId: string, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}`
  const res = await fetch(url, {method: 'DELETE', headers: headers(organizationId)})
  return parseOrThrow(res)
}

export async function deactivateUser(userId: string, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}/deactivate`
  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify({})})
  return parseOrThrow(res)
}

export async function reactivateUser(userId: string, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}/reactivate`
  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify({})})
  return parseOrThrow(res)
}

export async function lockUser(userId: string, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}/lock`
  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify({})})
  return parseOrThrow(res)
}

export async function unlockUser(userId: string, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}/unlock`
  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify({})})
  return parseOrThrow(res)
}

export async function updateUser(userId: string, changes: UserUpdateInput, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}`

  const payload: any = {}
  if (changes.username) payload.username = changes.username
  if (changes.profile) payload.profile = {...changes.profile}
  if (changes.email) payload.email = {...changes.email}
  if (changes.phone) payload.phone = {...changes.phone}
  if (changes.password) {
    payload.newPassword = {
      password: changes.password.password,
      changeRequired: !!changes.password.changeRequired
    }
  }

  const res = await fetch(url, {method: 'PATCH', headers: headers(organizationId), body: JSON.stringify(payload)})
  return parseOrThrow(res)
}

export async function setPassword(userId: string, newPassword: string, changeRequired = false, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}/password`
  const res = await fetch(url, {
    method: 'POST',
    headers: headers(organizationId),
    body: JSON.stringify({newPassword: {password: newPassword, changeRequired}})
  })
  return parseOrThrow(res)
}

export async function requestPasswordReset(userId: string, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}/password_reset`
  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify({})})
  return parseOrThrow(res)
}

export async function sendEmailVerification(userId: string, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}/email/send`
  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify({})})
  return parseOrThrow(res)
}

export async function resendEmailVerification(userId: string, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}/email/resend`
  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify({})})
  return parseOrThrow(res)
}

export async function verifyEmail(userId: string, code: string, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}/email/verify`
  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify({code})})
  return parseOrThrow(res)
}

export async function setPhone(userId: string, phone: string, organizationId?: string) {
  const url = `${base()}/v2/users/${encodeURIComponent(userId)}/phone`
  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify({phone})})
  return parseOrThrow(res)
}

// --------------------------------------------------
// Authorization / role assignment
// --------------------------------------------------
export async function createAuthorization(input: AuthorizationCreateInput, organizationId?: string) {
  const url = `${base()}/zitadel.authorization.v2.AuthorizationService/CreateAuthorization`
  const body = {
    userId: input.userId,
    roleKeys: input.roleKeys,
    ...(input.projectId ? {projectId: input.projectId} : {}),
    ...(input.projectGrantId ? {projectGrantId: input.projectGrantId} : {})
  }
  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify(body)})
  return parseOrThrow(res)
}

export async function updateAuthorization(input: AuthorizationUpdateInput, organizationId?: string) {
  const url = `${base()}/zitadel.authorization.v2.AuthorizationService/UpdateAuthorization`
  const body = {authorizationId: input.authorizationId, roleKeys: input.roleKeys}
  const res = await fetch(url, {method: 'POST', headers: headers(organizationId), body: JSON.stringify(body)})
  return parseOrThrow(res)
}

export async function deleteAuthorization(authorizationId: string, organizationId?: string) {
  const url = `${base()}/zitadel.authorization.v2.AuthorizationService/DeleteAuthorization`
  const res = await fetch(url, {
    method: 'POST',
    headers: headers(organizationId),
    body: JSON.stringify({authorizationId})
  })
  return parseOrThrow(res)
}

// --------------------------------------------------
// Convenience metadata accessors (same keys as before)
// --------------------------------------------------
export async function getUserRoutes(userId: string, organizationId?: string): Promise<UserRoute[] | null> {
  return getUserJsonMetadata<UserRoute[]>(userId, 'routes', organizationId)
}
export async function setUserRoutes(userId: string, routes: UserRoute[], organizationId?: string) {
  return setUserJsonMetadata(userId, 'routes', routes, organizationId)
}

export async function getUserPushSubscriptions(userId: string, organizationId?: string): Promise<UserPushSubscription[] | null> {
  return getUserJsonMetadata<UserPushSubscription[]>(userId, 'pushSubscriptions', organizationId)
}
export async function setUserPushSubscriptions(userId: string, subs: UserPushSubscription[], organizationId?: string) {
  return setUserJsonMetadata(userId, 'pushSubscriptions', subs, organizationId)
}

export async function getUserPrices(userId: string, organizationId?: string): Promise<any | null> {
  return getUserJsonMetadata<any>(userId, 'prices', organizationId)
}
export async function setUserPrices(userId: string, prices: any, organizationId?: string) {
  return setUserJsonMetadata(userId, 'prices', prices, organizationId)
}

export async function getUserDriverColor(userId: string, organizationId?: string): Promise<string | null> {
  return (getUserJsonMetadata<string>(userId, 'driverColor', organizationId) as unknown) as Promise<string | null>
}
export async function setUserDriverColor(userId: string, color: string | null, organizationId?: string) {
  return setUserJsonMetadata(userId, 'driverColor', color, organizationId)
}
