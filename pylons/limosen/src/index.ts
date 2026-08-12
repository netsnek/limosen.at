// src/index.ts
import { app, auth } from '@getcronit/pylon'
import { UserServices } from './user'
import { ProfileServices } from './user/profile'
import { UserDataService } from './user/data'
import { TransferServices } from './fleet/transfer/services'
import { LocationServices } from './fleet/location.services'

export const graphql = {
  Query: {
    user: UserServices.user,
    users: UserServices.users,
    usersByRole: UserServices.usersByRole,

    profiles: ProfileServices.profiles,
    userData: UserDataService.data,

    isUnique: UserServices.isUnique,
    currentUser: UserServices.currentUser,

    transfers: TransferServices.listTransfers,

    // ✅ added
    passengers: TransferServices.listPassengers,
    cars: TransferServices.listCars,

    // ✅ locations
    driverLocations: LocationServices.driverLocations,
    customerLocations: LocationServices.customerLocations
  },
  Mutation: {
        // ✅ transfers
    createTransfer: TransferServices.createTransfer,
    bookTransfer: TransferServices.bookTransfer,

    // ✅ assigns driver + stores current carId on transfer
    assignDriver: TransferServices.assignDriver,
    assignCar: TransferServices.assignCar,

    // ✅ extras management
    addTransferExtra: TransferServices.addTransferExtra,
    removeTransferExtra: TransferServices.removeTransferExtra,

    // ✅ set transfer price
    setPrice: TransferServices.setPrice,

    updateTransferState: TransferServices.updateTransferState,

    // ✅ locations
    setDriverLocation: LocationServices.setDriverLocation,
    // createUser: UserServices.createUser,

    // deleteUser: UserServices.deleteUser,
    // deactivateUser: UserServices.deactivateUser,
    // reactivateUser: UserServices.reactivateUser,
    // lockUser: UserServices.lockUser,
    // unlockUser: UserServices.unlockUser,

    // updateUser: UserServices.updateUser,

    // setUserPassword: UserServices.setUserPassword,
    // requestUserPasswordReset: UserServices.requestUserPasswordReset,

    // sendUserEmailVerification: UserServices.sendUserEmailVerification,
    // resendUserEmailVerification: UserServices.resendUserEmailVerification,
    // verifyUserEmail: UserServices.verifyUserEmail,

    // setUserPhone: UserServices.setUserPhone,

    // createAuthorization: UserServices.createAuthorization,
    // updateAuthorization: UserServices.updateAuthorization,
    // deleteAuthorization: UserServices.deleteAuthorization
  }
}

app.use('*', auth.initialize())

export default app
