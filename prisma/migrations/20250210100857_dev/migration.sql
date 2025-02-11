/*
  Warnings:

  - You are about to drop the `ProductName` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductPrice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductName" DROP CONSTRAINT "ProductName_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductPrice" DROP CONSTRAINT "ProductPrice_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "names" JSONB[],
ADD COLUMN     "prices" JSONB[];

-- AlterTable
ALTER TABLE "_CountryToUser" ADD CONSTRAINT "_CountryToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CountryToUser_AB_unique";

-- AlterTable
ALTER TABLE "_CountryToUserProducts" ADD CONSTRAINT "_CountryToUserProducts_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CountryToUserProducts_AB_unique";

-- AlterTable
ALTER TABLE "_UserToUserProducts" ADD CONSTRAINT "_UserToUserProducts_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserToUserProducts_AB_unique";

-- DropTable
DROP TABLE "ProductName";

-- DropTable
DROP TABLE "ProductPrice";
