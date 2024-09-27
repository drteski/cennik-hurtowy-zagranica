/*
  Warnings:

  - You are about to drop the `ProductPrices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductPrices" DROP CONSTRAINT "ProductPrices_productId_fkey";

-- DropTable
DROP TABLE "ProductPrices";

-- CreateTable
CREATE TABLE "ProductPrice" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "oldPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "newPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductPrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
