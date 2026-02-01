import { PrismaClient } from "@/generated/prisma/client";
import { ExtendedPrismaClient } from "@/types/Prisma";
import { PrismaPg } from "@prisma/adapter-pg";

export const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({ adapter }).$extends({});
};

declare global {
  var prisma: undefined | ExtendedPrismaClient;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
