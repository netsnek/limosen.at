/*
  Warnings:

  - You are about to drop the column `endDateTime` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `pickupDateTime` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `startDateTime` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Transfer` table. All the data in the column will be lost.
  - Added the required column `pickupTime` to the `Transfer` table without a default value. This is not possible if the table is not empty.

*/
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
    "roomOrName" TEXT,
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

-- ✅ FIX: carry over the old renamed columns into the new required ones
INSERT INTO "new_Transfer" (
  "id",
  "customerId",
  "driverId",
  "startTime",
  "pickupTime",
  "endTime",
  "pickup",
  "dropoff",
  "roomOrName",
  "amountEUR",
  "payment",
  "billingParty",
  "transferCategory",
  "transferType",
  "state",
  "requestedAt",
  "carId"
)
SELECT
  "id",
  "customerId",
  "driverId",
  "startDateTime"  AS "startTime",
  "pickupDateTime" AS "pickupTime",
  "endDateTime"    AS "endTime",
  "pickup",
  "dropoff",
  "subject"        AS "roomOrName",
  "amountEUR",
  "payment",
  "billingParty",
  "transferCategory",
  "transferType",
  "state",
  "requestedAt",
  "carId"
FROM "Transfer";

DROP TABLE "Transfer";
ALTER TABLE "new_Transfer" RENAME TO "Transfer";

CREATE INDEX "Transfer_customerId_pickupTime_idx" ON "Transfer"("customerId", "pickupTime");
CREATE INDEX "Transfer_driverId_pickupTime_idx" ON "Transfer"("driverId", "pickupTime");
CREATE INDEX "Transfer_state_pickupTime_idx" ON "Transfer"("state", "pickupTime");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
