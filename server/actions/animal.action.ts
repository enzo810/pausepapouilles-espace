"use server";

import prisma from "@/lib/prisma";
import { authAction } from "@/lib/safe-action";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/utils";
import {
  CreateAnimalFormSchema,
  UpdateAnimalFormSchema,
} from "@/schemas/AnimalFormSchema";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { z } from "zod";
import { isPetSitter } from "./role.action";

function validateImageFile(file: File): { success: boolean; message: string } {
  if (file.size === 0) {
    return {
      success: false,
      message: "Le fichier est vide",
    };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false,
      message: "Le fichier doit être une image (JPEG, PNG, WebP ou JPG)",
    };
  }

  if (file.size >= MAX_IMAGE_SIZE) {
    return {
      success: false,
      message: `L'image ne doit pas dépasser ${MAX_IMAGE_SIZE / 1024 / 1024} Mo`,
    };
  } else {
    return {
      success: true,
      message: "L'image est valide",
    };
  }
}

async function encodeImageToWebP(
  file: File,
): Promise<
  { success: true; buffer: Buffer } | { success: false; message: string }
> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const webpBuffer = await sharp(buffer)
      .rotate()
      .resize({
        width: 2048,
        height: 2048,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    if (webpBuffer.length === 0) {
      return { success: false, message: "Image invalide" };
    }

    if (webpBuffer.length > 2 * 1024 * 1024) {
      return {
        success: false,
        message: "L'image encodée ne doit pas dépasser 2 Mo",
      };
    }

    return { success: true, buffer: webpBuffer };
  } catch (error) {
    console.error("encodeImageToWebP error:", error);
    return {
      success: false,
      message: "Impossible de traiter cette image",
    };
  }
}

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
        const file = formData?.get("file");

        if (file && file instanceof File) {
          const validation = validateImageFile(file);
          if (!validation.success) {
            throw new ctx.ActionError(validation.message);
          }

          const encodingResult = await encodeImageToWebP(file);
          if (!encodingResult.success) {
            throw new ctx.ActionError(encodingResult.message);
          }

          const blob = await put(
            `animals/${animal.id}.webp`,
            encodingResult.buffer,
            {
              access: "public",
              contentType: "image/webp",
            },
          );

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
        const file = formData?.get("file");

        if (file && file instanceof File) {
          const validation = validateImageFile(file);
          if (!validation.success) {
            throw new ctx.ActionError(validation.message);
          }

          const encodingResult = await encodeImageToWebP(file);
          if (!encodingResult.success) {
            throw new ctx.ActionError(encodingResult.message);
          }

          const blob = await put(
            `animals/${animal.id}.webp`,
            encodingResult.buffer,
            {
              access: "public",
              contentType: "image/webp",
            },
          );

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

      revalidatePath("/");
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
