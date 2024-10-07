/*
  Warnings:

  - The `type` column on the `Voting_Type` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Voting_Type" DROP COLUMN "type",
ADD COLUMN     "type" "Voting_Types" NOT NULL DEFAULT 'Rating_Scale';
