// src/user/profile/DriverProfile.ts
import type { ID } from '@getcronit/pylon'
import { PageInfo } from '../../relay/PageInfo'
import type { UserNode, UserProfileNode } from '../types'

/**
 * Represents a driver user coming from Zitadel.
 * The instance type is what makes `... on DriverProfile` resolve correctly.
 */
export class DriverProfile implements UserProfileNode {
  public id: ID
  public car?: string

  constructor(
    public user: UserNode,
    
    public avatarUrl?: string,
    public preferredLanguage?: string,
    public displayName?: string,
    public email?: string,
    public phone?: string,
    public firstName?: string,
    public lastName?: string,
  ) {
    this.id = (`profile:driver:${String(user.id)}` as ID)
    this.car = "Mercedes-Benz" // Placeholder value
  }
}

/**
 * Holds a driver node together with the cursor used for pagination.
 * This shape is recognized by Relay tooling and schema visualizers.
 */
export class DriverProfileEdge {
  cursor: string
  node: DriverProfile

  constructor(args: { cursor: string; node: DriverProfile }) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

/**
 * Wraps a list of driver edges plus pagination state in Relay connection format.
 * Keeping field names stable helps GraphQL Voyager detect Relay connections.
 */
export class DriverProfileConnection {
  edges: DriverProfileEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: { edges: DriverProfileEdge[]; pageInfo: PageInfo; totalCount: number }) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
