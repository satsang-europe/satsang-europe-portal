-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('completed', 'failed');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('primary', 'secondary');

-- CreateEnum
CREATE TYPE "MemberCategory" AS ENUM ('initiated', 'non_initiated', 'spr');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "familyCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprMaster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importId" TEXT,

    CONSTRAINT "SprMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprFileImport" (
    "id" TEXT NOT NULL,
    "importedByAdminId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "totalRecords" INTEGER NOT NULL,
    "importedRecords" INTEGER NOT NULL,
    "status" "ImportStatus" NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SprFileImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "role" "MemberRole" NOT NULL,
    "category" "MemberCategory" NOT NULL,
    "sprId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hashedPassword" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArghyaCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hasDonations" BOOLEAN NOT NULL DEFAULT false,
    "createdByAdminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArghyaCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArghyaDonation" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "arghyaCodeId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "eurAmount" DECIMAL(12,2),
    "stripePaymentIntentId" TEXT NOT NULL,
    "status" "DonationStatus" NOT NULL,
    "receiptNumber" TEXT,
    "receiptS3Key" TEXT,
    "donatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArghyaDonation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IshtabhrityDonation" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "status" "DonationStatus" NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "eurAmount" DECIMAL(12,2),
    "receiptNumber" TEXT,
    "receiptS3Key" TEXT,
    "donatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IshtabhrityDonation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IshtabhrityEntry" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "sprNameDisplay" TEXT,
    "swastyayani" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "istavrity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "acharyavrity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "dakshina" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sangathani" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "anandabazar" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "promaniBhog" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sriMandir" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "ritwiki" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "utsav" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "centenary" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "miscellaneous" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "rowTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "rowOrder" INTEGER NOT NULL,

    CONSTRAINT "IshtabhrityEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "ipAddress" TEXT,
    "success" BOOLEAN NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Family_familyCode_key" ON "Family"("familyCode");

-- CreateIndex
CREATE UNIQUE INDEX "SprMaster_name_key" ON "SprMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE INDEX "Member_familyId_idx" ON "Member"("familyId");

-- CreateIndex
CREATE UNIQUE INDEX "ArghyaCode_code_key" ON "ArghyaCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ArghyaDonation_stripePaymentIntentId_key" ON "ArghyaDonation"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "ArghyaDonation_receiptNumber_key" ON "ArghyaDonation"("receiptNumber");

-- CreateIndex
CREATE INDEX "ArghyaDonation_familyId_idx" ON "ArghyaDonation"("familyId");

-- CreateIndex
CREATE INDEX "ArghyaDonation_memberId_idx" ON "ArghyaDonation"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "IshtabhrityDonation_stripePaymentIntentId_key" ON "IshtabhrityDonation"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "IshtabhrityDonation_receiptNumber_key" ON "IshtabhrityDonation"("receiptNumber");

-- CreateIndex
CREATE INDEX "IshtabhrityDonation_familyId_idx" ON "IshtabhrityDonation"("familyId");

-- CreateIndex
CREATE INDEX "IshtabhrityEntry_donationId_idx" ON "IshtabhrityEntry"("donationId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "LoginAttempt_identifier_attemptedAt_idx" ON "LoginAttempt"("identifier", "attemptedAt");

-- AddForeignKey
ALTER TABLE "SprMaster" ADD CONSTRAINT "SprMaster_importId_fkey" FOREIGN KEY ("importId") REFERENCES "SprFileImport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprFileImport" ADD CONSTRAINT "SprFileImport_importedByAdminId_fkey" FOREIGN KEY ("importedByAdminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_sprId_fkey" FOREIGN KEY ("sprId") REFERENCES "SprMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArghyaCode" ADD CONSTRAINT "ArghyaCode_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArghyaDonation" ADD CONSTRAINT "ArghyaDonation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArghyaDonation" ADD CONSTRAINT "ArghyaDonation_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArghyaDonation" ADD CONSTRAINT "ArghyaDonation_arghyaCodeId_fkey" FOREIGN KEY ("arghyaCodeId") REFERENCES "ArghyaCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IshtabhrityDonation" ADD CONSTRAINT "IshtabhrityDonation_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IshtabhrityEntry" ADD CONSTRAINT "IshtabhrityEntry_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "IshtabhrityDonation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IshtabhrityEntry" ADD CONSTRAINT "IshtabhrityEntry_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
