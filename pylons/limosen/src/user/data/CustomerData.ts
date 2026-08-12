// src/user/data/CustomerData.ts
import { getContext, getEnv, type ID } from '@getcronit/pylon'
import { PageInfo } from '../../relay/PageInfo'
import type { UserDataNode, UserNode } from '../types'
import { toUserModel } from '..'
import { resolve } from '../../clients/iam'

import { prisma } from '../../db/prisma'
import { Transfer, TransferConnection, TransferEdge } from '../../fleet/transfer/Transfer'

import type { CustomerData as PrismaCustomerData } from '@prisma/client'

interface PrismaCustomerDataNode extends PrismaCustomerData {}

export class CustomerData implements UserDataNode {
  constructor(
    public id: ID = '' as any,

    // Prisma fields
    public userId: PrismaCustomerData['userId'] = '',

    public createdAt: PrismaCustomerData['createdAt'] = new Date(),
    public updatedAt: PrismaCustomerData['updatedAt'] = new Date()
  ) {}

  static async ensure(userId: string): Promise<CustomerData> {
    const uid = String(userId ?? '').trim()
    if (!uid) throw new Error('CustomerData.ensure: userId required')

    const row = await prisma().customerData.upsert({
      where: { userId: uid },
      update: {},
      create: { userId: uid }
    })

    return Object.assign(new CustomerData(), row)
  }

  static async getByUserId(userId: string): Promise<CustomerData | null> {
    const uid = String(userId ?? '').trim()
    if (!uid) return null

    const row = await prisma().customerData.findUnique({ where: { userId: uid } })
    return row ? Object.assign(new CustomerData(), row) : null
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
   * Resolves transfers for this customer (Transfer.customerId == CustomerData.userId)
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

    const where = { customerId: userId }

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
}

export class CustomerDataEdge {
  cursor: string
  node: CustomerData

  constructor(args: { cursor: string; node: CustomerData }) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

export class CustomerDataConnection {
  edges: CustomerDataEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: { edges: CustomerDataEdge[]; pageInfo: PageInfo; totalCount: number }) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
