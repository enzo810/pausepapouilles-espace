import { assessmentValues, genderValues, speciesValues } from "@/lib/constants";
import { z } from "zod";

export const CreateAnimalFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  age: z.number().int().min(0, "L'âge doit être un nombre positif").optional(),
  birthDate: z.date().optional(),
  gender: z.enum(genderValues),
  species: z.enum(speciesValues),
  otherSpecies: z.string().optional(),
  type: z.string().optional(),
  isIdentified: z.boolean().optional(),
  diet: z.string().optional(),
  treatsAllowed: z.boolean().optional(),
  temperamentNotes: z.string().optional(),
  childFriendly: z.enum(assessmentValues).optional(),
  dogFriendly: z.enum(assessmentValues).optional(),
  trafficTolerance: z.enum(assessmentValues).optional(),
  socializationNotes: z.string().optional(),
  fears: z.string().optional(),
  sensitiveAreas: z.string().optional(),
  healthIssues: z.boolean().optional(),
  careInstructions: z.string().optional(),
  additionalNotes: z.string().optional(),
  formData: z.instanceof(FormData).optional().nullable(),
  userId: z.string().optional().nullable(),
  imageUrl: z
    .custom<FileList>()
    .refine(
      (file) => file?.length <= 1,
      "Vous devez sélectionner une seule image",
    )
    .refine(
      (file) => file.length === 0 || file?.[0]?.type.includes("image"),
      "Vous devez sélectionner une image",
    )
    .refine(
      (file) => file.length === 0 || file?.[0]?.size < 5000000,
      "L'image ne peut pas dépasser 5 Mo",
    )
    .optional()
    .nullable(),
});

export const UpdateAnimalFormSchema = CreateAnimalFormSchema.omit({
  userId: true,
}).extend({
  id: z.string(),
});
