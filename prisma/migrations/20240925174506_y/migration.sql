/*
  Warnings:

  - You are about to drop the column `newPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `oldPrice` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productId` to the `ProductPrices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "newPrice",
DROP COLUMN "oldPrice";

-- AlterTable
ALTER TABLE "ProductPrices" ADD COLUMN     "productId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductPrices" ADD CONSTRAINT "ProductPrices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
