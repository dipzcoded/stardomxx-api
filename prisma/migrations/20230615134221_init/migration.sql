-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "matricNumber" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userOtpToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "expireTime" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "userOtpToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passwordResetToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expireTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passwordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "passportImage" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address2" TEXT,
    "town" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userNextOfKin" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "passportImage" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address2" TEXT,
    "town" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "userNextOfKin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userEmergencyContact" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "passportImage" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address2" TEXT,
    "town" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "userEmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userPosts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,

    CONSTRAINT "userPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amountWinning" INTEGER NOT NULL,
    "maxContestant" INTEGER NOT NULL DEFAULT 100,
    "noFreewildCards" INTEGER NOT NULL DEFAULT 2,
    "prize" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "duration" TEXT NOT NULL DEFAULT '3 Weeks',
    "durationExpiration" BIGINT NOT NULL,

    CONSTRAINT "contests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userOtpToken_userId_key" ON "userOtpToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "passwordResetToken_userId_key" ON "passwordResetToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_userId_key" ON "profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "userNextOfKin_profileId_key" ON "userNextOfKin"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "userEmergencyContact_profileId_key" ON "userEmergencyContact"("profileId");

-- AddForeignKey
ALTER TABLE "userOtpToken" ADD CONSTRAINT "userOtpToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passwordResetToken" ADD CONSTRAINT "passwordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userNextOfKin" ADD CONSTRAINT "userNextOfKin_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userEmergencyContact" ADD CONSTRAINT "userEmergencyContact_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPosts" ADD CONSTRAINT "userPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
