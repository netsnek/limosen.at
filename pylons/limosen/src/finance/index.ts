// src/finance/index.ts
import {FinanceServices} from './services'

export const graphql = {
  Query: {
    getDriverCashTransfers: FinanceServices.getDriverCashTransfers,
    getDriverCompletedStats: FinanceServices.getDriverCompletedStats
  },
  Mutation: {}
}
