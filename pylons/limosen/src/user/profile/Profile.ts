// src/user/profile/Profile.ts
import { ID } from '@getcronit/pylon'
import {PageInfo} from '../../relay/PageInfo'
import type {UserNode, UserProfileNode} from '../types'

export class UserProfile implements UserProfileNode{
  public id: ID

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
    this.id = user.id
  }
}

export class ProfileEdge {
  cursor: string
  node: UserProfileNode

  constructor(args: {cursor: string; node: UserProfileNode}) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

export class ProfileConnection {
  edges: ProfileEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: {edges: ProfileEdge[]; pageInfo: PageInfo; totalCount: number}) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
