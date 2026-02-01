"use server";
import prisma from "@/lib/prisma";
import { authAction } from "@/lib/safe-action";
import { IdSchema } from "@/schemas/CommonsSchema";

export const isPetSitter = authAction
  .inputSchema(IdSchema)
  .action(async ({ parsedInput: id }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        role: true,
      },
    });

    const isPetSitterRole =
      user?.role === "PET_SITTER" || user?.role === "ADMIN";

    return {
      isPetSitter: isPetSitterRole,
      message: isPetSitterRole
        ? "Vous êtes pet sitter"
        : "Vous n'êtes pas pet sitter",
      status: 200,
    };
  });

export const isAdmin = authAction
  .inputSchema(IdSchema)
  .action(async ({ parsedInput: id }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        role: true,
      },
    });

    const isAdminRole = user?.role === "ADMIN";

    return {
      isAdmin: isAdminRole,
      message: isAdminRole ? "Vous êtes admin" : "Vous n'êtes pas admin",
      status: 200,
    };
  });
