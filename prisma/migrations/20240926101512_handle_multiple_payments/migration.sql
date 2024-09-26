/*
  Warnings:

  - The required column `id` was added to the `paymentInformation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "paymentInformation_userId_key";

-- AlterTable
ALTER TABLE "paymentInformation" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "paymentInformation_pkey" PRIMARY KEY ("id");
