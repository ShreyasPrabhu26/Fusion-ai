/*
  Warnings:

  - You are about to drop the column `tokens` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "tokens",
ADD COLUMN     "tokenLimit" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "usedTokens" INTEGER NOT NULL DEFAULT 0;
