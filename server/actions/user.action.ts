"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { authAction, publicAction } from "@/lib/safe-action";
import {
  CreateUserFormSchema,
  UpdateUserFormSchema,
} from "@/schemas/UserFormSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const signup = publicAction
  .inputSchema(CreateUserFormSchema)
  .action(async ({ ctx, parsedInput: user }) => {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email: user.email,
          password: user.password,
          name: `${user.firstname} ${user.lastname}`,
        },
        headers: await headers(),
      });

      if (!result.user) {
        throw new ctx.ActionError(
          "Une Erreur est survenue lors de la création du compte",
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: result.user.id },
        data: {
          firstname: user.firstname,
          lastname: user.lastname,
        },
      });

      if (updatedUser) {
        const connectedUser = await auth.api.signInEmail({
          body: {
            email: user.email,
            password: user.password,
          },
          headers: await headers(),
        });

        if (connectedUser.user) {
          revalidatePath("/");
          return {
            user: result.user,
            message: "Le compte a bien été créé",
            status: 200,
          };
        }
      }
    } catch (e) {
      console.error(e);
      throw new ctx.ActionError(
        "Une erreur est survenue lors de la création du compte",
      );
    }
  });

export const updateSelfUser = authAction
  .inputSchema(UpdateUserFormSchema)
  .action(async ({ ctx, parsedInput: user }) => {
    if (user.id !== ctx.session.user.id) {
      throw new ctx.ActionError(
        "Vous n'avez pas les droits pour effectuer cette action",
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: user.email,
        id: {
          not: user.id,
        },
      },
    });

    if (existingUser) {
      throw new ctx.ActionError("Cette adresse email est déjà utilisée");
    }

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...user,
        },
      });

      if (updatedUser) {
        revalidatePath("/profile");
        return {
          message: "Le profil a bien été mis à jour",
          status: 200,
        };
      }
    } catch (e) {
      console.error(e);
      throw new ctx.ActionError(
        "Une erreur est survenue lors de la mise à jour du profil",
      );
    }
  });
