/*
  Warnings:

  - You are about to drop the column `countryId` on the `UserProducts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserProducts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProducts" DROP CONSTRAINT "UserProducts_countryId_fkey";

-- DropForeignKey
ALTER TABLE "UserProducts" DROP CONSTRAINT "UserProducts_userId_fkey";

-- AlterTable
ALTER TABLE "UserProducts" DROP COLUMN "countryId",
DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_UserToUserProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CountryToUserProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserProducts_AB_unique" ON "_UserToUserProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserProducts_B_index" ON "_UserToUserProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CountryToUserProducts_AB_unique" ON "_CountryToUserProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_CountryToUserProducts_B_index" ON "_CountryToUserProducts"("B");

-- AddForeignKey
ALTER TABLE "_UserToUserProducts" ADD CONSTRAINT "_UserToUserProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserProducts" ADD CONSTRAINT "_UserToUserProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryToUserProducts" ADD CONSTRAINT "_CountryToUserProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryToUserProducts" ADD CONSTRAINT "_CountryToUserProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
