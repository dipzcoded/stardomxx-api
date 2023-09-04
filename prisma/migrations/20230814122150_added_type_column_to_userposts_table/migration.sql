/*
  Warnings:

  - Added the required column `type` to the `userPosts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userPosts" ADD COLUMN     "type" TEXT NOT NULL;
