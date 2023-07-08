/*
  Warnings:

  - You are about to drop the column `expireTime` on the `passwordResetToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "passwordResetToken" DROP COLUMN "expireTime";
