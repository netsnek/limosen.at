// src/fleet/transfer/TransferDetails.ts
import { type ID } from '@getcronit/pylon'
import type { TransferDetails as PrismaTransferDetails } from '@prisma/client'
import { CarClass as PrismaCarClass } from '@prisma/client'

interface PrismaTransferDetailsNode extends PrismaTransferDetails {}

/**
 * TransferDetails domain model (DB-backed).
 * - Constructor parameter-properties define public fields
 * - Optimized for: Object.assign(new TransferDetails(), r)
 * - No __typename
 */
export class TransferDetails implements PrismaTransferDetailsNode {
  constructor(
    // 1:1 PK + FK to Transfer
    public transferId: PrismaTransferDetails['transferId'] = '' as any,

    public flightNumber: PrismaTransferDetails['flightNumber'] = null,
    public message: PrismaTransferDetails['message'] = null,
    public luggage: PrismaTransferDetails['luggage'] = null,
    public childSeats: PrismaTransferDetails['childSeats'] = null,
    public extraTime: PrismaTransferDetails['extraTime'] = null,

    public preferredCarClass: PrismaTransferDetails['preferredCarClass'] = null,
    public preferredCarName: PrismaTransferDetails['preferredCarName'] = null
  ) {}
}
