// src/user/data/Data.ts
import {PageInfo} from '../../relay/PageInfo'
import type {UserDataNode} from '../types'

export class UserDataEdge {
  cursor: string
  node: UserDataNode

  constructor(args: {cursor: string; node: UserDataNode}) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

export class UserDataConnection {
  edges: UserDataEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: {edges: UserDataEdge[]; pageInfo: PageInfo; totalCount: number}) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
