// src/oidc/types.ts

// -----------------------------
// Core enums / shared shapes
// -----------------------------

export enum ZitadelUserType {
  TYPE_UNSPECIFIED = 'TYPE_UNSPECIFIED',
  TYPE_HUMAN = 'TYPE_HUMAN',
  TYPE_MACHINE = 'TYPE_MACHINE'
}

export interface ZitadelUserDetails {
  sequence?: string
  creationDate?: string
  changeDate?: string
  resourceOwner?: string
}

// -----------------------------
// List/Search response shapes
// -----------------------------

export interface ZitadelGetAllUsersResponse {
  details: {
    totalResult: string
    viewTimestamp: string
  }
  result: ZitadelUser[]
}

// -----------------------------
// Roles / Grants
// -----------------------------

export interface ZitadelProjectRole {
  key: string
  displayName?: string
}

export interface ZitadelUserGrant {
  organizationId?: string
  creationDate?: string
  changeDate?: string
  projectId?: string
  projectName?: string
  state?: string
  roles: ZitadelProjectRole[]
}

// -----------------------------
// Metadata payloads you store
// -----------------------------

export interface ZitadelUserRoute {
  start: string
  end: string
  price: number
  vehicle?: string
}

export interface ZitadelUserPushSubscription {
  endpoint: string
  expirationTime?: number | null
  keys?: {
    p256dh?: string
    auth?: string
  }
  deviceId?: string
  userAgent?: string
}

// -----------------------------
// User payload shapes (Human/Machine)
// -----------------------------

export interface ZitadelHumanUser {
  profile?: {
    firstName?: string
    lastName?: string
    displayName?: string
    preferredLanguage?: string
  }
  email?: {
    email?: string
  }
  phone?: Record<string, any>
}

/**
 * Zitadel machine user shape differs between endpoints/versions.
 * Keep it permissive but still explicitly modeled.
 */
export interface ZitadelMachineUser {
  name?: string
  description?: string
  [key: string]: any
}

/**
 * Some endpoints nest a user payload under `user`.
 * Keep this for compatibility, but your adapter normalizes to the top-level `ZitadelUser`.
 */
export interface ZitadelUserInner {
  id?: string

  // Some endpoints use `type`, others `userType`.
  type?: ZitadelUserType | string
  userType?: ZitadelUserType | string

  details?: ZitadelUserDetails

  state?: string
  userName?: string
  loginNames?: string[]
  preferredLoginName?: string

  avatarUrl?: string
  human?: ZitadelHumanUser
  machine?: ZitadelMachineUser

  // v2 list/search may expose these variants
  userId?: string
  user_id?: string
}

/**
 * Canonical user shape used throughout your app.
 * IMPORTANT: `id` and `type` are always present (adapter guarantees this).
 */
export interface ZitadelUser {
  id: string
  type: ZitadelUserType

  details?: ZitadelUserDetails

  state?: string
  userName?: string
  loginNames?: string[]
  preferredLoginName?: string

  avatarUrl?: string
  human?: ZitadelHumanUser
  machine?: ZitadelMachineUser

  // Defensive nesting: some endpoints return { user: { ... } }
  user?: ZitadelUserInner
}

// -----------------------------
// User create/update inputs
// -----------------------------

export interface ZitadelUserCreateResponse {
  userId: string
  details: {
    sequence: string
    creationDate: string
    resourceOwner: string
  }
}

export type ZitadelUserUpdateInput = {
  username?: string
  profile?: {
    givenName?: string
    familyName?: string
    displayName?: string
    preferredLanguage?: string
  }
  email?: {
    email: string
  }
  phone?: {
    phone: string
  }
  password?: {
    password: string
    changeRequired?: boolean
  }
}

// -----------------------------
// Authorization inputs
// -----------------------------

export type ZitadelAuthorizationCreateInput = {
  userId: string
  projectId?: string
  projectGrantId?: string
  roleKeys: string[]
}

export type ZitadelAuthorizationUpdateInput = {
  authorizationId: string
  roleKeys: string[]
}

// -----------------------------
// Type aliases for convenience (backward compatibility)
// -----------------------------

export type UserPushSubscription = ZitadelUserPushSubscription
export type UserRoute = ZitadelUserRoute
