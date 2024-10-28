/*
  Warnings:

  - Added the required column `newPrice` to the `PriceHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldPrice` to the `PriceHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PriceHistory" ADD COLUMN     "newPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "oldPrice" DOUBLE PRECISION NOT NULL;
