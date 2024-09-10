/*
  Warnings:

  - You are about to drop the column `date` on the `Task` table. All the data in the column will be lost.
  - Added the required column `postDate` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postMonth` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postYear` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "date",
ADD COLUMN     "postDate" INTEGER NOT NULL,
ADD COLUMN     "postMonth" INTEGER NOT NULL,
ADD COLUMN     "postYear" INTEGER NOT NULL;
