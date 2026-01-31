import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { globalForPrisma } from "./prisma";

export const prismaAdmin =
  globalForPrisma.prismaAdmin ??
  (() => {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn"] : ["warn"],
    });
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaAdmin = prismaAdmin;
}

export default prismaAdmin;
