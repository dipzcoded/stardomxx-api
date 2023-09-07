BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[userPosts] ALTER COLUMN [userId] INT NULL;

-- CreateTable
CREATE TABLE [dbo].[Contestant] (
    [id] INT NOT NULL IDENTITY(1,1),
    [contestId] INT NOT NULL,
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Contestant_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Contestant_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[contestantvotes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [contestantId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [contestantvotes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [contestantvotes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Contestant] ADD CONSTRAINT [Contestant_contestId_fkey] FOREIGN KEY ([contestId]) REFERENCES [dbo].[contests]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Contestant] ADD CONSTRAINT [Contestant_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[contestantvotes] ADD CONSTRAINT [contestantvotes_contestantId_fkey] FOREIGN KEY ([contestantId]) REFERENCES [dbo].[Contestant]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
