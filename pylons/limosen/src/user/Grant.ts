// src/user/Grant.ts
import type {ID} from '@getcronit/pylon'
import type {ZitadelUserGrant} from '../oidc/types'
import type {GrantNode} from './types'
import {PageInfo} from '../relay/PageInfo'

/**
 * Represents one grant assignment returned by Zitadel.
 * The id is synthesized from stable fields so this can be used like a Relay node.
 */
export class Grant implements GrantNode {
  id: ID

  organizationId?: string
  creationDate?: string
  changeDate?: string
  projectId?: string
  projectName?: string
  state?: string

  constructor(g: ZitadelUserGrant) {
    this.organizationId = g.organizationId
    this.creationDate = g.creationDate
    this.changeDate = g.changeDate
    this.projectId = g.projectId
    this.projectName = g.projectName
    this.state = g.state

    const oid = String(g.organizationId ?? '')
    const pid = String(g.projectId ?? '')
    const name = String(g.projectName ?? '')
    this.id = (`grant:${oid}:${pid}:${name}` as any) as ID
  }
}

/**
 * Holds a grant node together with a pagination cursor.
 * This is the canonical Relay Edge shape for GrantConnection.
 */
export class GrantEdge {
  cursor: string
  node: Grant

  constructor(args: {cursor: string; node: Grant}) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

/**
 * Wraps grant edges plus pagination state.
 * Having edges + pageInfo makes schema tools detect this as Relay connection.
 */
export class GrantConnection {
  edges: GrantEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: {edges: GrantEdge[]; pageInfo: PageInfo; totalCount: number}) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
