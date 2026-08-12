// src/fleet/Location.ts
import { getContext, getEnv, type ID } from '@getcronit/pylon'
import type { Node, UserNode } from '../user/types'
import { toUserModel } from '../user'
import { resolve } from '../clients/iam'
import { PageInfo } from '../relay/PageInfo'

import { prisma } from '../db/prisma'
import { InvalidInputError } from '../errors/general.errors'

export interface LocationNode extends Node {
  latitude: number
  longitude: number

  accuracy: number | null
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  speed: number | null

  recordedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

function numOrNull(v: unknown): number | null {
  const x = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(x) ? x : null
}

function requiredNumber(name: string, v: unknown): number {
  const n = numOrNull(v)
  if (n == null) throw new InvalidInputError(`${name} required`)
  return n
}

function clamp(name: string, v: number, min: number, max: number) {
  if (!Number.isFinite(v)) throw new InvalidInputError(`Invalid ${name}`)
  if (v < min || v > max) throw new InvalidInputError(`Invalid ${name}`)
  return v
}

function nonNegativeOrNull(v: unknown) {
  const n = numOrNull(v)
  if (n == null) return null
  return n < 0 ? null : n
}

function clampTake(n: unknown, fallback = 200) {
  const x = typeof n === 'number' ? n : Number(n)
  const v = Number.isFinite(x) ? x : fallback
  return Math.max(1, Math.min(1000, Math.floor(v)))
}

function clampSkip(n: unknown) {
  const x = typeof n === 'number' ? n : Number(n)
  const v = Number.isFinite(x) ? x : 0
  return Math.max(0, Math.floor(v))
}

function parseRecordedAtISO(v?: unknown): Date | null {
  const s = typeof v === 'string' ? v.trim() : ''
  if (!s) return null
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return null
  return d
}

/**
 * DriverLocation domain model (DB-backed).
 * - Constructor parameter-properties define public fields
 * - Optimized for: Object.assign(new DriverLocation(), r)
 * - No __typename
 */
export class DriverLocation implements LocationNode {
  constructor(
    public id: ID = '' as any,

    // Prisma fields
    public driverId: string = '',

    public latitude: number = 0,
    public longitude: number = 0,

    public accuracy: number | null = null,
    public altitude: number | null = null,
    public altitudeAccuracy: number | null = null,
    public heading: number | null = null,
    public speed: number | null = null,

    public recordedAt: Date | null = null,

    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  async driver(): Promise<UserNode | null> {
    const context = getContext()
    const authorizationHeader = context.req.header('Authorization') ?? undefined
    const env: any = getEnv()

    const userId = String(this.driverId ?? '')
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

  static normalizeInput(args: {
    latitude: unknown
    longitude: unknown
    accuracy?: unknown
    altitude?: unknown
    altitudeAccuracy?: unknown
    heading?: unknown
    speed?: unknown
    recordedAtISO?: unknown
  }): {
    latitude: number
    longitude: number
    accuracy: number | null
    altitude: number | null
    altitudeAccuracy: number | null
    heading: number | null
    speed: number | null
    recordedAt: Date | null
  } {
    const latitude = clamp('latitude', requiredNumber('latitude', args.latitude), -90, 90)
    const longitude = clamp('longitude', requiredNumber('longitude', args.longitude), -180, 180)

    const accuracy = nonNegativeOrNull(args.accuracy)
    const altitude = numOrNull(args.altitude)
    const altitudeAccuracy = nonNegativeOrNull(args.altitudeAccuracy)
    const heading = numOrNull(args.heading)
    const speed = nonNegativeOrNull(args.speed)

    const recordedAt = parseRecordedAtISO(args.recordedAtISO)

    return { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed, recordedAt }
  }

  static async getByDriverId(driverId: string): Promise<DriverLocation | null> {
    const uid = String(driverId ?? '').trim()
    if (!uid) return null

    const row = await (prisma() as any).driverLocation.findUnique({ where: { driverId: uid } })
    return row ? Object.assign(new DriverLocation(), row) : null
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

  static async list(args?: { take?: number; skip?: number }): Promise<DriverLocation[]> {
    const take = clampTake(args?.take, 200)
    const skip = clampSkip(args?.skip)

    const rows = await (prisma() as any).driverLocation.findMany({
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      take,
      ...(skip ? { skip } : {})
    })

    return (rows ?? []).map((r: any) => Object.assign(new DriverLocation(), r))
  }

  /**
   * Relay connection list for driver locations.
   * Pagination is keyset-based by (updatedAt DESC, id DESC).
   * Cursor is `${updatedAtISO}|${id}`.
   */
  static async listConnection(args?: {
    first?: number
    after?: string | null
    take?: number
    skip?: number
  }): Promise<DriverLocationConnection> {
    const baseWhere: any = {}

    const first = DriverLocation.clampFirst(args?.first ?? args?.take ?? 25)
    const after = args?.after ? String(args.after) : null
    const skip = typeof args?.skip === 'number' && args.skip > 0 ? Math.floor(args.skip) : 0

    let where: any = baseWhere

    if (after) {
      // keyset: (updatedAt < a) OR (updatedAt = a AND id < afterId)
      const { updatedAt: aDt, id: aId } = DriverLocation.parseCursor(after)
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

    const rows = await (prisma() as any).driverLocation.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      take: first + 1,
      ...(after ? {} : skip ? { skip } : {})
    })

    const hasNextPage = rows.length > first
    const slice = rows.slice(0, first)

    const edges = slice.map((r: any) => {
      const node = Object.assign(new DriverLocation(), r)
      const cursor = DriverLocation.makeCursor(new Date(node.updatedAt), String(node.id))
      return new DriverLocationEdge({ cursor, node })
    })

    const totalCount = await (prisma() as any).driverLocation.count({ where: baseWhere })

    const startCursor = edges[0]?.cursor
    const endCursor = edges.length ? edges[edges.length - 1].cursor : undefined

    return new DriverLocationConnection({
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
 * Holds a driver location node together with the cursor used for pagination.
 */
export class DriverLocationEdge {
  cursor: string
  node: DriverLocation

  constructor(args: { cursor: string; node: DriverLocation }) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

/**
 * Wraps a list of driver location edges plus pagination state in Relay connection format.
 */
export class DriverLocationConnection {
  edges: DriverLocationEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: { edges: DriverLocationEdge[]; pageInfo: PageInfo; totalCount: number }) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}

/**
 * CustomerLocation domain model (DB-backed).
 * - Constructor parameter-properties define public fields
 * - Optimized for: Object.assign(new CustomerLocation(), r)
 * - No __typename
 */
export class CustomerLocation implements LocationNode {
  constructor(
    public id: ID = '' as any,

    // Prisma fields
    public customerId: string = '',

    public latitude: number = 0,
    public longitude: number = 0,

    public accuracy: number | null = null,
    public altitude: number | null = null,
    public altitudeAccuracy: number | null = null,
    public heading: number | null = null,
    public speed: number | null = null,

    public recordedAt: Date | null = null,

    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  async customer(): Promise<UserNode | null> {
    const context = getContext()
    const authorizationHeader = context.req.header('Authorization') ?? undefined
    const env: any = getEnv()

    const userId = String(this.customerId ?? '')
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

  static async getByCustomerId(customerId: string): Promise<CustomerLocation | null> {
    const uid = String(customerId ?? '').trim()
    if (!uid) return null

    const row = await (prisma() as any).customerLocation.findUnique({ where: { customerId: uid } })
    return row ? Object.assign(new CustomerLocation(), row) : null
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

  static async list(args?: { take?: number; skip?: number }): Promise<CustomerLocation[]> {
    const take = clampTake(args?.take, 200)
    const skip = clampSkip(args?.skip)

    const rows = await (prisma() as any).customerLocation.findMany({
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      take,
      ...(skip ? { skip } : {})
    })

    return (rows ?? []).map((r: any) => Object.assign(new CustomerLocation(), r))
  }

  /**
   * Relay connection list for customer locations.
   * Pagination is keyset-based by (updatedAt DESC, id DESC).
   * Cursor is `${updatedAtISO}|${id}`.
   */
  static async listConnection(args?: {
    first?: number
    after?: string | null
    take?: number
    skip?: number
  }): Promise<CustomerLocationConnection> {
    const baseWhere: any = {}

    const first = CustomerLocation.clampFirst(args?.first ?? args?.take ?? 25)
    const after = args?.after ? String(args.after) : null
    const skip = typeof args?.skip === 'number' && args.skip > 0 ? Math.floor(args.skip) : 0

    let where: any = baseWhere

    if (after) {
      const { updatedAt: aDt, id: aId } = CustomerLocation.parseCursor(after)
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

    const rows = await (prisma() as any).customerLocation.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      take: first + 1,
      ...(after ? {} : skip ? { skip } : {})
    })

    const hasNextPage = rows.length > first
    const slice = rows.slice(0, first)

    const edges = slice.map((r: any) => {
      const node = Object.assign(new CustomerLocation(), r)
      const cursor = CustomerLocation.makeCursor(new Date(node.updatedAt), String(node.id))
      return new CustomerLocationEdge({ cursor, node })
    })

    const totalCount = await (prisma() as any).customerLocation.count({ where: baseWhere })

    const startCursor = edges[0]?.cursor
    const endCursor = edges.length ? edges[edges.length - 1].cursor : undefined

    return new CustomerLocationConnection({
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
 * Holds a customer location node together with the cursor used for pagination.
 */
export class CustomerLocationEdge {
  cursor: string
  node: CustomerLocation

  constructor(args: { cursor: string; node: CustomerLocation }) {
    this.cursor = args.cursor
    this.node = args.node
  }
}

/**
 * Wraps a list of customer location edges plus pagination state in Relay connection format.
 */
export class CustomerLocationConnection {
  edges: CustomerLocationEdge[]
  pageInfo: PageInfo
  totalCount: number

  constructor(args: { edges: CustomerLocationEdge[]; pageInfo: PageInfo; totalCount: number }) {
    this.edges = args.edges
    this.pageInfo = args.pageInfo
    this.totalCount = args.totalCount
  }
}
