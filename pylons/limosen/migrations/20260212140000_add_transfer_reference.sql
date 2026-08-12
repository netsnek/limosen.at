-- AlterTable: add referenceId column to Transfer (self-referencing FK to origin transfer)
ALTER TABLE "Transfer" ADD COLUMN "referenceId" TEXT REFERENCES "Transfer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Transfer_referenceId_idx" ON "Transfer"("referenceId");
