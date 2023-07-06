/*
  Warnings:

  - Added the required column `secretKey` to the `userOtpToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userOtpToken" ADD COLUMN     "secretKey" TEXT NOT NULL;
