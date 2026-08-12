// src/user/profile/index.ts

import {InvalidInputError} from '../../errors/general.errors'
import {UserServices} from '..'
import {ProfileConnection} from './Profile'

function resolveProfileTypename(obj: any): 'Driver' | 'Customer' | null {
  const t = String(obj?.type ?? obj?.kind ?? '').toLowerCase()
  if (t === 'driver') return 'Driver'
  if (t === 'customer') return 'Customer'

  const id = String(obj?.id ?? '')
  if (id.startsWith('driver:')) return 'Driver'
  if (id.startsWith('customer:')) return 'Customer'

  return null
}

/**
 * Optional query facade. (You asked to move profile index here.)
 * Returns profiles for a given user.
 */
export class ProfileServices {
  static async profiles(args: {
    userId: string
    first?: number
    after?: string
    last?: number
    before?: string
    organizationId?: string
  }): Promise<ProfileConnection> {
    if (!args?.userId) throw new InvalidInputError('userId required')

    const user = await UserServices.user({id: args.userId, organizationId: args.organizationId})
    if ((user as any)?.__typename !== 'Human' || typeof (user as any)?.profiles !== 'function') {
      // Machines have no profiles
      return new ProfileConnection({
        edges: [],
        pageInfo: {hasNextPage: false, hasPreviousPage: false} as any,
        totalCount: 0
      })
    }

    return (user as any).profiles({
      first: args.first,
      after: args.after,
      last: args.last,
      before: args.before
    })
  }
}
