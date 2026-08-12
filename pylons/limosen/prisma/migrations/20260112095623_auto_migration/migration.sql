/*
  Warnings:

  - You are about to drop the column `endTime` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `pickupTime` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Transfer` table. All the data in the column will be lost.
  - Added the required column `pickupDateTime` to the `Transfer` table without a default value. This is not possible if the table is not empty.
*/

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS "new_Transfer";

CREATE TABLE "new_Transfer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "driverId" TEXT,
    "startDateTime" DATETIME,
    "pickupDateTime" DATETIME NOT NULL,
    "endDateTime" DATETIME,
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

-- ✅ IMPORTANT: copy old time columns into the renamed columns
INSERT INTO "new_Transfer" (
  "id",
  "customerId",
  "driverId",
  "startDateTime",
  "pickupDateTime",
  "endDateTime",
  "pickup",
  "dropoff",
  "subject",
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
  "startTime"      AS "startDateTime",
  "pickupTime"     AS "pickupDateTime",
  "endTime"        AS "endDateTime",
  "pickup",
  "dropoff",
  "subject",
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

CREATE INDEX "Transfer_customerId_pickupDateTime_idx" ON "Transfer"("customerId", "pickupDateTime");
CREATE INDEX "Transfer_driverId_pickupDateTime_idx" ON "Transfer"("driverId", "pickupDateTime");
CREATE INDEX "Transfer_state_pickupDateTime_idx" ON "Transfer"("state", "pickupDateTime");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
