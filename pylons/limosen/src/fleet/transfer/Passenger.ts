// src/fleet/transfer/Passenger.ts
import type { ID } from '@getcronit/pylon'
import { PageInfo } from '../../relay/PageInfo'
import { prisma } from '../../db/prisma'
import type { Passenger as PrismaPassenger } from '@prisma/client'

interface PrismaPassengerNode extends PrismaPassenger {}

/**
 * Passenger domain model (DB-backed).
 * - Constructor parameter-properties define public fields
 * - Optimized for: Object.assign(new Passenger(), r)
 * - No __typename
 */
export class Passenger implements PrismaPassengerNode {
  constructor(
    public id: ID = '' as any,

    // Prisma fields
    public transferId: PrismaPassenger['transferId'] = '',

    public firstName: PrismaPassenger['firstName'] = null,
    public lastName: PrismaPassenger['lastName'] = null,
    public email: PrismaPassenger['email'] = null,
    public phone: PrismaPassenger['phone'] = null,
    public language: PrismaPassenger['language'] = null
  ) {}

  static clampFirst(n: unknown, fallback = 25) {
    const x = typeof n === 'number' ? n : Number(n)
    const v = Number.isFinite(x) ? x : fallback
    return Math.max(1, Math.min(100, Math.floor(v)))
  }

  /**
   * Relay connection list for passengers.
   * Pagination is keyset-based by id (DESC).
   * Cursor is Passenger.id.
   */
  static async listConnection(args?: {
    transferId?: string
    first?: number
    after?: string | null
    take?: number
    skip?: number
  }): Promise<PassengerConnection> {
    const baseWhere: any = args?.transferId ? { transferId: String(args.transferId) } : {}

    const first = Passenger.clampFirst(args?.first ?? args?.take ?? 25)
    const after = args?.after ? String(args.after) : null
    const skip = typeof args?.skip === 'number' && args.skip > 0 ? Math.floor(args.skip) : 0

    const where =
      after
        ? {
            AND: [
              baseWhere,
              // DESC pagination: next page are ids < after
              { id: { lt: after } }
            ]
          }
        : baseWhere

    const rows = await prisma().passenger.findMany({
      where,
      orderBy: [{ id: 'desc' }],
      take: first + 1,
      ...(after ? {} : skip ? { skip } : {})
    })

    const hasNextPage = rows.length > first
    const slice = rows.slice(0, first)

    const edges = slice.map((r: any) => {
      const node = Object.assign(new Passenger(), r)
      return new PassengerEdge({ cursor: String(node.id), node })
    })

    const totalCount = await prisma().passenger.count({ where: baseWhere })

    const startCursor = edges[0]?.cursor
    const endCursor = edges.length ? edges[edges.length - 1].cursor : undefined

    return new PassengerConnection({
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
 * Holds a passenger node together with the cursor used for pagination.
 */
export class PassengerEdge {
  cursor: string
  node: Passenger

  constructor(args: { cursor: string; node: Passenger }) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

/**
 * Wraps a list of passenger edges plus pagination state in Relay connection format.
 */
export class PassengerConnection {
  edges: PassengerEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: { edges: PassengerEdge[]; pageInfo: PageInfo; totalCount: number }) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
