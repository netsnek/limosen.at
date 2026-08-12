// src/user/Role.ts
import type {ID} from '@getcronit/pylon'
import type {RoleNode} from './types'
import {PageInfo} from '../relay/PageInfo'

/**
 * Represents a single project role derived from Zitadel grants.
 * The id is deterministic so the object can behave like a Relay node.
 */
export class Role implements RoleNode {
  id: ID
  key: string
  displayName?: string

  constructor(args: {key: string; displayName?: string}) {
    this.key = args.key
    this.displayName = args.displayName
    this.id = (`role:${String(args.key)}` as any) as ID
  }
}

/**
 * Holds a role node together with a pagination cursor.
 * This is the canonical Relay Edge shape for RoleConnection.
 */
export class RoleEdge {
  cursor: string
  node: Role

  constructor(args: {cursor: string; node: Role}) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

/**
 * Wraps role edges plus pagination state.
 * Keeping exact field names enables Relay/Voyager auto-detection.
 */
export class RoleConnection {
  edges: RoleEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: {edges: RoleEdge[]; pageInfo: PageInfo; totalCount: number}) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
