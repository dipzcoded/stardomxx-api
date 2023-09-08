BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000),
    [country] NVARCHAR(1000),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000),
    [phoneNumber] NVARCHAR(1000),
    [isVerified] BIT NOT NULL CONSTRAINT [user_isVerified_df] DEFAULT 0,
    [isActivated] BIT NOT NULL CONSTRAINT [user_isActivated_df] DEFAULT 0,
    [isSuperAdmin] BIT NOT NULL CONSTRAINT [user_isSuperAdmin_df] DEFAULT 0,
    [role] NVARCHAR(1000) NOT NULL,
    [profilePicture] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [user_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[usersecretquestion] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [question] NVARCHAR(1000) NOT NULL,
    [answer] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [usersecretquestion_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [usersecretquestion_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [usersecretquestion_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[userOtpToken] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [expireTime] DATETIME2 NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [secretKey] NVARCHAR(1000) NOT NULL,
    [expirationinseconds] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userOtpToken_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userOtpToken_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [userOtpToken_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[userActivationToken] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userActivationToken_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userActivationToken_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [userActivationToken_userId_key] UNIQUE NONCLUSTERED ([userId]),
    CONSTRAINT [userActivationToken_token_key] UNIQUE NONCLUSTERED ([token])
);

-- CreateTable
CREATE TABLE [dbo].[passwordResetToken] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [expirationinseconds] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [passwordResetToken_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [passwordResetToken_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [passwordResetToken_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[profile] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [passportImage] NVARCHAR(1000),
    [address] NVARCHAR(1000) NOT NULL,
    [address2] NVARCHAR(1000),
    [town] NVARCHAR(1000) NOT NULL,
    [state] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [profile_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [profile_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [profile_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[userNextOfKin] (
    [id] INT NOT NULL IDENTITY(1,1),
    [profileId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [passportImage] NVARCHAR(1000) NOT NULL,
    [relationshipType] NVARCHAR(1000) NOT NULL,
    [phoneNumber] NVARCHAR(1000) NOT NULL,
    [address] NVARCHAR(1000) NOT NULL,
    [address2] NVARCHAR(1000),
    [town] NVARCHAR(1000) NOT NULL,
    [state] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userNextOfKin_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userNextOfKin_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [userNextOfKin_profileId_key] UNIQUE NONCLUSTERED ([profileId])
);

-- CreateTable
CREATE TABLE [dbo].[userEmergencyContact] (
    [id] INT NOT NULL IDENTITY(1,1),
    [profileId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [passportImage] NVARCHAR(1000) NOT NULL,
    [relationshipType] NVARCHAR(1000) NOT NULL,
    [phoneNumber] NVARCHAR(1000) NOT NULL,
    [address] NVARCHAR(1000) NOT NULL,
    [address2] NVARCHAR(1000),
    [town] NVARCHAR(1000) NOT NULL,
    [state] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userEmergencyContact_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userEmergencyContact_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [userEmergencyContact_profileId_key] UNIQUE NONCLUSTERED ([profileId])
);

-- CreateTable
CREATE TABLE [dbo].[userfollowers] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userfollowers_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userfollowers_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[userfollowering] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userfollowering_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userfollowering_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[userPosts] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT,
    [contestId] INT,
    [content] NVARCHAR(1000),
    [mediaContent] NVARCHAR(1000),
    [type] NVARCHAR(1000) NOT NULL,
    [isContestPost] BIT NOT NULL CONSTRAINT [userPosts_isContestPost_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userPosts_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userPosts_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[usercomments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [comment] NVARCHAR(1000) NOT NULL,
    [mediaContent] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [usercomments_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [usercomments_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[userpostcomments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postId] INT NOT NULL,
    [commentId] INT NOT NULL,
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userpostcomments_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userpostcomments_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [userpostcomments_commentId_key] UNIQUE NONCLUSTERED ([commentId])
);

-- CreateTable
CREATE TABLE [dbo].[userpostcommenttreply] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postCommentId] INT NOT NULL,
    [commentReplyId] INT NOT NULL,
    [commentId] INT NOT NULL,
    [userId] INT NOT NULL,
    [comment] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userpostcommenttreply_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userpostcommenttreply_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [userpostcommenttreply_commentReplyId_key] UNIQUE NONCLUSTERED ([commentReplyId])
);

-- CreateTable
CREATE TABLE [dbo].[userpostlikes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postId] INT NOT NULL,
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userpostlikes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userpostlikes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[userpostcommentlikes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postCommentId] INT NOT NULL,
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userpostcommentlikes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userpostcommentlikes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[userpostcommenttreplylikes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postCommentReplyId] INT NOT NULL,
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userpostcommenttreplylikes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [userpostcommenttreplylikes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[contests] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [maxContestant] INT NOT NULL CONSTRAINT [contests_maxContestant_df] DEFAULT 100,
    [noFreeWildCards] INT NOT NULL CONSTRAINT [contests_noFreeWildCards_df] DEFAULT 2,
    [isCompetitionOn] BIT NOT NULL CONSTRAINT [contests_isCompetitionOn_df] DEFAULT 0,
    [isOpenForEntry] BIT NOT NULL CONSTRAINT [contests_isOpenForEntry_df] DEFAULT 1,
    [prize] INT NOT NULL,
    [category] NVARCHAR(1000) NOT NULL,
    [startDate] DATETIME2 NOT NULL,
    [endDate] DATETIME2 NOT NULL,
    [durationExpiration] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [contests_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [contests_pkey] PRIMARY KEY CLUSTERED ([id])
);

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
CREATE TABLE [dbo].[contestpostvotes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [contestPostId] INT NOT NULL,
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [contestpostvotes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [contestpostvotes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[contestantvotes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [contestantId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [contestantvotes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [contestantvotes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_Followers] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_Followers_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_Following] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_Following_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Followers_B_index] ON [dbo].[_Followers]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Following_B_index] ON [dbo].[_Following]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[usersecretquestion] ADD CONSTRAINT [usersecretquestion_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userOtpToken] ADD CONSTRAINT [userOtpToken_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userActivationToken] ADD CONSTRAINT [userActivationToken_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[passwordResetToken] ADD CONSTRAINT [passwordResetToken_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[profile] ADD CONSTRAINT [profile_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userNextOfKin] ADD CONSTRAINT [userNextOfKin_profileId_fkey] FOREIGN KEY ([profileId]) REFERENCES [dbo].[profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userEmergencyContact] ADD CONSTRAINT [userEmergencyContact_profileId_fkey] FOREIGN KEY ([profileId]) REFERENCES [dbo].[profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userPosts] ADD CONSTRAINT [userPosts_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userPosts] ADD CONSTRAINT [userPosts_contestId_fkey] FOREIGN KEY ([contestId]) REFERENCES [dbo].[contests]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[usercomments] ADD CONSTRAINT [usercomments_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcomments] ADD CONSTRAINT [userpostcomments_postId_fkey] FOREIGN KEY ([postId]) REFERENCES [dbo].[userPosts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcomments] ADD CONSTRAINT [userpostcomments_commentId_fkey] FOREIGN KEY ([commentId]) REFERENCES [dbo].[usercomments]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcomments] ADD CONSTRAINT [userpostcomments_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcommenttreply] ADD CONSTRAINT [userpostcommenttreply_commentReplyId_fkey] FOREIGN KEY ([commentReplyId]) REFERENCES [dbo].[usercomments]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcommenttreply] ADD CONSTRAINT [userpostcommenttreply_postCommentId_fkey] FOREIGN KEY ([postCommentId]) REFERENCES [dbo].[userpostcomments]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcommenttreply] ADD CONSTRAINT [userpostcommenttreply_commentId_fkey] FOREIGN KEY ([commentId]) REFERENCES [dbo].[usercomments]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcommenttreply] ADD CONSTRAINT [userpostcommenttreply_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[userpostlikes] ADD CONSTRAINT [userpostlikes_postId_fkey] FOREIGN KEY ([postId]) REFERENCES [dbo].[userPosts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userpostlikes] ADD CONSTRAINT [userpostlikes_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcommentlikes] ADD CONSTRAINT [userpostcommentlikes_postCommentId_fkey] FOREIGN KEY ([postCommentId]) REFERENCES [dbo].[userpostcomments]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcommentlikes] ADD CONSTRAINT [userpostcommentlikes_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcommenttreplylikes] ADD CONSTRAINT [userpostcommenttreplylikes_postCommentReplyId_fkey] FOREIGN KEY ([postCommentReplyId]) REFERENCES [dbo].[userpostcommenttreply]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[userpostcommenttreplylikes] ADD CONSTRAINT [userpostcommenttreplylikes_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Contestant] ADD CONSTRAINT [Contestant_contestId_fkey] FOREIGN KEY ([contestId]) REFERENCES [dbo].[contests]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Contestant] ADD CONSTRAINT [Contestant_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[contestpostvotes] ADD CONSTRAINT [contestpostvotes_contestPostId_fkey] FOREIGN KEY ([contestPostId]) REFERENCES [dbo].[userPosts]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[contestpostvotes] ADD CONSTRAINT [contestpostvotes_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[contestantvotes] ADD CONSTRAINT [contestantvotes_contestantId_fkey] FOREIGN KEY ([contestantId]) REFERENCES [dbo].[Contestant]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Followers] ADD CONSTRAINT [_Followers_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Followers] ADD CONSTRAINT [_Followers_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[userfollowers]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Following] ADD CONSTRAINT [_Following_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Following] ADD CONSTRAINT [_Following_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[userfollowering]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
