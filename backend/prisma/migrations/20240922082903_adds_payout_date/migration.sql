/*
  Warnings:

  - You are about to drop the column `user_id` on the `Payouts` table. All the data in the column will be lost.
  - Added the required column `month` to the `Payouts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worker_id` to the `Payouts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Payouts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payouts" DROP CONSTRAINT "Payouts_user_id_fkey";

-- AlterTable
ALTER TABLE "Payouts" DROP COLUMN "user_id",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "worker_id" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
ALTER COLUMN "signature" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Payouts_worker_id_idx" ON "Payouts"("worker_id");

-- AddForeignKey
ALTER TABLE "Payouts" ADD CONSTRAINT "Payouts_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
