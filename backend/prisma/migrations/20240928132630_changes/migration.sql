/*
  Warnings:

  - You are about to drop the column `Design_Description` on the `Emoji_Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `Design_Title` on the `Emoji_Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `Design_Url` on the `Emoji_Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `Design_Description` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the column `Design_Title` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the column `Design_Url` on the `Poll` table. All the data in the column will be lost.
  - Added the required column `option1` to the `Poll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option2` to the `Poll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option3` to the `Poll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option4` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Emoji_Reaction" DROP COLUMN "Design_Description",
DROP COLUMN "Design_Title",
DROP COLUMN "Design_Url",
ADD COLUMN     "Emoji_1" TEXT NOT NULL DEFAULT '😍',
ADD COLUMN     "Emoji_2" TEXT NOT NULL DEFAULT '😂',
ADD COLUMN     "Emoji_3" TEXT NOT NULL DEFAULT '😲',
ADD COLUMN     "Emoji_4" TEXT NOT NULL DEFAULT '😡';

-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "Design_Description",
DROP COLUMN "Design_Title",
DROP COLUMN "Design_Url",
ADD COLUMN     "option1" TEXT NOT NULL,
ADD COLUMN     "option2" TEXT NOT NULL,
ADD COLUMN     "option3" TEXT NOT NULL,
ADD COLUMN     "option4" TEXT NOT NULL;
