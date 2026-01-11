"use server";

import prisma from "@/lib/prisma";
import { authAction } from "@/lib/safe-action";
import { CreateAnimalFormSchema } from "@/schemas/AnimalFormSchema";
import { revalidatePath } from "next/cache";

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
