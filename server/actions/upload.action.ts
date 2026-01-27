"use server";

import { authAction } from "@/lib/safe-action";
import { z } from "zod";
import { put } from "@vercel/blob";

export const createAnimalImage = authAction
  .inputSchema(
    z.object({
      formData: z.instanceof(FormData),
      animalId: z.string(),
    }),
  )
  .action(async ({ ctx, parsedInput: { formData, animalId } }) => {
    const file = formData.get("file") as File;

    if (file?.size) {
      if (file?.size > 5 * 1024 * 1024) {
        throw new ctx.ActionError("Le fichier ne doit pas dépasser 5 Mo");
      }
    } else {
      throw new ctx.ActionError("Le fichier est obligatoire");
    }

    try {
      const blob = await put(`${animalId}/${file.name}`, file, {
        access: "public",
        allowOverwrite: true,
      });
    } catch (e) {
      console.error(e);
      throw new ctx.ActionError(
        "Une erreur est survenue lors de l'upload de l'image",
      );
    }
  });
