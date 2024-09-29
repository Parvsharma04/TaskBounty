/*
  Warnings:

  - The `worker_id` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "worker_id",
ADD COLUMN     "worker_id" JSONB[];
