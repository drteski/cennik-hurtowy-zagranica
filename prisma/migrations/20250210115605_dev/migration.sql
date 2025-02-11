/*
  Warnings:

  - You are about to drop the `PriceChanges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PriceChanges" DROP CONSTRAINT "PriceChanges_countryId_fkey";

-- DropTable
DROP TABLE "PriceChanges";
