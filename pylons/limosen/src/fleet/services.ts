// src/fleet/services.ts
import {prisma} from '../db/prisma'
import {InvalidInputError, NotFoundError} from '../errors/general.errors'
import {Car} from './Car'

const clean = (v?: unknown) => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s.length ? s : null
}

export class FleetServices {
  static async upsertCar(args: {
    licensePlate: string
    color?: string
    driverId?: string
  }) {
    const licensePlate = clean(args.licensePlate)
    if (!licensePlate) throw new InvalidInputError('licensePlate required')

    const db = prisma() as any
    const row = await db.car.upsert({
      where: {licensePlate},
      create: {
        licensePlate,
        color: clean(args.color),
        driverId: clean(args.driverId)
      },
      update: {
        color: clean(args.color),
        driverId: clean(args.driverId)
      }
    })

    return new Car(row.carId)
  }

  static async getCar(carId: string) {
    if (!carId) throw new InvalidInputError('carId required')
    const row = await (prisma() as any).car.findUnique({where: {carId}})
    if (!row) throw new NotFoundError('Car not found')
    return new Car(row.carId)
  }

  static async getCarByLicensePlate(licensePlate: string) {
    const lp = clean(licensePlate)
    if (!lp) throw new InvalidInputError('licensePlate required')
    const row = await (prisma() as any).car.findUnique({where: {licensePlate: lp}})
    return row ? new Car(row.carId) : null
  }

  static async listCars(args?: {take?: number; skip?: number}) {
    const rows = await (prisma() as any).car.findMany({
      orderBy: [{updatedAt: 'desc'}],
      take: args?.take,
      skip: args?.skip
    })
    return rows.map((r: any) => new Car(r.carId))
  }
}
