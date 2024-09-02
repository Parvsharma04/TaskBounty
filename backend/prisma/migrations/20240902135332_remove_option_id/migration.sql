/*
  Warnings:

  - You are about to drop the column `image_url` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `done` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Payouts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `option_id` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance_id` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payouts" DROP CONSTRAINT "Payouts_user_id_fkey";

-- DropIndex
DROP INDEX "Submission_worker_id_task_id_key";

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "image_url",
ADD COLUMN     "option_id" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "amount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "done",
ALTER COLUMN "amount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "balance_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Payouts";

-- DropEnum
DROP TYPE "TxnStatus";
