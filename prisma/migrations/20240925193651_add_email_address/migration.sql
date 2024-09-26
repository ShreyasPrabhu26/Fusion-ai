/*
  Warnings:

  - A unique constraint covering the columns `[emailAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailAddress` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddress_key" ON "User"("emailAddress");
