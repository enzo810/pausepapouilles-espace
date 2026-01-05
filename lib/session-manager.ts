import { User } from "@/generated/prisma/client";
import prismaAdmin from "./prisma-admin";

export type ExtendUser = Omit<User, "role">;

export async function extendUser(userId: string): Promise<ExtendUser> {
  const user = await prismaAdmin.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      firstname: true,
      lastname: true,
      image: true,
      emailVerified: true,
      banned: true,
      banReason: true,
      banExpires: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
