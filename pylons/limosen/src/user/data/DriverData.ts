// src/user/data/DriverData.ts
import { getContext, getEnv, type ID } from '@getcronit/pylon'
import { PageInfo } from '../../relay/PageInfo'
import type { UserDataNode, UserNode } from '../types'
import { toUserModel } from '..'
import { resolve } from '../../clients/iam'

import { prisma } from '../../db/prisma'
import { Car, CarConnection, CarEdge } from '../../fleet/Car'
import { Transfer, TransferConnection, TransferEdge } from '../../fleet/transfer/Transfer'

import type { DriverData as PrismaDriverData } from '@prisma/client'

interface PrismaDriverDataNode extends PrismaDriverData {}

export class DriverData implements UserDataNode {
  constructor(
    public id: ID = '' as any,

    // Prisma fields
    public userId: PrismaDriverData['userId'] = '',
    public color: PrismaDriverData['color'] = '#C0C0C0',
    public payoutPercent: PrismaDriverData['payoutPercent'] = 0,

    public createdAt: PrismaDriverData['createdAt'] = new Date(),
    public updatedAt: PrismaDriverData['updatedAt'] = new Date()
  ) {}

  static async ensure(userId: string, defaults?: { color?: string; payoutPercent?: number }): Promise<DriverData> {
    const uid = String(userId ?? '').trim()
    if (!uid) throw new Error('DriverData.ensure: userId required')

    const row = await prisma().driverData.upsert({
      where: { userId: uid },
      update: {},
      create: {
        userId: uid,
        color: defaults?.color ?? '#C0C0C0',
        payoutPercent: typeof defaults?.payoutPercent === 'number' ? defaults.payoutPercent : 0
      }
    })

    return Object.assign(new DriverData(), row)
  }

  static async getByUserId(userId: string): Promise<DriverData | null> {
    const uid = String(userId ?? '').trim()
    if (!uid) return null

    const row = await prisma().driverData.findUnique({ where: { userId: uid } })
    return row ? Object.assign(new DriverData(), row) : null
  }

  async user(): Promise<UserNode | null> {
    const context = getContext()
    const authorizationHeader = context.req.header('Authorization') ?? undefined
    const env: any = getEnv()

    const userId = String(this.userId ?? '')
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

  /**
   * Resolves cars assigned to this driver (Car.driverId == DriverData.userId)
   * as Relay connection.
   */
  async cars(args?: { first?: number; after?: string | null }): Promise<CarConnection> {
    const userId = String(this.userId ?? '')
    if (!userId) {
      return new CarConnection({
        edges: [],
        pageInfo: new PageInfo({ hasNextPage: false, hasPreviousPage: false }),
        totalCount: 0
      })
    }

    const first = Math.max(1, Math.min(100, args?.first ?? 25))
    const after = args?.after ? String(args.after) : null

    const where = { driverId: userId }

    const rows = await prisma().car.findMany({
      where,
      // stable cursor pagination
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      take: first + 1,
      ...(after ? { cursor: { id: after }, skip: 1 } : {})
    })

    const hasNextPage = rows.length > first
    const slice = rows.slice(0, first)

    const edges = slice.map((r: any) => {
      const node = Object.assign(new Car(), r)
      return new CarEdge({ cursor: String(node.id), node })
    })

    const totalCount = await prisma().car.count({ where })

    const startCursor = edges[0]?.cursor
    const endCursor = edges.length ? edges[edges.length - 1].cursor : undefined

    return new CarConnection({
      edges,
      pageInfo: new PageInfo({
        hasNextPage,
        hasPreviousPage: Boolean(after),
        startCursor,
        endCursor
      }),
      totalCount
    })
  }

  /**
   * Resolves transfers assigned to this driver (Transfer.driverId == DriverData.userId)
   * as Relay connection.
   */
  async transfers(args?: { first?: number; after?: string | null }): Promise<TransferConnection> {
    const userId = String(this.userId ?? '')
    if (!userId) {
      return new TransferConnection({
        edges: [],
        pageInfo: new PageInfo({ hasNextPage: false, hasPreviousPage: false }),
        totalCount: 0
      })
    }

    const first = Math.max(1, Math.min(100, args?.first ?? 25))
    const after = args?.after ? String(args.after) : null

    const where = { driverId: userId }

    const rows = await prisma().transfer.findMany({
      where,
      orderBy: [{ pickupDateTime: 'desc' }, { id: 'desc' }],
      take: first + 1,
      ...(after ? { cursor: { id: after }, skip: 1 } : {})
    })

    const hasNextPage = rows.length > first
    const slice = rows.slice(0, first)

    const edges = slice.map((r: any) => {
      const node = Object.assign(new Transfer(), r)
      return new TransferEdge({ cursor: String(node.id), node })
    })

    const totalCount = await prisma().transfer.count({ where })

    const startCursor = edges[0]?.cursor
    const endCursor = edges.length ? edges[edges.length - 1].cursor : undefined

    return new TransferConnection({
      edges,
      pageInfo: new PageInfo({
        hasNextPage,
        hasPreviousPage: Boolean(after),
        startCursor,
        endCursor
      }),
      totalCount
    })
  }

  async stats(): Promise<{ [k: string]: any } | null> {
    const driverDataId = String(this.id ?? '')
    if (!driverDataId) return null

    const row = await prisma().driverStats.findUnique({ where: { driverDataId } })
    return row ? (row as any) : null
  }
}

export class DriverDataEdge {
  cursor: string
  node: DriverData

  constructor(args: { cursor: string; node: DriverData }) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

export class DriverDataConnection {
  edges: DriverDataEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: { edges: DriverDataEdge[]; pageInfo: PageInfo; totalCount: number }) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
