import { app } from "@getcronit/pylon";
// import { createBunWebSocket } from "hono/bun";

import { UserService } from "./user.service";
import { TransferService } from "./transfer.service";

export const graphql = {
  Query: {
    // Existing
    user: UserService.getZitadelUserById,
    getIsUnique: UserService.getIsUnique,
    getUserCount: UserService.getUserCount,
    getAllUser: UserService.listAllZitadelUsers,

    // Transfers (read)
    getTransfer: TransferService.getTransfer,
    getAllTransfers: TransferService.listTransfers
  },
  Mutation: {
    // Existing
    userCreate: UserService.userCreate,

    // Transfers (write)
    createTransfer: TransferService.createTransfer,
    assignDriver: TransferService.assignDriver,
    cancelTransfer: TransferService.cancelTransfer,
    terminateTransfer: TransferService.terminateTransfer,
    markCompleted: TransferService.markCompleted,

    // Maintenance
    syncMonthlyTransfers: TransferService.syncMonthlySheet
  }
};

export default app;
