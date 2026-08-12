// src/fleet/transfer/TransferExtra.ts
import type { ID } from '@getcronit/pylon'
import { PageInfo } from '../../relay/PageInfo'
import { prisma } from '../../db/prisma'
import type { TransferExtra as PrismaTransferExtra } from '@prisma/client'
import { ExtraType as PrismaExtraType } from '@prisma/client'

interface PrismaTransferExtraNode extends PrismaTransferExtra {}

// Re-export so services can reference it
export type ExtraType = PrismaTransferExtra['type']
export const EXTRA_TYPES: ExtraType[] = Object.values(PrismaExtraType)

/**
 * TransferExtra domain model (DB-backed).
 * Represents a single addon attached to a transfer (e.g. child seat × 2).
 *
 * Optimized for: Object.assign(new TransferExtra(), row)
 */
export class TransferExtra implements PrismaTransferExtraNode {
  constructor(
    public id: ID = '' as any,
    public transferId: PrismaTransferExtra['transferId'] = '',
    public type: PrismaTransferExtra['type'] = PrismaExtraType.CHILD_SEAT,
    public amount: PrismaTransferExtra['amount'] = 1
  ) {}

  static clampFirst(n: unknown, fallback = 25) {
    const x = typeof n === 'number' ? n : Number(n)
    const v = Number.isFinite(x) ? x : fallback
    return Math.max(1, Math.min(100, Math.floor(v)))
  }

  /**
   * Relay connection list for extras.
   * Pagination is keyset-based by id (DESC).
   */
  static async listConnection(args?: {
    transferId?: string
    first?: number
    after?: string | null
    take?: number
    skip?: number
  }): Promise<TransferExtraConnection> {
    const baseWhere: any = args?.transferId ? { transferId: String(args.transferId) } : {}

    const first = TransferExtra.clampFirst(args?.first ?? args?.take ?? 25)
    const after = args?.after ? String(args.after) : null
    const skip = typeof args?.skip === 'number' && args.skip > 0 ? Math.floor(args.skip) : 0

    const where = after
      ? { AND: [baseWhere, { id: { lt: after } }] }
      : baseWhere

    const rows = await prisma().transferExtra.findMany({
      where,
      orderBy: [{ id: 'desc' }],
      take: first + 1,
      ...(after ? {} : skip ? { skip } : {})
    })

    const hasNextPage = rows.length > first
    const slice = rows.slice(0, first)

    const edges = slice.map((r: any) => {
      const node = Object.assign(new TransferExtra(), r)
      return new TransferExtraEdge({ cursor: String(node.id), node })
    })

    const totalCount = await prisma().transferExtra.count({ where: baseWhere })

    const startCursor = edges[0]?.cursor
    const endCursor = edges.length ? edges[edges.length - 1].cursor : undefined

    return new TransferExtraConnection({
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

export class TransferExtraEdge {
  cursor: string
  node: TransferExtra

  constructor(args: { cursor: string; node: TransferExtra }) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

export class TransferExtraConnection {
  edges: TransferExtraEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: { edges: TransferExtraEdge[]; pageInfo: PageInfo; totalCount: number }) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
