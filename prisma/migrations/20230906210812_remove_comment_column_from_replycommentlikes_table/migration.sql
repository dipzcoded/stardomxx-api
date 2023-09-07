/*
  Warnings:

  - You are about to drop the column `comment` on the `userpostcommenttreplylikes` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[userpostcommenttreplylikes] DROP COLUMN [comment];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
