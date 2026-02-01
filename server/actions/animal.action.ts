"use server";

import prisma from "@/lib/prisma";
import { authAction } from "@/lib/safe-action";
import {
  CreateAnimalFormSchema,
  UpdateAnimalFormSchema,
} from "@/schemas/AnimalFormSchema";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isPetSitter } from "./role.action";

export const createAnimal = authAction
  .inputSchema(CreateAnimalFormSchema)
  .action(async ({ ctx, parsedInput: animalData }) => {
    try {
      const { formData, ...parsedAnimalData } = animalData;

      const isPetSitterResult = await isPetSitter(ctx.session.user.id);

      const animal = await prisma.animal.create({
        data: {
          ...parsedAnimalData,
          userId:
            isPetSitterResult.data?.isPetSitter && animalData?.userId
              ? animalData.userId
              : ctx.session.user.id,
          imageUrl: undefined,
        },
      });

      if (animal) {
        const file = formData?.get("file") as File;

        if (file) {
          const blob = await put(`animals/${animal.id}`, file, {
            access: "public",
          });

          const updatedAnimal = await prisma.animal.update({
            where: {
              id: animal.id,
            },
            data: { imageUrl: blob?.url },
          });

          revalidatePath("/");
          return {
            animal: updatedAnimal,
            message: "Votre animal a bien été ajouté",
            status: 200,
          };
        }

        revalidatePath("/");
        return {
          animal,
          message: "Votre animal a bien été ajouté",
          status: 200,
        };
      }
    } catch (e) {
      console.error(e);
      throw new ctx.ActionError(
        "Une erreur est survenue lors de l'ajout de votre animal",
      );
    }
  });

export const updateAnimal = authAction
  .inputSchema(UpdateAnimalFormSchema)
  .action(async ({ ctx, parsedInput: { id, ...animalData } }) => {
    try {
      const existingAnimal = await prisma.animal.findUnique({
        where: { id },
      });

      if (!existingAnimal) {
        throw new ctx.ActionError("Animal non trouvé");
      }

      const isPetSitterResult = await isPetSitter(ctx.session.user.id);

      if (
        !isPetSitterResult.data?.isPetSitter &&
        existingAnimal?.userId !== ctx.session.user.id
      ) {
        throw new ctx.ActionError(
          "Vous n'avez pas les droits pour mettre à jour cet animal",
        );
      }

      const { formData, ...parsedAnimalData } = animalData;

      const animal = await prisma.animal.update({
        where: {
          ...(!isPetSitterResult.data?.isPetSitter && {
            userId: ctx.session.user.id,
          }),
          id,
        },
        data: {
          ...parsedAnimalData,
          imageUrl: undefined,
          userId: undefined,
        },
      });

      if (animal) {
        const file = formData?.get("file") as File;

        if (file) {
          const blob = await put(`animals/${animal.id}`, file, {
            access: "public",
          });

          const updatedAnimal = await prisma.animal.update({
            where: {
              id: animal.id,
            },
            data: { imageUrl: blob?.url },
          });

          revalidatePath("/");
          return {
            animal: updatedAnimal,
            message: "Votre animal a bien été mis à jour",
            status: 200,
          };
        }

        revalidatePath("/");
        return {
          animal,
          message: "Votre animal a bien été mis à jour",
          status: 200,
        };
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error && e.message.includes("non trouvé")) {
        throw e;
      }
      throw new ctx.ActionError(
        "Une erreur est survenue lors de la mise à jour de votre animal",
      );
    }
  });

export const getAnimals = authAction.action(async ({ ctx }) => {
  try {
    const isPetSitterResult = await isPetSitter(ctx.session.user.id);

    const animals = await prisma.animal.findMany({
      where: {
        ...(!isPetSitterResult.data?.isPetSitter && {
          userId: ctx.session.user.id,
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    return {
      animals,
      status: 200,
    };
  } catch (e) {
    console.error(e);
    throw new ctx.ActionError(
      "Une erreur est survenue lors de la récupération des animaux",
    );
  }
});

export const deleteAnimal = authAction
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ ctx, parsedInput: { id } }) => {
    try {
      const existingAnimal = await prisma.animal.findUnique({
        where: {
          id,
        },
      });

      if (!existingAnimal) {
        throw new ctx.ActionError("Animal non trouvé");
      }

      const isPetSitterResult = await isPetSitter(ctx.session.user.id);

      if (
        !isPetSitterResult.data?.isPetSitter &&
        existingAnimal?.userId !== ctx.session.user.id
      ) {
        throw new ctx.ActionError(
          "Vous n'avez pas les droits pour supprimer cet animal",
        );
      }

      const animalToDelete = await prisma.animal.findUnique({
        where: {
          ...(!isPetSitterResult.data?.isPetSitter && {
            userId: ctx.session.user.id,
          }),
          id,
        },
      });

      if (animalToDelete && animalToDelete.imageUrl) {
        await del(animalToDelete.imageUrl);
      }

      await prisma.animal.delete({
        where: { id },
      });

      revalidatePath("/animal");
      return {
        message: "Votre animal a bien été supprimé",
        status: 200,
      };
    } catch (e) {
      console.error(e);
      if (e instanceof Error && e.message.includes("non trouvé")) {
        throw e;
      }
      throw new ctx.ActionError(
        "Une erreur est survenue lors de la suppression de votre animal",
      );
    }
  });
