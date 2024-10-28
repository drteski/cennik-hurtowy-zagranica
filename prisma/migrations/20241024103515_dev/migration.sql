/*
  Warnings:

  - You are about to drop the column `newPrice` on the `PriceHistory` table. All the data in the column will be lost.
  - You are about to drop the column `oldPrice` on the `PriceHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PriceHistory" DROP COLUMN "newPrice",
DROP COLUMN "oldPrice";
