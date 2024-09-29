/*
  Warnings:

  - You are about to drop the column `Voting_Type_id` on the `Idea_Product` table. All the data in the column will be lost.
  - You are about to drop the column `Voting_Type_id` on the `Miscellaneous` table. All the data in the column will be lost.
  - Added the required column `Voting_Type` to the `Idea_Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Voting_Type` to the `Miscellaneous` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Voting_Type` to the `UI_UX_Design` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Voting_Type` to the `Youtube_Thumbnail` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Voting_Types" AS ENUM ('Rating_Scale', 'Emoji_Reaction', 'Upvote_Downvote', 'Poll');

-- DropForeignKey
ALTER TABLE "Idea_Product" DROP CONSTRAINT "Idea_Product_Voting_Type_id_fkey";

-- DropForeignKey
ALTER TABLE "Miscellaneous" DROP CONSTRAINT "Miscellaneous_Voting_Type_id_fkey";

-- AlterTable
ALTER TABLE "Idea_Product" DROP COLUMN "Voting_Type_id",
ADD COLUMN     "Voting_Type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Miscellaneous" DROP COLUMN "Voting_Type_id",
ADD COLUMN     "Voting_Type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "Voting_Type_id" INTEGER;

-- AlterTable
ALTER TABLE "UI_UX_Design" ADD COLUMN     "Voting_Type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Voting_Type" ADD COLUMN     "emoji_ReactionId" INTEGER,
ADD COLUMN     "pollId" INTEGER,
ADD COLUMN     "rating_ScaleId" INTEGER,
ADD COLUMN     "upvote_DownvoteId" INTEGER;

-- AlterTable
ALTER TABLE "Youtube_Thumbnail" ADD COLUMN     "Voting_Type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Rating_Scale" (
    "id" SERIAL NOT NULL,
    "Five_Star" TEXT NOT NULL DEFAULT '★★★★★',
    "Four_Star" TEXT NOT NULL DEFAULT '★★★★',
    "Three_Star" TEXT NOT NULL DEFAULT '★★★',
    "Two_Star" TEXT NOT NULL DEFAULT '★★',
    "One_Star" TEXT NOT NULL DEFAULT '★',

    CONSTRAINT "Rating_Scale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" SERIAL NOT NULL,
    "Design_Title" TEXT NOT NULL,
    "Design_Description" TEXT,
    "Design_Url" TEXT[],

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upvote_Downvote" (
    "id" SERIAL NOT NULL,
    "Upvote" TEXT NOT NULL DEFAULT '⬆',
    "Downvote" TEXT NOT NULL DEFAULT '⬇',

    CONSTRAINT "Upvote_Downvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emoji_Reaction" (
    "id" SERIAL NOT NULL,
    "Design_Title" TEXT NOT NULL,
    "Design_Description" TEXT,
    "Design_Url" TEXT[],

    CONSTRAINT "Emoji_Reaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_Voting_Type_id_fkey" FOREIGN KEY ("Voting_Type_id") REFERENCES "Voting_Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voting_Type" ADD CONSTRAINT "Voting_Type_rating_ScaleId_fkey" FOREIGN KEY ("rating_ScaleId") REFERENCES "Rating_Scale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voting_Type" ADD CONSTRAINT "Voting_Type_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voting_Type" ADD CONSTRAINT "Voting_Type_upvote_DownvoteId_fkey" FOREIGN KEY ("upvote_DownvoteId") REFERENCES "Upvote_Downvote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voting_Type" ADD CONSTRAINT "Voting_Type_emoji_ReactionId_fkey" FOREIGN KEY ("emoji_ReactionId") REFERENCES "Emoji_Reaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
