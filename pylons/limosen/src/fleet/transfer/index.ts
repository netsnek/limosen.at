// src/fleet/transfer/index.ts
import {TransferServices} from './services'
import {Transfer} from './Transfer'

export const graphql = {
  Query: {
    transfer: TransferServices.getTransfer,
    transfers: TransferServices.listTransfers,
    getCustomerBookings: TransferServices.getCustomerBookings,
    getDriverTransfers: TransferServices.getDriverTransfers
  },
  Mutation: {
    createTransfer: TransferServices.createTransfer,
    bookTransfer: TransferServices.bookTransfer,
    assignDriver: TransferServices.assignDriver,
    setPrice: TransferServices.setPrice,
    updateTransferState: TransferServices.updateTransferState,
    cancelTransfer: TransferServices.cancelTransfer,
    terminateTransfer: TransferServices.terminateTransfer
  }
}
