-- DropForeignKey
ALTER TABLE "Animal" DROP CONSTRAINT "Animal_userId_fkey";

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
