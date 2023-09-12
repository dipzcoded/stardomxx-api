/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `userfollowering` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `userfollowers` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[userfollowering] ADD CONSTRAINT [userfollowering_userId_key] UNIQUE NONCLUSTERED ([userId]);

-- CreateIndex
ALTER TABLE [dbo].[userfollowers] ADD CONSTRAINT [userfollowers_userId_key] UNIQUE NONCLUSTERED ([userId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
