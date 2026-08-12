-- RenameColumn
-- Prisma model change:
-- - Transfer.payment -> Transfer.paymentMethode
-- - Transfer.billingParty -> Transfer.payingParty
ALTER TABLE "Transfer" RENAME COLUMN "payment" TO "paymentMethode";
ALTER TABLE "Transfer" RENAME COLUMN "billingParty" TO "payingParty";

