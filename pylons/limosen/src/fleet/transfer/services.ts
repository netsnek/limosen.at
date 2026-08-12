// src/fleet/transfer/services.ts
import { getContext, getEnv, requireAuth } from '@getcronit/pylon'
import { prisma } from '../../db/prisma'
import { InvalidInputError, ForbiddenError, NotFoundError } from '../../errors/general.errors'
import { appendTransferToSheet } from '../../finance/sheets'

import { Transfer, type PaymentMethode } from './Transfer'
import { Passenger } from './Passenger'
import { TransferExtra, EXTRA_TYPES, type ExtraType } from './TransferExtra'
import { Car } from '../Car'

import { CustomerData } from '../../user/data/CustomerData'
import { DriverData } from '../../user/data/DriverData'

import {
  TransferState as PrismaTransferState,
  TransferCategory as PrismaTransferCategory,
  TransferType as PrismaTransferType,
  CarClass as PrismaCarClass,
} from '@prisma/client'
import type {
  TransferState as PrismaTransferStateT,
  TransferCategory as PrismaTransferCategoryT,
  TransferType as PrismaTransferTypeT,
} from '@prisma/client'

// ✅ directly from Prisma
export type TransferState = PrismaTransferStateT
export const TRANSFER_STATES: TransferState[] = Object.values(PrismaTransferState) as TransferState[]

export type TransferCategory = PrismaTransferCategoryT
export type TransferType = PrismaTransferTypeT
export type PayingParty = 'CUSTOMER' | 'PASSENGER'

export class TransferServices {
  static async getTransfer(transferId: string) {
    return Transfer.getById(transferId)
  }

  static async listTransfers(args?: Parameters<typeof Transfer.listConnection>[0]) {
    return Transfer.listConnection(args)
  }

  static async listPassengers(args?: Parameters<typeof Passenger.listConnection>[0]) {
    return Passenger.listConnection(args)
  }

  static async listCars(args?: Parameters<typeof Car.listConnection>[0]) {
    return Car.listConnection(args)
  }

  @requireAuth()
  static async getCustomerBookings(args?: { first?: number; after?: string | null }) {
    const auth = getContext().get('auth') as any
    const userId = auth?.sub
    if (!userId) throw new InvalidInputError('Anonymous')
    return Transfer.listConnection({ customerId: userId, first: args?.first, after: args?.after })
  }

  static async getDriverTransfers(
    driverId: string,
    args?: { state?: TransferState; fromISO?: string; toISO?: string; first?: number; after?: string | null }
  ) {
    if (!driverId) throw new InvalidInputError('driverId required')
    return Transfer.listConnection({
      driverId,
      state: args?.state,
      fromISO: args?.fromISO,
      toISO: args?.toISO,
      first: args?.first,
      after: args?.after
    })
  }

  static async createTransfer(args: {
    customerId: string
    pickupDateTime: string // ISO datetime

    pickupLocation: string
    dropoffLocation: string

    subject?: string
    price?: number
    paymentMethode?: PaymentMethode | string
    payingParty?: PayingParty | string

    carId?: string

    // Optional reference to the origin transfer (e.g. for return trips).
    // The origin transfer's id IS its "code".
    referenceId?: string

    passengers?: Array<{
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
      language?: string
    }>

    extras?: Array<{
      type: ExtraType | string
      amount?: number
    }>

    details?: {
      flightNumber?: string
      message?: string
      transferCategory?: TransferCategory
      transferType?: TransferType
      luggage?: string
      childSeats?: string
      extraTime?: string

      preferredCarClass?: string
      preferredCarName?: string
    }
  }): Promise<Transfer> {
    if (!args.customerId) throw new InvalidInputError('customerId required')
    if (!Transfer.clean(args.pickupLocation)) throw new InvalidInputError('pickupLocation required')
    if (!Transfer.clean(args.dropoffLocation)) throw new InvalidInputError('dropoffLocation required')

    await CustomerData.ensure(args.customerId)

    const pickupDateTime = Transfer.parsePickupDateTime(args.pickupDateTime)
    const d = args.details

    const normalizedPayment =
      typeof args.paymentMethode === 'string'
        ? Transfer.normalizePayment(args.paymentMethode)
        : (args.paymentMethode ?? null)
    if (args.paymentMethode && !normalizedPayment) throw new InvalidInputError('Invalid paymentMethode')

    const payingPartyRaw = args.payingParty
    const normalizedPayingParty =
      typeof payingPartyRaw === 'string'
        ? Transfer.normalizePayingParty(payingPartyRaw)
        : (payingPartyRaw ?? null)

    const created = await prisma().transfer.create({
      data: {
        customerId: args.customerId,
        driverId: null,

        startDateTime: null,
        pickupDateTime,
        endDateTime: null,

        pickupLocation: String(args.pickupLocation),
        dropoffLocation: String(args.dropoffLocation),

        subject: Transfer.clean(args.subject),

        price: typeof args.price === 'number' ? args.price : null,
        paymentMethode: normalizedPayment ?? null,
        payingParty: normalizedPayingParty ?? 'CUSTOMER',

        transferCategory: Transfer.enumOrDefault(
          PrismaTransferCategory as any,
          d?.transferCategory,
          PrismaTransferCategory.DISTANCE
        ),
        transferType: Transfer.enumOrDefault(
          PrismaTransferType as any,
          d?.transferType,
          PrismaTransferType.ONE_WAY
        ),

        state: PrismaTransferState.PENDING,
        requestedAt: new Date(),

        carId: Transfer.clean(args.carId),
        referenceId: Transfer.clean(args.referenceId),

        details: {
          create: {
            flightNumber: Transfer.clean(d?.flightNumber),
            message: Transfer.clean(d?.message),
            luggage: Transfer.clean(d?.luggage),
            childSeats: Transfer.clean(d?.childSeats),
            extraTime: Transfer.clean(d?.extraTime),

            preferredCarClass: Transfer.enumOrNull(PrismaCarClass as any, d?.preferredCarClass),
            preferredCarName: Transfer.clean(d?.preferredCarName)
          }
        },

        passengers:
          args.passengers && args.passengers.length
            ? {
                create: args.passengers.map((p) => ({
                  firstName: Transfer.clean(p.firstName),
                  lastName: Transfer.clean(p.lastName),
                  email: Transfer.clean(p.email),
                  phone: Transfer.clean(p.phone),
                  language: Transfer.clean(p.language)
                }))
              }
            : undefined,

        extras:
          args.extras && args.extras.length
            ? {
                create: args.extras
                  .filter((e) => EXTRA_TYPES.includes(e.type as ExtraType))
                  .map((e) => ({
                    type: e.type as ExtraType,
                    amount: typeof e.amount === 'number' && e.amount > 0 ? Math.floor(e.amount) : 1
                  }))
              }
            : undefined
      } as any
    })

    await appendTransferToSheet({
      transferId: created.id,
      customerId: args.customerId,
      rideDateISO: Transfer.toSheetDate(pickupDateTime),
      rideTime: Transfer.toSheetTime(pickupDateTime),
      pickup: args.pickupLocation,
      dropoff: args.dropoffLocation,
      roomOrName: args.subject,
      price: args.price,
      payment: normalizedPayment ?? undefined
    })

    return Object.assign(new Transfer(), created)
  }

  static async bookTransfer(args: {
    pickupDateTime: string
    pickupLocation: string
    dropoffLocation: string

    subject?: string
    paymentMethode?: PaymentMethode | string
    payingParty?: PayingParty | string

    referenceId?: string

    passengers?: Array<{
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
      language?: string
    }>

    extras?: Array<{
      type: ExtraType | string
      amount?: number
    }>

    details?: {
      flightNumber?: string
      message?: string
      transferCategory?: TransferCategory
      transferType?: TransferType
      luggage?: string
      childSeats?: string
      extraTime?: string

      preferredCarClass?: string
      preferredCarName?: string
    }
  }): Promise<Transfer> {
    const auth = getContext().get('auth') as any
    const env = getEnv() as any

    const customerId = auth?.sub || String(env?.WEBSITE_CUSTOMER_ID ?? env?.PUBLIC_CUSTOMER_ID ?? 'website')

    const normalizedPayment =
      typeof args.paymentMethode === 'string'
        ? Transfer.normalizePayment(args.paymentMethode)
        : (args.paymentMethode ?? null)
    if (args.paymentMethode && !normalizedPayment) throw new InvalidInputError('Invalid paymentMethode')

    return TransferServices.createTransfer({
      customerId,
      pickupDateTime: args.pickupDateTime,
      pickupLocation: args.pickupLocation,
      dropoffLocation: args.dropoffLocation,
      subject: args.subject ?? 'website',
      price: undefined,
      paymentMethode: normalizedPayment ?? undefined,
      payingParty: args.payingParty,
      referenceId: args.referenceId,
      passengers: args.passengers,
      extras: args.extras,
      details: args.details
    })
  }

  static async setPrice(transferId: string, price: number): Promise<Transfer> {
    if (!transferId) throw new InvalidInputError('transferId required')
    if (typeof price !== 'number' || !Number.isFinite(price)) {
      throw new InvalidInputError('price must be a finite number')
    }

    const row = await prisma().transfer.findUnique({ where: { id: transferId } })
    if (!row) throw new NotFoundError('transfer not found')

    const updated = await prisma().transfer.update({
      where: { id: transferId },
      data: { price } as any
    })

    return Object.assign(new Transfer(), updated)
  }

  static async assignDriver(transferId: string, driverId: string): Promise<Transfer> {
    if (!transferId) throw new InvalidInputError('transferId required')
    if (!driverId) throw new InvalidInputError('driverId required')

    const row = await prisma().transfer.findUnique({ where: { id: transferId } })
    if (!row) throw new NotFoundError('transfer not found')

    await DriverData.ensure(driverId)

    const currentCar = await prisma().car.findFirst({
      where: { driverId },
      orderBy: { updatedAt: 'desc' }
    })

    const updated = await prisma().transfer.update({
      where: { id: transferId },
      data: {
        driverId,
        carId: currentCar?.id ?? null,
        state: PrismaTransferState.PENDING
      }
    })

    return Object.assign(new Transfer(), updated)
  }

  static async assignCar(transferId: string, carId: string): Promise<Transfer> {
    if (!transferId) throw new InvalidInputError('transferId required')
    if (!carId) throw new InvalidInputError('carId required')

    const row = await prisma().transfer.findUnique({ where: { id: transferId } })
    if (!row) throw new NotFoundError('transfer not found')

    const car = await prisma().car.findUnique({ where: { id: carId } })
    if (!car) throw new NotFoundError('car not found')

    const updated = await prisma().transfer.update({
      where: { id: transferId },
      data: { carId }
    })

    return Object.assign(new Transfer(), updated)
  }

  @requireAuth()
  static async updateTransferState(transferId: string, state: TransferState): Promise<Transfer> {
    if (!transferId) throw new InvalidInputError('transferId required')
    if (!TRANSFER_STATES.includes(state)) throw new InvalidInputError('Invalid state')

    const row = await prisma().transfer.findUnique({ where: { id: transferId } })
    if (!row) throw new NotFoundError('transfer not found')

    const updated = await prisma().transfer.update({
      where: { id: transferId },
      data: { state }
    })

    return Object.assign(new Transfer(), updated)
  }

  @requireAuth()
  static async cancelTransfer(transferId: string): Promise<Transfer> {
    const auth = getContext().get('auth') as any
    const userId = auth?.sub
    if (!userId) throw new InvalidInputError('Anonymous')

    const row = await prisma().transfer.findUnique({ where: { id: transferId } })
    if (!row) throw new NotFoundError('transfer not found')
    if (row.customerId !== userId) throw new ForbiddenError('Forbidden')

    const updated = await prisma().transfer.update({
      where: { id: transferId },
      data: { state: PrismaTransferState.CANCELED }
    })

    return Object.assign(new Transfer(), updated)
  }

  static async addTransferExtra(
    transferId: string,
    type: ExtraType | string,
    amount?: number
  ): Promise<Transfer> {
    if (!transferId) throw new InvalidInputError('transferId required')
    if (!type) throw new InvalidInputError('type required')
    if (!EXTRA_TYPES.includes(type as ExtraType)) {
      throw new InvalidInputError(`Invalid extra type. Valid types: ${EXTRA_TYPES.join(', ')}`)
    }

    const row = await prisma().transfer.findUnique({ where: { id: transferId } })
    if (!row) throw new NotFoundError('transfer not found')

    const qty = typeof amount === 'number' && amount > 0 ? Math.floor(amount) : 1

    // Upsert: if same type already exists on this transfer, update the amount
    const existing = await prisma().transferExtra.findFirst({
      where: { transferId, type: type as ExtraType }
    })

    if (existing) {
      await prisma().transferExtra.update({
        where: { id: existing.id },
        data: { amount: qty }
      })
    } else {
      await prisma().transferExtra.create({
        data: { transferId, type: type as ExtraType, amount: qty }
      })
    }

    return Object.assign(new Transfer(), row)
  }

  static async removeTransferExtra(transferId: string, type: ExtraType | string): Promise<Transfer> {
    if (!transferId) throw new InvalidInputError('transferId required')
    if (!type) throw new InvalidInputError('type required')

    const row = await prisma().transfer.findUnique({ where: { id: transferId } })
    if (!row) throw new NotFoundError('transfer not found')

    const existing = await prisma().transferExtra.findFirst({
      where: { transferId, type: type as ExtraType }
    })

    if (existing) {
      await prisma().transferExtra.delete({ where: { id: existing.id } })
    }

    return Object.assign(new Transfer(), row)
  }

  @requireAuth()
  static async terminateTransfer(transferId: string): Promise<Transfer> {
    const row = await prisma().transfer.findUnique({ where: { id: transferId } })
    if (!row) throw new NotFoundError('transfer not found')

    const updated = await prisma().transfer.update({
      where: { id: transferId },
      data: { state: PrismaTransferState.TERMINATED }
    })

    return Object.assign(new Transfer(), updated)
  }
}
