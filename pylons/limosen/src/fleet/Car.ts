// src/fleet/Car.ts
import { getContext, getEnv, type ID } from '@getcronit/pylon'
import { PageInfo } from '../relay/PageInfo'
import type { UserNode } from '../user/types'
import { toUserModel } from '../user'
import { resolve } from '../clients/iam'

import { prisma } from '../db/prisma'
import type { Car as PrismaCar } from '@prisma/client'

interface PrismaCarNode extends PrismaCar {}

/**
 * Car domain model (DB-backed).
 * - Constructor parameter-properties define public fields
 * - Optimized for: Object.assign(new Car(), r)
 * - No __typename
 */
export class Car implements PrismaCarNode {
  constructor(
    public id: ID = '' as any,

    // Prisma fields
    public licensePlate: PrismaCar['licensePlate'] = '',
    public color: PrismaCar['color'] = '#000000',

    public carClass: PrismaCar['carClass'] = null,
    public carName: PrismaCar['carName'] = null,

    public driverId: PrismaCar['driverId'] = null,

    public createdAt: PrismaCar['createdAt'] = new Date(),
    public updatedAt: PrismaCar['updatedAt'] = new Date(),

    // Non-prisma convenience fields (optional)
    public driverName: string | null = null
  ) {}

  /**
   * Resolves the driver user (if driverId is set).
   */
  async driver(): Promise<UserNode | null> {
    const context = getContext()
    const authorizationHeader = context.req.header('Authorization') ?? undefined
    const env: any = getEnv()

    const userId: string | null = this.driverId
    if (!userId) return null

    return resolve(
      ({ query }) => {
        const u = query.user({ args: { id: userId } })
        return toUserModel(u)
      },
      {
        extensions: { env, authToken: authorizationHeader },
        cachePolicy: 'no-store'
      }
    )
  }

  static clampFirst(n: unknown, fallback = 25) {
    const x = typeof n === 'number' ? n : Number(n)
    const v = Number.isFinite(x) ? x : fallback
    return Math.max(1, Math.min(100, Math.floor(v)))
  }

  static makeCursor(updatedAt: Date, id: string) {
    return `${updatedAt.toISOString()}|${id}`
  }

  static parseCursor(cursor: string): { updatedAt: Date; id: string } {
    const [iso, id] = String(cursor ?? '').split('|')
    const dt = new Date(iso)
    if (!iso || !id || Number.isNaN(dt.getTime())) throw new Error('Invalid cursor')
    return { updatedAt: dt, id }
  }

  /**
   * Relay connection list for cars.
   * Pagination is keyset-based by (updatedAt DESC, id DESC).
   * Cursor is `${updatedAtISO}|${id}`.
   */
  static async listConnection(args?: {
    driverId?: string
    first?: number
    after?: string | null
    take?: number
    skip?: number
  }): Promise<CarConnection> {
    const baseWhere: any = args?.driverId ? { driverId: String(args.driverId) } : {}

    const first = Car.clampFirst(args?.first ?? args?.take ?? 25)
    const after = args?.after ? String(args.after) : null
    const skip = typeof args?.skip === 'number' && args.skip > 0 ? Math.floor(args.skip) : 0

    let where: any = baseWhere

    if (after) {
      // keyset: (updatedAt < a) OR (updatedAt = a AND id < afterId)
      const { updatedAt: aDt, id: aId } = Car.parseCursor(after)
      where = {
        AND: [
          baseWhere,
          {
            OR: [
              { updatedAt: { lt: aDt } },
              { AND: [{ updatedAt: aDt }, { id: { lt: aId } }] }
            ]
          }
        ]
      }
    }

    const rows = await prisma().car.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      take: first + 1,
      ...(after ? {} : skip ? { skip } : {})
    })

    const hasNextPage = rows.length > first
    const slice = rows.slice(0, first)

    const edges = slice.map((r: any) => {
      const node = Object.assign(new Car(), r)
      const cursor = Car.makeCursor(new Date(node.updatedAt), String(node.id))
      return new CarEdge({ cursor, node })
    })

    const totalCount = await prisma().car.count({ where: baseWhere })

    const startCursor = edges[0]?.cursor
    const endCursor = edges.length ? edges[edges.length - 1].cursor : undefined

    return new CarConnection({
      edges,
      pageInfo: new PageInfo({
        hasNextPage,
        hasPreviousPage: Boolean(after) || skip > 0,
        startCursor,
        endCursor
      }),
      totalCount
    })
  }
}

/**
 * Holds a car node together with the cursor used for pagination.
 */
export class CarEdge {
  cursor: string
  node: Car

  constructor(args: { cursor: string; node: Car }) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

/**
 * Wraps a list of car edges plus pagination state in Relay connection format.
 */
export class CarConnection {
  edges: CarEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: { edges: CarEdge[]; pageInfo: PageInfo; totalCount: number }) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
