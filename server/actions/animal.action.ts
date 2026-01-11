"use server";

import prisma from "@/lib/prisma";
import { authAction } from "@/lib/safe-action";
import { CreateAnimalFormSchema } from "@/schemas/AnimalFormSchema";
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
