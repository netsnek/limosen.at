// src/fleet/transfer/Transfer.ts
import { getContext, getEnv, type ID } from '@getcronit/pylon'
import validator from 'validator'

import { PageInfo } from '../../relay/PageInfo'
import type { UserNode } from '../../user/types'
import { toUserModel } from '../../user'
import { resolve } from '../../clients/iam'

import { prisma } from '../../db/prisma'
import { InvalidInputError } from '../../errors/general.errors'

import { Passenger, PassengerConnection } from './Passenger'
import { TransferExtra, TransferExtraConnection } from './TransferExtra'
import { Car } from '../Car'
import { TransferDetails } from './TransferDetails'

import type {
  Transfer as PrismaTransfer
} from '@prisma/client'
import {
  TransferState as PrismaTransferState,
  TransferCategory as PrismaTransferCategory,
  TransferType as PrismaTransferType,
  CarClass as PrismaCarClass
} from '@prisma/client'

export enum PaymentMethode {
  CASH = 'CASH',
  CARD = 'CARD',
  VOUCHER = 'VOUCHER',
  INVOICE = 'INVOICE'
}

export enum PayingParty {
  CUSTOMER = 'CUSTOMER',
  PASSENGER = 'PASSENGER'
}

export class Transfer {
  // ---------- helpers ----------

  static clean(v?: unknown) {
    const s = typeof v === 'string' ? v.trim() : ''
    return s.length ? s : null
  }

  static clampFirst(n: unknown, fallback = 25) {
    const x = typeof n === 'number' ? n : Number(n)
    const v = Number.isFinite(x) ? x : fallback
    return Math.max(1, Math.min(100, Math.floor(v)))
  }

  static normalizePayment(raw?: unknown): PaymentMethode | null {
    const v = String(raw ?? '').trim()
    if (!v) return null
    const lower = v.toLowerCase()

    if (v === 'CASH' || ['cash', 'bar', 'bargeld'].includes(lower)) return PaymentMethode.CASH
    if (v === 'CARD' || ['card', 'karte', 'credit', 'debit'].includes(lower)) return PaymentMethode.CARD
    if (v === 'VOUCHER' || ['voucher', 'gutschein', 'coupon'].includes(lower)) return PaymentMethode.VOUCHER
    if (v === 'INVOICE' || ['invoice', 'rechnung'].includes(lower)) return PaymentMethode.INVOICE

    return null
  }

  static normalizePayingParty(raw?: unknown): PayingParty | null {
    const v = String(raw ?? '').trim()
    if (!v) return null
    const lower = v.toLowerCase()

    if (v === 'CUSTOMER' || ['customer', 'kunde'].includes(lower)) return PayingParty.CUSTOMER
    if (v === 'PASSENGER' || ['passenger', 'gast', 'fahrgast'].includes(lower)) return PayingParty.PASSENGER

    return null
  }

  static enumOrNull<T extends Record<string, string>>(e: T, raw?: unknown) {
    const s = Transfer.clean(raw)
    if (!s) return null
    return (Object.values(e) as string[]).includes(s) ? (s as any) : null
  }

  static enumOrDefault<T extends Record<string, string>>(e: T, raw: unknown, fallback: any) {
    const s = typeof raw === 'string' ? raw : ''
    return (Object.values(e) as string[]).includes(s) ? (s as any) : fallback
  }

  static parsePickupDateTime(pickupDateTimeISO: string) {
    if (!pickupDateTimeISO || typeof pickupDateTimeISO !== 'string') {
      throw new InvalidInputError('pickupDateTime required')
    }
    if (!validator.isISO8601(pickupDateTimeISO)) throw new InvalidInputError('Invalid pickupDateTime')

    const dt = new Date(pickupDateTimeISO)
    if (Number.isNaN(dt.getTime())) throw new InvalidInputError('Invalid pickupDateTime')
    return dt
  }

  static toSheetDate(d: Date) {
    return d.toISOString().slice(0, 10)
  }

  static toSheetTime(d: Date) {
    return d.toISOString().slice(11, 16)
  }

  static makeCursor(pickupDateTime: Date, id: string) {
    return `${pickupDateTime.toISOString()}|${id}`
  }

  static parseCursor(cursor: string): { pickupDateTime: Date; id: string } {
    const [iso, id] = String(cursor ?? '').split('|')
    const dt = new Date(iso)
    if (!iso || !id || Number.isNaN(dt.getTime())) throw new Error('Invalid cursor')
    return { pickupDateTime: dt, id }
  }

  // ---------- prisma-backed static accessors ----------

  static async getById(transferId: string): Promise<Transfer | null> {
    if (!transferId) throw new InvalidInputError('transferId required')
    const row = await prisma().transfer.findUnique({ where: { id: transferId } })
    return row ? Object.assign(new Transfer(), row) : null
  }

  /**
   * Relay connection list for transfers.
   * Pagination is keyset-based by (pickupDateTime DESC, id DESC).
   * Cursor is `${pickupDateTimeISO}|${id}`.
   */
  static async listConnection(args?: {
    customerId?: string
    driverId?: string
    state?: PrismaTransfer['state']
    fromISO?: string
    toISO?: string

    first?: number
    after?: string | null

    take?: number
    skip?: number
  }): Promise<TransferConnection> {
    const baseWhere: any = {}

    if (args?.customerId) baseWhere.customerId = args.customerId
    if (args?.driverId) baseWhere.driverId = args.driverId
    if (args?.state) baseWhere.state = args.state

    if (args?.fromISO || args?.toISO) {
      baseWhere.pickupDateTime = {}
      if (args.fromISO) baseWhere.pickupDateTime.gte = new Date(args.fromISO)
      if (args.toISO) baseWhere.pickupDateTime.lte = new Date(args.toISO)
    }

    const first = Transfer.clampFirst(args?.first ?? args?.take ?? 25)
    const after = args?.after ? String(args.after) : null
    const skip = typeof args?.skip === 'number' && args.skip > 0 ? Math.floor(args.skip) : 0

    let where: any = baseWhere

    if (after) {
      const { pickupDateTime: aDt, id: aId } = Transfer.parseCursor(after)
      where = {
        AND: [
          baseWhere,
          {
            OR: [
              { pickupDateTime: { lt: aDt } },
              { AND: [{ pickupDateTime: aDt }, { id: { lt: aId } }] }
            ]
          }
        ]
      }
    }

    const rows = await prisma().transfer.findMany({
      where,
      orderBy: [{ pickupDateTime: 'desc' }, { id: 'desc' }],
      take: first + 1,
      ...(after ? {} : skip ? { skip } : {})
    })

    const hasNextPage = rows.length > first
    const slice = rows.slice(0, first)

    const edges = slice.map((r: any) => {
      const node = Object.assign(new Transfer(), r)
      const cursor = Transfer.makeCursor(new Date(node.pickupDateTime), String(node.id))
      return new TransferEdge({ cursor, node })
    })

    const totalCount = await prisma().transfer.count({ where: baseWhere })

    const startCursor = edges[0]?.cursor
    const endCursor = edges.length ? edges[edges.length - 1].cursor : undefined

    return new TransferConnection({
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

  // -------------------------------------------------------------------

  constructor(
    public id: ID = '' as any,

    public customerId: PrismaTransfer['customerId'] = '',
    public driverId: PrismaTransfer['driverId'] = null,

    public startDateTime: PrismaTransfer['startDateTime'] = null,
    public pickupDateTime: PrismaTransfer['pickupDateTime'] = new Date(),
    public endDateTime: PrismaTransfer['endDateTime'] = null,

    public pickupLocation: PrismaTransfer['pickupLocation'] = '',
    public dropoffLocation: PrismaTransfer['dropoffLocation'] = '',

    public subject: PrismaTransfer['subject'] = null,

    public price: number | null = null,
    public paymentMethode: PaymentMethode | null = null,
    public payingParty: PayingParty = PayingParty.CUSTOMER,

    public transferCategory: PrismaTransfer['transferCategory'] = PrismaTransferCategory.DISTANCE,
    public transferType: PrismaTransfer['transferType'] = PrismaTransferType.ONE_WAY,

    public state: PrismaTransfer['state'] = PrismaTransferState.PENDING,
    public requestedAt: PrismaTransfer['requestedAt'] = new Date(),

    public carId: PrismaTransfer['carId'] = null,

    // Self-reference to origin transfer (the origin transfer's id IS its code)
    public referenceId: PrismaTransfer['referenceId'] = null
  ) {}

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

  async customer(): Promise<UserNode | null> {
    const context = getContext()
    const authorizationHeader = context.req.header('Authorization') ?? undefined
    const env: any = getEnv()

    const userId: string | null = this.customerId
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

  async car(): Promise<Car | null> {
    const carId = this.carId
    if (!carId) return null

    const row = await prisma().car.findUnique({ where: { id: carId } })
    return row ? Object.assign(new Car(), row) : null
  }

  /**
   * The origin transfer this one references (e.g. for return trips).
   * The origin transfer's id IS its "code".
   */
  async reference(): Promise<Transfer | null> {
    const refId = this.referenceId
    if (!refId) return null

    const row = await prisma().transfer.findUnique({ where: { id: refId } })
    return row ? Object.assign(new Transfer(), row) : null
  }

  /**
   * All transfers that reference this one (i.e. this is the origin).
   */
  async referencedBy(args?: { first?: number; after?: string | null }): Promise<TransferConnection> {
    const transferId = String(this.id ?? '')
    const first = Transfer.clampFirst(args?.first ?? 25)
    const after = args?.after ? String(args.after) : null

    const baseWhere: any = { referenceId: transferId }

    let where: any = baseWhere
    if (after) {
      const { pickupDateTime: aDt, id: aId } = Transfer.parseCursor(after)
      where = {
        AND: [
          baseWhere,
          {
            OR: [
              { pickupDateTime: { lt: aDt } },
              { AND: [{ pickupDateTime: aDt }, { id: { lt: aId } }] }
            ]
          }
        ]
      }
    }

    const rows = await prisma().transfer.findMany({
      where,
      orderBy: [{ pickupDateTime: 'desc' }, { id: 'desc' }],
      take: first + 1
    })

    const hasNextPage = rows.length > first
    const slice = rows.slice(0, first)

    const edges = slice.map((r: any) => {
      const node = Object.assign(new Transfer(), r)
      const cursor = Transfer.makeCursor(new Date(node.pickupDateTime), String(node.id))
      return new TransferEdge({ cursor, node })
    })

    const totalCount = await prisma().transfer.count({ where: baseWhere })
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

  async details(): Promise<TransferDetails | null> {
    const transferId = String(this.id ?? '')
    if (!transferId) return null

    const row = await prisma().transferDetails.findUnique({ where: { transferId } })
    return row ? Object.assign(new TransferDetails(), row) : null
  }

  async passengers(args?: { first?: number; after?: string | null }): Promise<PassengerConnection> {
    const transferId = String(this.id ?? '')
    return Passenger.listConnection({
      transferId,
      first: args?.first,
      after: args?.after
    })
  }

  async extras(args?: { first?: number; after?: string | null }): Promise<TransferExtraConnection> {
    const transferId = String(this.id ?? '')
    return TransferExtra.listConnection({
      transferId,
      first: args?.first,
      after: args?.after
    })
  }
}

export class TransferEdge {
  cursor: string
  node: Transfer

  constructor(args: { cursor: string; node: Transfer }) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

export class TransferConnection {
  edges: TransferEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: { edges: TransferEdge[]; pageInfo: PageInfo; totalCount: number }) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
