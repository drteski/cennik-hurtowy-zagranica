/*
  Warnings:

  - You are about to drop the column `productId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productId",
DROP COLUMN "variantId",
ADD COLUMN     "newPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "oldPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
