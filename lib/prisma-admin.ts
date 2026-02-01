import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adminPrismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({ adapter });
};

declare global {
  var adminPrisma: undefined | ReturnType<typeof adminPrismaClientSingleton>;
}

const adminPrisma = globalThis.adminPrisma ?? adminPrismaClientSingleton();

export default adminPrisma;

if (process.env.NODE_ENV !== "production") globalThis.adminPrisma = adminPrisma;
