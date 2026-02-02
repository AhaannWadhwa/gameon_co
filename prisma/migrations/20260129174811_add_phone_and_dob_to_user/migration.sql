/*
  Warnings:

  - You are about to drop the column `otpExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpHash` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "otpExpiry",
DROP COLUMN "otpHash",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
