// src/user/HumanUser.ts
import type { ID } from '@getcronit/pylon'
import type { ZitadelProjectRole, ZitadelUserGrant } from '../oidc/types'
import { getUserGrants, flattenRolesFromGrants } from '../oidc/zitadel'
import { encodeCursor, paginateWindow } from '../relay/relay'
import { PageInfo } from '../relay/PageInfo'
import { Grant, GrantConnection, GrantEdge } from './Grant'
import { Role, RoleConnection, RoleEdge } from './Role'
import type { UserNode, UserState, UserDataNode, UserProfileNode } from './types'

import { ProfileConnection, ProfileEdge, UserProfile } from './profile/Profile'
import { DriverProfile } from './profile/DriverProfile'
import { CustomerProfile } from './profile/CustomerProfile'

import { UserDataConnection, UserDataEdge } from './data/Data'
import { DriverData } from './data/DriverData'
import { CustomerData } from './data/CustomerData'
import { prisma } from '../db/prisma'
import { getUserPushSubscriptions, setUserPushSubscriptions } from '../oidc/zitadel'
import type { UserPushSubscription } from '../oidc/types'

export type Preferences = {
  preferredLanguage?: string
}

/**
 * Represents a human user coming from Zitadel.
 * The instance holds normalized base fields and resolves related collections lazily.
 */
export class HumanUser implements UserNode {
  private _grantsP?: Promise<ZitadelUserGrant[]>
  private _rolesP?: Promise<ZitadelProjectRole[]>

  private _prefetchedProfiles: any

  constructor(
    public id: ID,
    public state: UserState,
    public userName: string,
    public loginNames: string[],
    public preferredLoginName: string,
    public resourceOwner: string,
    public changeDate: string,
    public creationDate: string,
    public sequence: string,
    public preferences: Preferences,
    profiles: ProfileConnection
  ) {
    this._prefetchedProfiles = profiles
  }

  private async _getGrants(): Promise<ZitadelUserGrant[]> {
    if (!this._grantsP) {
      this._grantsP = getUserGrants(String(this.id), this.resourceOwner).catch((e) => {
        console.error('Failed to fetch grants for user', this.id, e)
        return []
      })
    }
    return this._grantsP
  }

  private async _getRoles(): Promise<ZitadelProjectRole[]> {
    if (!this._rolesP) {
      this._rolesP = this._getGrants()
        .then((gs) => flattenRolesFromGrants(gs))
        .catch((e) => {
          console.error('Failed to derive roles for user', this.id, e)
          return []
        })
    }
    return this._rolesP
  }

  /**
   * User "profiles" as Relay connection.
   * Chooses DriverProfile vs CustomerProfile based on role `limosen:driver` / `limosen:customer`.
   */
  async profiles(args?: {
    first?: number
    after?: string
    last?: number
    before?: string
  }): Promise<ProfileConnection> {
    const p: any = this._prefetchedProfiles

    const roles = await this._getRoles()
    const roleKeys = roles.map((r: any) => String(r?.key ?? r?.roleKey ?? ''))

    const edges = (p?.edges ?? []).map((e: ProfileEdge) => {
      const n = e?.node as UserProfileNode
      let node: UserProfileNode

      if (roleKeys.includes('limosen:driver')) {
        node = new DriverProfile(
          this,
          n?.avatarUrl ?? undefined,
          n?.preferredLanguage ?? undefined,
          n?.displayName ?? undefined,
          n?.email ?? undefined,
          n?.phone ?? undefined,
          n?.firstName ?? undefined,
          n?.lastName ?? undefined
        )
      } else if (roleKeys.includes('limosen:customer')) {
        node = new CustomerProfile(
          this,
          n?.avatarUrl ?? undefined,
          n?.preferredLanguage ?? undefined,
          n?.displayName ?? undefined,
          n?.email ?? undefined,
          n?.phone ?? undefined,
          n?.firstName ?? undefined,
          n?.lastName ?? undefined
        )
      } else {
        node = new UserProfile(
          this,
          n?.avatarUrl ?? undefined,
          n?.preferredLanguage ?? undefined,
          n?.displayName ?? undefined,
          n?.email ?? undefined,
          n?.phone ?? undefined,
          n?.firstName ?? undefined,
          n?.lastName ?? undefined
        )
      }

      return new ProfileEdge({
        cursor: String(e?.cursor ?? ''),
        node
      })
    })

    const pageInfo = new PageInfo({
      hasNextPage: !!p?.pageInfo?.hasNextPage,
      hasPreviousPage: !!p?.pageInfo?.hasPreviousPage,
      startCursor: p?.pageInfo?.startCursor == null ? undefined : String(p.pageInfo.startCursor),
      endCursor: p?.pageInfo?.endCursor == null ? undefined : String(p.pageInfo.endCursor)
    })

    const totalCount = Number.isFinite(Number(p?.totalCount)) ? Number(p.totalCount) : edges.length

    return new ProfileConnection({ edges, pageInfo, totalCount })
  }

  /**
   * User "data" as Relay connection.
   *
   * Key fix: return concrete class instances (DriverData/CustomerData),
   * hydrated from Prisma rows via Object.assign(new X(), row).
   */
  async data(args?: {
    first?: number
    after?: string
    last?: number
    before?: string
  }): Promise<UserDataConnection> {
    const roles = await this._getRoles()
    const roleKeys = roles.map((r: any) => String(r?.key ?? r?.roleKey ?? ''))

    const userId = String(this.id ?? '')
    const items: UserDataNode[] = []

    if (roleKeys.includes('limosen:driver')) {
      const row = await prisma().driverData.findUnique({ where: { userId } })
      if (row) items.push(Object.assign(new DriverData(), row) as any)
      else items.push(Object.assign(new DriverData(), { userId }) as any)
    }

    if (roleKeys.includes('limosen:customer')) {
      const row = await prisma().customerData.findUnique({ where: { userId } })
      if (row) items.push(Object.assign(new CustomerData(), row) as any)
      else items.push(Object.assign(new CustomerData(), { userId }) as any)
    }

    const { start, end, hasNextPage, hasPreviousPage } = paginateWindow({
      totalCount: items.length,
      first: args?.first ?? null,
      after: args?.after ?? null,
      last: args?.last ?? null,
      before: args?.before ?? null
    })

    const sliced = items.slice(start, end)
    const edges = sliced.map((n, i) => new UserDataEdge({ node: n, cursor: encodeCursor(start + i) }))

    const pageInfo = new PageInfo({
      hasNextPage,
      hasPreviousPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges.length ? edges[edges.length - 1].cursor : undefined
    })

    return new UserDataConnection({ edges, pageInfo, totalCount: items.length })
  }

  async grants(args?: {
    first?: number
    after?: string
    last?: number
    before?: string
  }): Promise<GrantConnection> {
    const gs = await this._getGrants()
    const items = gs.map((g) => new Grant(g))

    const { start, end, hasNextPage, hasPreviousPage } = paginateWindow({
      totalCount: items.length,
      first: args?.first ?? null,
      after: args?.after ?? null,
      last: args?.last ?? null,
      before: args?.before ?? null
    })

    const sliced = items.slice(start, end)
    const edges = sliced.map((n, i) => new GrantEdge({ node: n, cursor: encodeCursor(start + i) }))

    const pageInfo = new PageInfo({
      hasNextPage,
      hasPreviousPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges.length ? edges[edges.length - 1].cursor : undefined
    })

    return new GrantConnection({ edges, pageInfo, totalCount: items.length })
  }

  async roles(args?: {
    first?: number
    after?: string
    last?: number
    before?: string
  }): Promise<RoleConnection> {
    const rs = await this._getRoles()
    const items = rs.map((r) => new Role({ key: (r as any).key, displayName: (r as any).displayName }))

    const { start, end, hasNextPage, hasPreviousPage } = paginateWindow({
      totalCount: items.length,
      first: args?.first ?? null,
      after: args?.after ?? null,
      last: args?.last ?? null,
      before: args?.before ?? null
    })

    const sliced = items.slice(start, end)
    const edges = sliced.map((n, i) => new RoleEdge({ node: n, cursor: encodeCursor(start + i) }))

    const pageInfo = new PageInfo({
      hasNextPage,
      hasPreviousPage,
      startCursor: edges[0]?.cursor,
      endCursor: edges.length ? edges[edges.length - 1].cursor : undefined
    })

    return new RoleConnection({ edges, pageInfo, totalCount: items.length })
  }

  // --------------------------------------------------
  // Push notification subscriptions management
  // --------------------------------------------------

  /**
   * Get push subscriptions for this user (stored in user metadata).
   * Returns null if no subscriptions are set.
   */
  async getPushSubscriptions(): Promise<UserPushSubscription[] | null> {
    const userId = String(this.id ?? '')
    return getUserPushSubscriptions(userId, this.resourceOwner)
  }

  /**
   * Set push subscriptions for this user (overwrites existing).
   */
  async setPushSubscriptions(
    subscriptions: UserPushSubscription[]
  ): Promise<void> {
    const userId = String(this.id ?? '')
    await setUserPushSubscriptions(userId, subscriptions, this.resourceOwner)
  }

  /**
   * Add or update a push subscription for this user.
   * Deduplicates by endpoint (removes any existing subscription with the same endpoint first).
   */
  async addPushSubscription(
    subscription: UserPushSubscription
  ): Promise<UserPushSubscription[]> {
    const existing = (await this.getPushSubscriptions()) ?? []

    // Remove any previous subscription with the same endpoint
    const filtered = existing.filter(
      (s) => s && s.endpoint !== subscription.endpoint
    )

    const updated = [...filtered, subscription]
    await this.setPushSubscriptions(updated)

    return updated
  }

  /**
   * Remove a push subscription by endpoint.
   */
  async removePushSubscription(endpoint: string): Promise<UserPushSubscription[]> {
    const existing = (await this.getPushSubscriptions()) ?? []

    const updated = existing.filter((s) => s && s.endpoint !== endpoint)
    await this.setPushSubscriptions(updated)

    return updated
  }

  /**
   * Clear all push subscriptions for this user.
   */
  async clearPushSubscriptions(): Promise<void> {
    await this.setPushSubscriptions([])
  }
}
