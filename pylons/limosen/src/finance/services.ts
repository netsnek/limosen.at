// src/finance/services.ts
import {prisma} from '../db/prisma'
import {InvalidInputError} from '../errors/general.errors'

export class FinanceServices {
  static async getDriverCashTransfers(args: {
    driverId: string
    fromISO?: string
    toISO?: string
    take?: number
    skip?: number
  }) {
    if (!args.driverId) throw new InvalidInputError('driverId required')

    const where: any = {
      driverId: args.driverId,
      state: 'COMPLETED'
    }

    if (args.fromISO || args.toISO) {
      where.startDateTime = {}
      if (args.fromISO) where.startDateTime.gte = new Date(args.fromISO)
      if (args.toISO) where.startDateTime.lte = new Date(args.toISO)
    }

    // “cash/bar” normalization later; keep it simple here
    where.OR = [
      {paymentMethode: 'CASH'},
      // legacy fallbacks (if some rows were written before enum normalization)
      {paymentMethode: 'cash'},
      {paymentMethode: 'Cash'},
      {paymentMethode: 'bar'},
      {paymentMethode: 'Bar'}
    ]

    const rows = await (prisma() as any).transfer.findMany({
      where,
      orderBy: [{startDateTime: 'asc'}],
      take: args.take,
      skip: args.skip
    })

    return rows.map((r: any) => ({
      transferId: r.id,
      startTime: r.startDateTime ? r.startDateTime.toISOString() : null,
      pickup: r.pickupLocation,
      dropoff: r.dropoffLocation,
      price: r.price ?? null,
      payment: r.paymentMethode ?? null,
      state: r.state
    }))
  }

  static async getDriverCompletedStats(args: {
    driverId: string
    fromISO: string
    toISO: string
  }) {
    if (!args.driverId) throw new InvalidInputError('driverId required')
    if (!args.fromISO) throw new InvalidInputError('fromISO required')
    if (!args.toISO) throw new InvalidInputError('toISO required')

    const from = new Date(args.fromISO)
    const to = new Date(args.toISO)

    const all = await (prisma() as any).transfer.findMany({
      where: {driverId: args.driverId, state: 'COMPLETED'}
    })

    const month = all.filter((r: any) => {
      const t = r.startDateTime ? new Date(r.startDateTime).getTime() : 0
      return t >= from.getTime() && t <= to.getTime()
    })

    const sum = (rows: any[]) =>
      rows.reduce((acc, r) => acc + (typeof r.price === 'number' ? r.price : 0), 0)

    return {
      countAll: all.length,
      totalAll: sum(all),
      countMonth: month.length,
      totalMonth: sum(month)
    }
  }
}
