-- CreateEnum
CREATE TYPE "Species" AS ENUM ('DOG', 'CAT', 'OTHER');

-- CreateEnum
CREATE TYPE "Assessment" AS ENUM ('GOOD', 'MIXED', 'DIFFICULT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "age" INTEGER,
    "birthDate" TIMESTAMP(3),
    "gender" "Gender" NOT NULL,
    "species" "Species" NOT NULL,
    "otherSpecies" TEXT,
    "type" TEXT,
    "isIdentified" BOOLEAN,
    "diet" TEXT,
    "treatsAllowed" BOOLEAN,
    "temperamentNotes" TEXT,
    "childFriendly" "Assessment",
    "dogFriendly" "Assessment",
    "trafficTolerance" "Assessment",
    "socializationNotes" TEXT,
    "fears" TEXT,
    "sensitiveAreas" TEXT,
    "healthIssues" BOOLEAN,
    "careInstructions" TEXT,
    "additionalNotes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
