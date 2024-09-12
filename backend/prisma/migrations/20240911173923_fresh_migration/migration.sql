/*
  Warnings:

  - Added the required column `postDate` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postMonth` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postYear` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "postDate" INTEGER NOT NULL,
ADD COLUMN     "postMonth" INTEGER NOT NULL,
ADD COLUMN     "postYear" INTEGER NOT NULL;
