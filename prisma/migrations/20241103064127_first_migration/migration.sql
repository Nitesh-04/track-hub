-- CreateEnum
CREATE TYPE "Status" AS ENUM ('upcoming', 'completed');

-- DropEnum
DROP TYPE IF EXISTS "crdb_internal_region"; -- or remove if not needed

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "clerkid" STRING NOT NULL,
    "email" STRING NOT NULL,
    "name" STRING NOT NULL,
    "githubid" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" STRING NOT NULL,
    "companyName" STRING NOT NULL,
    "stipend" INT4,
    "ctc" INT4,
    "role" STRING NOT NULL,
    "location" STRING NOT NULL,
    "link" STRING,
    "notifications" BOOL NOT NULL DEFAULT true,
    "userId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" STRING NOT NULL,
    "roundTitle" STRING NOT NULL,
    "roundDateTime" TIMESTAMP(3) NOT NULL,
    "venue" STRING NOT NULL,
    "roundLink" STRING,
    "status" "Status" NOT NULL,  -- Keep this if the ENUM is already defined
    "applicationId" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkid_key" ON "User"("clerkid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- CreateIndex
CREATE INDEX "Round_applicationId_idx" ON "Round"("applicationId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkid") ON DELETE CASCADE ON UPDATE CASCADE;
