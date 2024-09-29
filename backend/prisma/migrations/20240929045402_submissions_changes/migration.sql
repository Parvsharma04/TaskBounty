/*
  Warnings:

  - You are about to drop the column `option_id` on the `Submission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_option_id_fkey";

-- AlterTable
ALTER TABLE "Idea_Product" ADD COLUMN     "Responses" JSONB NOT NULL DEFAULT '[{"id": "worker_id", "value": "Five_Star"}]';

-- AlterTable
ALTER TABLE "Miscellaneous" ADD COLUMN     "Responses" JSONB NOT NULL DEFAULT '[{"id": "worker_id", "value": "Five_Star"}]';

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "option_id";

-- AlterTable
ALTER TABLE "UI_UX_Design" ADD COLUMN     "Responses" JSONB NOT NULL DEFAULT '[{"id": "worker_id", "value": "Five_Star"}]';

-- AlterTable
ALTER TABLE "Youtube_Thumbnail" ADD COLUMN     "Responses" JSONB NOT NULL DEFAULT '[{"id": "worker_id", "value": "Five_Star"}]';
