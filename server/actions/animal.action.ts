"use server";

import prisma from "@/lib/prisma";
import { authAction } from "@/lib/safe-action";
import {
  CreateAnimalFormSchema,
  UpdateAnimalFormSchema,
} from "@/schemas/AnimalFormSchema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createAnimal = authAction
  .inputSchema(CreateAnimalFormSchema)
  .action(async ({ ctx, parsedInput: animalData }) => {
    try {
      const animal = await prisma.animal.create({
        data: {
          ...animalData,
          userId: ctx.session.user.id,
        },
      });

      if (animal) {
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

      if (!existingAnimal || existingAnimal.userId !== ctx.session.user.id) {
        throw new ctx.ActionError("Animal non trouvé ou accès non autorisé");
      }

      const animal = await prisma.animal.update({
        where: { id },
        data: animalData,
      });

      if (animal) {
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

export const getAnimals = authAction
  .inputSchema(z.void())
  .action(async ({ ctx }) => {
    try {
      const animals = await prisma.animal.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          animalTemperaments: true,
        },
        orderBy: {
          createdAt: "desc",
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

export const getAnimal = authAction
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ ctx, parsedInput: { id } }) => {
    try {
      const animal = await prisma.animal.findUnique({
        where: { id },
        include: {
          animalTemperaments: true,
        },
      });

      if (!animal || animal.userId !== ctx.session.user.id) {
        throw new ctx.ActionError("Animal non trouvé ou accès non autorisé");
      }

      return {
        animal,
        status: 200,
      };
    } catch (e) {
      console.error(e);
      if (e instanceof Error && e.message.includes("non trouvé")) {
        throw e;
      }
      throw new ctx.ActionError(
        "Une erreur est survenue lors de la récupération de l'animal",
      );
    }
  });
