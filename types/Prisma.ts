import { prismaClientSingleton } from "@/lib/prisma";

export type ExtendedPrismaClient = ReturnType<typeof prismaClientSingleton>;
