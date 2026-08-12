// src/fleet/transfer/types.ts

import { ID } from "@getcronit/pylon"

// Scalars
export type DateTimeISO = string

/**
 * Enum from your Prisma/GraphQL schema
 * (keep spelling exactly as in schema.prisma)
 */
export enum TransferState {
  pending = 'pending',
  confirmed = 'confirmed',
  complete = 'complete',
  canceled = 'canceled',
  terminated = 'terminated'
}

export interface TransferNode {
  id: ID
}
