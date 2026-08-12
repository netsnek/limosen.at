// src/user/MachineUser.ts
import type { ID } from '@getcronit/pylon'
import type { ZitadelProjectRole, ZitadelUserGrant } from '../oidc/types'
import { getUserGrants, flattenRolesFromGrants } from '../oidc/zitadel'
import { encodeCursor, paginateWindow } from '../relay/relay'
import { PageInfo } from '../relay/PageInfo'
import { Grant, GrantConnection, GrantEdge } from './Grant'
import { Role, RoleConnection, RoleEdge } from './Role'
import type { UserNode, UserState, UserDataNode } from './types'
import { UserDataConnection, UserDataEdge } from './data/Data'

/**
 * Represents a machine user coming from Zitadel.
 * The instance type is what makes `... on MachineUser` resolve correctly.
 */
export class MachineUser implements UserNode {
  private _grantsP?: Promise<ZitadelUserGrant[]>
  private _rolesP?: Promise<ZitadelProjectRole[]>

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
  ) { }

  private async _getGrants(): Promise<ZitadelUserGrant[]> {
    if (!this._grantsP) {
      this._grantsP = getUserGrants(String(this.id), this.resourceOwner).catch((e) => {
        console.error('Failed to fetch grants for machine user', this.id, e)
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
          console.error('Failed to derive roles for machine user', this.id, e)
          return []
        })
    }
    return this._rolesP
  }

  /**
  * Resolves the user’s data as a Relay connection.
  */
  async data(args?: { first?: number; after?: string; last?: number; before?: string }): Promise<UserDataConnection> {

    const items: UserDataNode[] = []

    items.push({
      id: `data:${this.id}`
    })

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

  /**
   * Resolves grants as a Relay connection.
   * The underlying Zitadel request is cached per request.
   */
  async grants(args?: { first?: number; after?: string; last?: number; before?: string }): Promise<GrantConnection> {
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

  /**
   * Resolves roles as a Relay connection.
   * Roles are derived from cached grants to avoid extra HTTP.
   */
  async roles(args?: { first?: number; after?: string; last?: number; before?: string }): Promise<RoleConnection> {
    const rs = await this._getRoles()
    const items = rs.map((r) => new Role({ key: r.key, displayName: r.displayName }))

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
}

/**
 * Holds a machine node together with the cursor used for pagination.
 * This shape is recognized by Relay tooling and schema visualizers.
 */
export class MachineUserEdge {
  cursor: string
  node: MachineUser

  constructor(args: { cursor: string; node: MachineUser }) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

/**
 * Wraps a list of machine edges plus pagination state in Relay connection format.
 * Keeping field names stable helps GraphQL Voyager detect Relay connections.
 */
export class MachineUserConnection {
  edges: MachineUserEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: { edges: MachineUserEdge[]; pageInfo: PageInfo; totalCount: number }) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
