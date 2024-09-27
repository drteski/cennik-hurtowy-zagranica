/*
  Warnings:

  - You are about to drop the `Password` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `Country` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_countryId_fkey";

-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "Password";
