/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `userActivationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userActivationToken_token_key" ON "userActivationToken"("token");
