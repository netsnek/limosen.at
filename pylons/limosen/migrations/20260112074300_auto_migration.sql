/*
  Warnings:

  - You are about to drop the column `childSeats` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `extraTime` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `flightNumber` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `luggage` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `paymentOption` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `preferredCarClass` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `preferredCarName` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `roomOrName` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle` on the `Transfer` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "TransferDetails" (
    "transferId" TEXT NOT NULL PRIMARY KEY,
    "flightNumber" TEXT,
    "message" TEXT,
    "luggage" TEXT,
    "childSeats" TEXT,
    "extraTime" TEXT,
    "preferredCarClass" TEXT,
    "preferredCarName" TEXT,
    CONSTRAINT "TransferDetails_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "Transfer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transfer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "driverId" TEXT,
    "startTime" DATETIME,
    "pickupTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "pickup" TEXT NOT NULL,
    "dropoff" TEXT NOT NULL,
    "subject" TEXT,
    "amountEUR" REAL,
    "payment" TEXT,
    "billingParty" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "transferCategory" TEXT NOT NULL,
    "transferType" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "carId" TEXT,
    CONSTRAINT "Transfer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerData" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transfer_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "DriverData" ("userId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transfer_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transfer" ("amountEUR", "carId", "customerId", "driverId", "dropoff", "endTime", "id", "payment", "pickup", "pickupTime", "requestedAt", "startTime", "state", "transferCategory", "transferType") SELECT "amountEUR", "carId", "customerId", "driverId", "dropoff", "endTime", "id", "payment", "pickup", "pickupTime", "requestedAt", "startTime", "state", "transferCategory", "transferType" FROM "Transfer";
DROP TABLE "Transfer";
ALTER TABLE "new_Transfer" RENAME TO "Transfer";
CREATE INDEX "Transfer_customerId_pickupTime_idx" ON "Transfer"("customerId", "pickupTime");
CREATE INDEX "Transfer_driverId_pickupTime_idx" ON "Transfer"("driverId", "pickupTime");
CREATE INDEX "Transfer_state_pickupTime_idx" ON "Transfer"("state", "pickupTime");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "TransferDetails_transferId_idx" ON "TransferDetails"("transferId");
