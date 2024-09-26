/*
  Warnings:

  - You are about to drop the column `receipt` on the `paymentInformation` table. All the data in the column will be lost.
  - Added the required column `order_id` to the `paymentInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receipt_id` to the `paymentInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "paymentInformation" DROP COLUMN "receipt",
ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "receipt_id" TEXT NOT NULL;
