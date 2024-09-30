/*
  Warnings:

  - The `variantIds` column on the `ExcludeProducts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ExcludeProducts" DROP COLUMN "variantIds",
ADD COLUMN     "variantIds" INTEGER[];
