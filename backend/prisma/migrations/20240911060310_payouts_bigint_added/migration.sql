/*
  Warnings:

  - The primary key for the `Payouts` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Payouts" DROP CONSTRAINT "Payouts_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGSERIAL,
ALTER COLUMN "amount" SET DATA TYPE BIGINT,
ADD CONSTRAINT "Payouts_pkey" PRIMARY KEY ("id");
