/*
  Warnings:

  - You are about to drop the column `title` on the `userPosts` table. All the data in the column will be lost.
  - Made the column `content` on table `userPosts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "userPosts" DROP COLUMN "title",
ALTER COLUMN "content" SET NOT NULL;

-- CreateTable
CREATE TABLE "userfollowers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "userfollowers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userfollowering" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "userfollowering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userpostcomments" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "userpostcomments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userpostlikes" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "userpostlikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contestposts" (
    "id" SERIAL NOT NULL,
    "contestId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "contestposts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contestpostcomments" (
    "id" SERIAL NOT NULL,
    "contestPostId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "contestpostcomments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contestpostlikes" (
    "id" SERIAL NOT NULL,
    "contestPostId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "contestpostlikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestPostVote" (
    "id" SERIAL NOT NULL,
    "contestPostId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ContestPostVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Followers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Following" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Followers_AB_unique" ON "_Followers"("A", "B");

-- CreateIndex
CREATE INDEX "_Followers_B_index" ON "_Followers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Following_AB_unique" ON "_Following"("A", "B");

-- CreateIndex
CREATE INDEX "_Following_B_index" ON "_Following"("B");

-- AddForeignKey
ALTER TABLE "userpostcomments" ADD CONSTRAINT "userpostcomments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "userPosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userpostcomments" ADD CONSTRAINT "userpostcomments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userpostlikes" ADD CONSTRAINT "userpostlikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "userPosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userpostlikes" ADD CONSTRAINT "userpostlikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contestposts" ADD CONSTRAINT "contestposts_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contestposts" ADD CONSTRAINT "contestposts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contestpostcomments" ADD CONSTRAINT "contestpostcomments_contestPostId_fkey" FOREIGN KEY ("contestPostId") REFERENCES "contestposts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contestpostcomments" ADD CONSTRAINT "contestpostcomments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contestpostlikes" ADD CONSTRAINT "contestpostlikes_contestPostId_fkey" FOREIGN KEY ("contestPostId") REFERENCES "contestposts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contestpostlikes" ADD CONSTRAINT "contestpostlikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestPostVote" ADD CONSTRAINT "ContestPostVote_contestPostId_fkey" FOREIGN KEY ("contestPostId") REFERENCES "contestposts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestPostVote" ADD CONSTRAINT "ContestPostVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Followers" ADD CONSTRAINT "_Followers_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Followers" ADD CONSTRAINT "_Followers_B_fkey" FOREIGN KEY ("B") REFERENCES "userfollowers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Following" ADD CONSTRAINT "_Following_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Following" ADD CONSTRAINT "_Following_B_fkey" FOREIGN KEY ("B") REFERENCES "userfollowering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
