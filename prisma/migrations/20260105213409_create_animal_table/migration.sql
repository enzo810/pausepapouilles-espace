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
    "image" TEXT,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "species" "Species" NOT NULL,
    "otherSpecies" TEXT,
    "type" TEXT NOT NULL,
    "isIdentified" BOOLEAN NOT NULL,
    "diet" TEXT NOT NULL,
    "treatsAllowed" BOOLEAN NOT NULL,
    "temperamentNotes" TEXT NOT NULL,
    "childFriendly" "Assessment" NOT NULL,
    "dogFriendly" "Assessment" NOT NULL,
    "trafficTolerance" "Assessment" NOT NULL,
    "socializationNotes" TEXT NOT NULL,
    "fears" TEXT NOT NULL,
    "sensitiveAreas" TEXT NOT NULL,
    "healthIssues" BOOLEAN NOT NULL,
    "careInstructions" TEXT NOT NULL,
    "additionalNotes" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalTemperament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AnimalTemperament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnimalToAnimalTemperament" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AnimalToAnimalTemperament_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AnimalToAnimalTemperament_B_index" ON "_AnimalToAnimalTemperament"("B");

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalTemperament" ADD CONSTRAINT "AnimalTemperament_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimalToAnimalTemperament" ADD CONSTRAINT "_AnimalToAnimalTemperament_A_fkey" FOREIGN KEY ("A") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimalToAnimalTemperament" ADD CONSTRAINT "_AnimalToAnimalTemperament_B_fkey" FOREIGN KEY ("B") REFERENCES "AnimalTemperament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
