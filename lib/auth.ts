import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import prismaPublic from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prismaPublic, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
