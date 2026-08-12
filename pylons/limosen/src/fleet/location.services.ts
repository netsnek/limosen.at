// src/fleet/location.services.ts
import { getContext, requireAuth } from '@getcronit/pylon'
import { prisma } from '../db/prisma'
import { InvalidInputError } from '../errors/general.errors'
import { DriverData } from '../user/data/DriverData'
import {
  CustomerLocation,
  CustomerLocationConnection,
  DriverLocation,
  DriverLocationConnection
} from './Location'

export class LocationServices {
  static async driverLocations(
    args?: Parameters<typeof DriverLocation.listConnection>[0]
  ): Promise<DriverLocationConnection> {
    return DriverLocation.listConnection(args)
  }

  @requireAuth()
  static async customerLocations(
    args?: Parameters<typeof CustomerLocation.listConnection>[0]
  ): Promise<CustomerLocationConnection> {
    return CustomerLocation.listConnection(args)
  }

  @requireAuth()
  static async setDriverLocation(args: {
    latitude: number
    longitude: number
    accuracy?: number
    altitude?: number
    altitudeAccuracy?: number
    heading?: number
    speed?: number
    recordedAtISO?: string
  }): Promise<DriverLocation> {
    const auth = getContext().get('auth') as any
    const driverId = String(auth?.sub ?? '').trim()
    if (!driverId) throw new InvalidInputError('Anonymous')

    // Required for FK constraint DriverLocation.driverId -> DriverData.userId
    await DriverData.ensure(driverId)

    const normalized = DriverLocation.normalizeInput({
      latitude: args?.latitude,
      longitude: args?.longitude,
      accuracy: args?.accuracy,
      altitude: args?.altitude,
      altitudeAccuracy: args?.altitudeAccuracy,
      heading: args?.heading,
      speed: args?.speed,
      recordedAtISO: args?.recordedAtISO
    })

    const row = await (prisma() as any).driverLocation.upsert({
      where: { driverId },
      create: {
        driverId,
        latitude: normalized.latitude,
        longitude: normalized.longitude,
        accuracy: normalized.accuracy,
        altitude: normalized.altitude,
        altitudeAccuracy: normalized.altitudeAccuracy,
        heading: normalized.heading,
        speed: normalized.speed,
        recordedAt: normalized.recordedAt
      },
      update: {
        latitude: normalized.latitude,
        longitude: normalized.longitude,
        accuracy: normalized.accuracy,
        altitude: normalized.altitude,
        altitudeAccuracy: normalized.altitudeAccuracy,
        heading: normalized.heading,
        speed: normalized.speed,
        recordedAt: normalized.recordedAt
      }
    })

    return Object.assign(new DriverLocation(), row)
  }
}

