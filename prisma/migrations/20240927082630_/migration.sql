/*
  Warnings:

  - You are about to drop the `Email` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EmailToMailingList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EmailToMailingList" DROP CONSTRAINT "_EmailToMailingList_A_fkey";

-- DropForeignKey
ALTER TABLE "_EmailToMailingList" DROP CONSTRAINT "_EmailToMailingList_B_fkey";

-- AlterTable
ALTER TABLE "MailingList" ADD COLUMN     "emails" TEXT[];

-- DropTable
DROP TABLE "Email";

-- DropTable
DROP TABLE "_EmailToMailingList";
