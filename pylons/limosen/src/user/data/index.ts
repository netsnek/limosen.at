// src/user/data/index.ts

import {InvalidInputError} from '../../errors/general.errors'
import {UserServices} from '..'
import {UserDataConnection} from './Data'

/**
 * Optional query facade.
 * Returns user data nodes for a given user.
 */
export class UserDataService {
  static async data(args: {
    userId: string
    first?: number
    after?: string
    last?: number
    before?: string
    organizationId?: string
  }): Promise<UserDataConnection> {
    if (!args?.userId) throw new InvalidInputError('userId required')

    const user = await UserServices.user({
      id: args.userId,
      organizationId: args.organizationId
    })

    // Machines / unknown nodes have no user-data resolver
    if (!user || typeof (user as any)?.data !== 'function') {
      return new UserDataConnection({
        edges: [],
        pageInfo: {hasNextPage: false, hasPreviousPage: false} as any,
        totalCount: 0
      })
    }

    return (user as any).data({
      first: args.first,
      after: args.after,
      last: args.last,
      before: args.before
    })
  }
}
