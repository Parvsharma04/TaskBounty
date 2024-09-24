/*
  Warnings:

  - The `Design_Url` column on the `UI_UX_Design` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UI_UX_Design" DROP COLUMN "Design_Url",
ADD COLUMN     "Design_Url" TEXT[];
