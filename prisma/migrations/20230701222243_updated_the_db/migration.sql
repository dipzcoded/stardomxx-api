/*
  Warnings:

  - You are about to drop the `ContestPostVote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `contestpostcomments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `contestpostlikes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `contestposts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `contests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `passwordResetToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `userEmergencyContact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `userNextOfKin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `userOtpToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `userPosts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `userfollowering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `userfollowers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `userpostcomments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `userpostlikes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `usersecretquestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContestPostVote" DROP CONSTRAINT "ContestPostVote_contestPostId_fkey";

-- DropForeignKey
ALTER TABLE "ContestPostVote" DROP CONSTRAINT "ContestPostVote_userId_fkey";

-- AlterTable
ALTER TABLE "contestpostcomments" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "contestpostlikes" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "contestposts" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "contests" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "passwordResetToken" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "userEmergencyContact" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "userNextOfKin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "userOtpToken" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "userPosts" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "userfollowering" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "userfollowers" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "userpostcomments" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "userpostlikes" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "usersecretquestion" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "ContestPostVote";

-- CreateTable
CREATE TABLE "userActivationToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userActivationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contestpostvotes" (
    "id" SERIAL NOT NULL,
    "contestPostId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contestpostvotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userActivationToken_userId_key" ON "userActivationToken"("userId");

-- AddForeignKey
ALTER TABLE "userActivationToken" ADD CONSTRAINT "userActivationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contestpostvotes" ADD CONSTRAINT "contestpostvotes_contestPostId_fkey" FOREIGN KEY ("contestPostId") REFERENCES "contestposts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contestpostvotes" ADD CONSTRAINT "contestpostvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
