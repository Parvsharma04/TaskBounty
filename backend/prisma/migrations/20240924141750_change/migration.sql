/*
  Warnings:

  - You are about to drop the column `MiscellaneousDesignUrls_id` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `MiscellaneousImages_id` on the `Option` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_MiscellaneousDesignUrls_id_fkey";

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_MiscellaneousImages_id_fkey";

-- AlterTable
ALTER TABLE "Miscellaneous" ADD COLUMN     "Design_Url" TEXT[],
ADD COLUMN     "Images" TEXT[];

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "MiscellaneousDesignUrls_id",
DROP COLUMN "MiscellaneousImages_id",
ADD COLUMN     "Miscellaneous_id" INTEGER,
ADD COLUMN     "website_url" TEXT,
ALTER COLUMN "image_url" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_Miscellaneous_id_fkey" FOREIGN KEY ("Miscellaneous_id") REFERENCES "Miscellaneous"("id") ON DELETE SET NULL ON UPDATE CASCADE;
