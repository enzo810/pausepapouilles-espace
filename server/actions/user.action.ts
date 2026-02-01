"use server";

import { auth } from "@/lib/auth";
import { userRoleValues } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { adminAction, authAction, petSitterAction } from "@/lib/safe-action";
import { UpdateProfileFormSchema } from "@/schemas/UserFormSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

export const getUsers = petSitterAction.action(async ({ ctx }) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        // id: {
        //   not: ctx.session.user.id,
        // },
      },
    });

    return {
      status: 200,
      users,
      message: "Les utilisateurs ont bien été récupérés",
    };
  } catch (e) {
    console.error(e);
    throw new ctx.ActionError(
      "Une erreur est survenue lors de la récupération des utilisateurs",
    );
  }
});

export const updateUserRole = adminAction
  .inputSchema(z.object({ id: z.string(), role: z.enum(userRoleValues) }))
  .action(async ({ ctx, parsedInput: { id, role } }) => {
    try {
      if (id === ctx.session.user.id) {
        throw new ctx.ActionError(
          "Vous ne pouvez pas modifier votre propre rôle",
        );
      }

      await auth.api.setRole({
        body: {
          userId: id,
          role,
        },
        headers: await headers(),
      });

      revalidatePath("/users");
      return {
        message: "Le rôle a bien été mis à jour",
        status: 200,
      };
    } catch (e) {
      console.error(e);
      throw new ctx.ActionError(
        "Une erreur est survenue lors de la mise à jour du rôle",
      );
    }
  });

export const deleteUser = adminAction
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ ctx, parsedInput: { id } }) => {
    try {
      if (id === ctx.session.user.id) {
        throw new ctx.ActionError(
          "Vous ne pouvez pas supprimer votre propre compte",
        );
      }

      await auth.api.revokeUserSessions({
        body: { userId: id },
        headers: await headers(),
      });

      await auth.api.removeUser({
        body: { userId: id },
        headers: await headers(),
      });

      revalidatePath("/users");
      return {
        message: "L'utilisateur a bien été supprimé",
        status: 200,
      };
    } catch (e) {
      console.error(e);
      throw new ctx.ActionError(
        "Une erreur est survenue lors de la suppression de l'utilisateur",
      );
    }
  });

export const getUser = petSitterAction
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ ctx, parsedInput: { id } }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { animals: true },
      });

      if (!user) {
        throw new ctx.ActionError("Utilisateur non trouvé");
      }

      return {
        status: 200,
        user,
        message: "L'utilisateur a bien été récupéré",
      };
    } catch (e) {
      console.error(e);
      if (e instanceof Error && e.message.includes("non trouvé")) {
        throw e;
      }
      throw new ctx.ActionError(
        "Une erreur est survenue lors de la récupération de l'utilisateur",
      );
    }
  });

// Update self profile
export const updateProfile = authAction
  .inputSchema(UpdateProfileFormSchema)
  .action(async ({ ctx, parsedInput: { firstname, lastname } }) => {
    try {
      await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          firstname,
          lastname,
          name: `${firstname} ${lastname}`,
        },
      });

      revalidatePath("/profile");

      return {
        message: "Le profil a bien été complété",
        status: 200,
      };
    } catch (e) {
      console.error(e);
      throw new ctx.ActionError(
        "Une erreur est survenue lors de la mise à jour du profil",
      );
    }
  });
