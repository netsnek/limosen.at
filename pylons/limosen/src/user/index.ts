// src/user/index.ts
import {getContext, getEnv} from '@getcronit/pylon'
import {resolve} from '../clients/iam/index'
import {QueryTypes, convertParamsToArgs} from '../clients/iam/schema.generated'

import type {UserNode} from './types'
import {HumanUser} from './HumanUser'
import type {Preferences} from './HumanUser'
import {MachineUser} from './MachineUser'

import {UserConnection, UserEdge} from './User'
import {PageInfo} from '../relay/PageInfo'
import type {ProfileConnection} from './profile/Profile'

function prefetchProfileConnection(p: any): ProfileConnection {
  // Touch fields so GQty actually fetches them (esp. node.id)
  void p?.totalCount
  void p?.pageInfo?.hasNextPage
  void p?.pageInfo?.hasPreviousPage
  void p?.pageInfo?.startCursor
  void p?.pageInfo?.endCursor

  const edges = p?.edges ?? []
  for (const e of edges) {
    void e?.cursor
    const n = e?.node
    void n?.__typename
    void n?.id
    void n?.avatarUrl
    void n?.preferredLanguage
    void n?.displayName
    void n?.email
    void n?.phone
    void n?.firstName
    void n?.lastName
  }

  return p as any
}

export function toUserModel(u: QueryTypes['user']['return'], opts?: { skipProfiles?: boolean }): UserNode {
  const human = u.$on?.HumanUser

  if (human) {
    const rawPrefs = human?.preferences
    const prefs = {
      preferredLanguage: rawPrefs?.preferredLanguage ?? undefined
    } as Preferences

    // Skip profile prefetch for bulk list queries to avoid N+1 CPU timeouts
    let profiles: ProfileConnection
    if (opts?.skipProfiles) {
      profiles = { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false }, totalCount: 0 } as any
    } else {
      // IMPORTANT: prefetch node.id + other profile fields inside resolve()
      profiles = prefetchProfileConnection(human.profiles())
    }

    return new HumanUser(
      u.id,
      u.state,
      u.userName,
      u.loginNames,
      u.preferredLoginName,
      u.resourceOwner,
      u.changeDate,
      u.creationDate,
      u.sequence,
      prefs,
      profiles
    )
  }

  return new MachineUser(
    u.id,
    u.state,
    u.userName,
    u.loginNames,
    u.preferredLoginName,
    u.resourceOwner,
    u.changeDate,
    u.creationDate,
    u.sequence
  )
}

function toUserConnectionModel(p: QueryTypes['users']['return'], opts?: { skipProfiles?: boolean }): UserConnection {
  const edges = (p.edges ?? []).map(
    (e: any) => new UserEdge({cursor: String(e.cursor), node: toUserModel(e.node, { skipProfiles: opts?.skipProfiles })})
  )

  const pageInfo = new PageInfo({
    hasNextPage: !!p.pageInfo?.hasNextPage,
    hasPreviousPage: !!p.pageInfo?.hasPreviousPage,
    startCursor: p.pageInfo?.startCursor == null ? undefined : String(p.pageInfo.startCursor),
    endCursor: p.pageInfo?.endCursor == null ? undefined : String(p.pageInfo.endCursor)
  })

  const totalCount = Number.isFinite(Number(p.totalCount)) ? Number(p.totalCount) : edges.length

  return new UserConnection({edges, pageInfo, totalCount})
}

export class UserServices {
  static async user(...params: QueryTypes['user']['params']): Promise<UserNode> {
    const context = getContext()
    const authorizationHeader = context.req.header('Authorization') ?? undefined
    const env: any = getEnv()
    const args = convertParamsToArgs.Query.user(params)

    const user = await resolve(
      ({query}) => {
        const u = query.user(args)
        return toUserModel(u)
      },
      {
        extensions: {env, authToken: authorizationHeader},
        cachePolicy: 'no-store'
      }
    )

    return user
  }

  static async users(...params: QueryTypes['users']['params']): Promise<UserConnection> {
    const context = getContext()
    const authorizationHeader = context.req.header('Authorization') ?? undefined
    const env: any = getEnv()
    const args = convertParamsToArgs.Query.users(params)

    const connection = await resolve(
      ({query}) => {
        const c: any = query.users(args)
        return toUserConnectionModel(c, { skipProfiles: true })
      },
      {
        extensions: {env, authToken: authorizationHeader},
        cachePolicy: 'no-store'
      }
    )

    return connection
  }

  static async usersByRole(...params: QueryTypes['usersByRole']['params']): Promise<UserConnection> {
    const context = getContext()
    const authorizationHeader = context.req.header('Authorization') ?? undefined
    const env: any = getEnv()
    const args = convertParamsToArgs.Query.usersByRole(params)

    const connection = await resolve(
      ({query}) => {
        const c: any = query.usersByRole(args)
        return toUserConnectionModel(c, { skipProfiles: true })
      },
      {
        extensions: {env, authToken: authorizationHeader},
        cachePolicy: 'no-store'
      }
    )

    return connection
  }

  static async currentUser(...params: QueryTypes['currentUser']['params']): Promise<UserNode> {
    const context = getContext()
    const authorizationHeader = context.req.header('Authorization') ?? undefined
    const env: any = getEnv()
    const args = convertParamsToArgs.Query.currentUser(params)

    const user = await resolve(
      ({query}) => {
        const u = query.currentUser(args)
        return toUserModel(u)
      },
      {
        extensions: {env, authToken: authorizationHeader},
        cachePolicy: 'no-store'
      }
    )

    return user
  }

  static async isUnique(...params: QueryTypes['isUnique']['params']): Promise<QueryTypes['isUnique']['return']> {
    const context = getContext()
    const authorizationHeader = context.req.header('Authorization') ?? undefined
    const env: any = getEnv()
    const args = convertParamsToArgs.Query.isUnique(params)

    return resolve(({query}) => query.isUnique(args), {
      extensions: {env, authToken: authorizationHeader},
      cachePolicy: 'no-store'
    })
  }
}
