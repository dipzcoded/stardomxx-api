/*
  Warnings:

  - Added the required column `expirationinseconds` to the `passwordResetToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationinseconds` to the `userOtpToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passwordResetToken" ADD COLUMN     "expirationinseconds" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "userOtpToken" ADD COLUMN     "expirationinseconds" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "usersecretquestion" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "usersecretquestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usersecretquestion_userId_key" ON "usersecretquestion"("userId");

-- AddForeignKey
ALTER TABLE "usersecretquestion" ADD CONSTRAINT "usersecretquestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
