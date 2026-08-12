// src/user/profile/CustomerProfile.ts
import type { ID } from '@getcronit/pylon'
import { PageInfo } from '../../relay/PageInfo'
import type { UserNode, UserProfileNode } from '../types'

/**
 * Represents a customer user coming from Zitadel.
 * The instance type is what makes `... on CustomerProfile` resolve correctly.
 */
export class CustomerProfile implements UserProfileNode {
  public id: ID
  public address: string = "Löwengasse 14"

  constructor(
    public user: UserNode,
    
    public avatarUrl?: string,
    public preferredLanguage?: string,
    public displayName?: string,
    public email?: string,
    public phone?: string,
    public firstName?: string,
    public lastName?: string
  ) {
    this.id = (`profile:customer:${String(user.id)}` as ID)
  }
}

/**
 * Holds a customer node together with the cursor used for pagination.
 * This shape is recognized by Relay tooling and schema visualizers.
 */
export class CustomerProfileEdge {
  cursor: string
  node: CustomerProfile

  constructor(args: { cursor: string; node: CustomerProfile }) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

/**
 * Wraps a list of customer edges plus pagination state in Relay connection format.
 * Keeping field names stable helps GraphQL Voyager detect Relay connections.
 */
export class CustomerProfileConnection {
  edges: CustomerProfileEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: { edges: CustomerProfileEdge[]; pageInfo: PageInfo; totalCount: number }) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
