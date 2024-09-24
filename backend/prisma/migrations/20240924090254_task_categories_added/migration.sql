/*
  Warnings:

  - You are about to drop the column `task_id` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('UI_UX_Design', 'Idea_Product', 'Youtube_Thumbnail', 'Miscellaneous');

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_task_id_fkey";

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "task_id",
ADD COLUMN     "Idea_Product_id" INTEGER,
ADD COLUMN     "MiscellaneousDesignUrls_id" INTEGER,
ADD COLUMN     "MiscellaneousImages_id" INTEGER,
ADD COLUMN     "Youtube_Thumbnail_id" INTEGER;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "title",
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'Miscellaneous',
ADD COLUMN     "ideaProduct_id" INTEGER,
ADD COLUMN     "miscellaneous_id" INTEGER,
ADD COLUMN     "uiUxDesign_id" INTEGER,
ADD COLUMN     "youtubeThumbnail_id" INTEGER;

-- CreateTable
CREATE TABLE "UI_UX_Design" (
    "id" SERIAL NOT NULL,
    "Design_Title" TEXT NOT NULL,
    "Design_Description" TEXT,
    "Design_Url" TEXT NOT NULL,

    CONSTRAINT "UI_UX_Design_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea_Product" (
    "id" SERIAL NOT NULL,
    "Idea_Title" TEXT NOT NULL,
    "Idea_Description" TEXT,
    "Voting_Type_id" INTEGER NOT NULL,

    CONSTRAINT "Idea_Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Youtube_Thumbnail" (
    "id" SERIAL NOT NULL,
    "Youtube_Thumbnail_Title" TEXT NOT NULL,

    CONSTRAINT "Youtube_Thumbnail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Miscellaneous" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Voting_Type_id" INTEGER NOT NULL,

    CONSTRAINT "Miscellaneous_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voting_Type" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Voting_Type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_uiUxDesign_id_fkey" FOREIGN KEY ("uiUxDesign_id") REFERENCES "UI_UX_Design"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_ideaProduct_id_fkey" FOREIGN KEY ("ideaProduct_id") REFERENCES "Idea_Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_youtubeThumbnail_id_fkey" FOREIGN KEY ("youtubeThumbnail_id") REFERENCES "Youtube_Thumbnail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_miscellaneous_id_fkey" FOREIGN KEY ("miscellaneous_id") REFERENCES "Miscellaneous"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea_Product" ADD CONSTRAINT "Idea_Product_Voting_Type_id_fkey" FOREIGN KEY ("Voting_Type_id") REFERENCES "Voting_Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Miscellaneous" ADD CONSTRAINT "Miscellaneous_Voting_Type_id_fkey" FOREIGN KEY ("Voting_Type_id") REFERENCES "Voting_Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_Idea_Product_id_fkey" FOREIGN KEY ("Idea_Product_id") REFERENCES "Idea_Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_Youtube_Thumbnail_id_fkey" FOREIGN KEY ("Youtube_Thumbnail_id") REFERENCES "Youtube_Thumbnail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_MiscellaneousImages_id_fkey" FOREIGN KEY ("MiscellaneousImages_id") REFERENCES "Miscellaneous"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_MiscellaneousDesignUrls_id_fkey" FOREIGN KEY ("MiscellaneousDesignUrls_id") REFERENCES "Miscellaneous"("id") ON DELETE SET NULL ON UPDATE CASCADE;
