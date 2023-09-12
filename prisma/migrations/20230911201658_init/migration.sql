BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[userfollowering] DROP CONSTRAINT [userfollowering_userId_key];

-- DropIndex
ALTER TABLE [dbo].[userfollowers] DROP CONSTRAINT [userfollowers_userId_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
