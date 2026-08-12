-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "driverId" TEXT,
    "startTime" DATETIME,
    "pickupTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "pickup" TEXT NOT NULL,
    "dropoff" TEXT NOT NULL,
    "roomOrName" TEXT,
    "vehicle" TEXT,
    "amountEUR" REAL,
    "payment" TEXT,
    "state" TEXT NOT NULL DEFAULT 'pending',
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transferCategory" TEXT NOT NULL,
    "transferType" TEXT NOT NULL,
    "flightNumber" TEXT,
    "message" TEXT,
    "luggage" TEXT,
    "childSeats" TEXT,
    "extraTime" TEXT,
    "preferredCarClass" TEXT,
    "preferredCarName" TEXT,
    "paymentOption" TEXT NOT NULL,
    "carId" TEXT,
    CONSTRAINT "Transfer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerData" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transfer_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "DriverData" ("userId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transfer_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Passenger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transferId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "language" TEXT,
    CONSTRAINT "Passenger_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "Transfer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "licensePlate" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#000000',
    "carClass" TEXT,
    "carName" TEXT,
    "driverId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Car_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "DriverData" ("userId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DriverData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#C0C0C0',
    "payoutPercent" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DriverStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driverDataId" TEXT NOT NULL,
    "revenue" REAL NOT NULL DEFAULT 0,
    "transferCount" INTEGER NOT NULL DEFAULT 0,
    "monthlyRevenue" REAL NOT NULL DEFAULT 0,
    "monthlyCount" INTEGER NOT NULL DEFAULT 0,
    "monthlyCash" REAL NOT NULL DEFAULT 0,
    "cashTotal" REAL NOT NULL DEFAULT 0,
    "expensesMonth" REAL NOT NULL DEFAULT 0,
    "expensesTotal" REAL NOT NULL DEFAULT 0,
    "earnedThisMonth" REAL NOT NULL DEFAULT 0,
    "earnedTotal" REAL NOT NULL DEFAULT 0,
    "computedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DriverStats_driverDataId_fkey" FOREIGN KEY ("driverDataId") REFERENCES "DriverData" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Transfer_customerId_pickupTime_idx" ON "Transfer"("customerId", "pickupTime");

-- CreateIndex
CREATE INDEX "Transfer_driverId_pickupTime_idx" ON "Transfer"("driverId", "pickupTime");

-- CreateIndex
CREATE INDEX "Transfer_state_pickupTime_idx" ON "Transfer"("state", "pickupTime");

-- CreateIndex
CREATE INDEX "Passenger_transferId_idx" ON "Passenger"("transferId");

-- CreateIndex
CREATE UNIQUE INDEX "Car_licensePlate_key" ON "Car"("licensePlate");

-- CreateIndex
CREATE INDEX "Car_driverId_idx" ON "Car"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverData_userId_key" ON "DriverData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverStats_driverDataId_key" ON "DriverStats"("driverDataId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerData_userId_key" ON "CustomerData"("userId");
