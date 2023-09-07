/*
  Warnings:

  - You are about to drop the column `commentId` on the `userpostcommentlikes` table. All the data in the column will be lost.
  - You are about to drop the column `commentReplyId` on the `userpostcommenttreplylikes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[commentId]` on the table `userpostcomments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postCommentId` to the `userpostcommentlikes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postCommentReplyId` to the `userpostcommenttreplylikes` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[userpostcommentlikes] DROP CONSTRAINT [userpostcommentlikes_commentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[userpostcommenttreplylikes] DROP CONSTRAINT [userpostcommenttreplylikes_commentReplyId_fkey];

-- AlterTable
ALTER TABLE [dbo].[usercomments] ADD [mediaContent] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[userpostcommentlikes] DROP COLUMN [commentId];
ALTER TABLE [dbo].[userpostcommentlikes] ADD [postCommentId] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[userpostcommenttreplylikes] DROP COLUMN [commentReplyId];
ALTER TABLE [dbo].[userpostcommenttreplylikes] ADD [postCommentReplyId] INT NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[userpostcomments] ADD CONSTRAINT [userpostcomments_commentId_key] UNIQUE NONCLUSTERED ([commentId]);

-- AddForeignKey
ALTER TABLE [dbo].[userpostcommentlikes] ADD CONSTRAINT [userpostcommentlikes_postCommentId_fkey] FOREIGN KEY ([postCommentId]) REFERENCES [dbo].[userpostcomments]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcommenttreplylikes] ADD CONSTRAINT [userpostcommenttreplylikes_postCommentReplyId_fkey] FOREIGN KEY ([postCommentReplyId]) REFERENCES [dbo].[userpostcommenttreply]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
