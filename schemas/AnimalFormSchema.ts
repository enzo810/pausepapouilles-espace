import { z } from "zod";

export const CreateAnimalFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  age: z.number().int().min(0, "L'âge doit être un nombre positif"),
  gender: z.enum(["MALE", "FEMALE"]),
  species: z.enum(["DOG", "CAT", "OTHER"]),
  otherSpecies: z.string().optional(),
  type: z.string().min(1, "Le type est requis"),
  isIdentified: z.boolean(),
  diet: z.string().min(1, "Le régime alimentaire est requis"),
  treatsAllowed: z.boolean(),
  temperamentNotes: z
    .string()
    .min(1, "Les notes sur le tempérament sont requises"),
  childFriendly: z.enum(["GOOD", "MIXED", "DIFFICULT"]),
  dogFriendly: z.enum(["GOOD", "MIXED", "DIFFICULT"]),
  trafficTolerance: z.enum(["GOOD", "MIXED", "DIFFICULT"]),
  socializationNotes: z
    .string()
    .min(1, "Les notes de socialisation sont requises"),
  fears: z.string().min(1, "Les peurs sont requises"),
  sensitiveAreas: z.string().min(1, "Les zones sensibles sont requises"),
  healthIssues: z.boolean(),
  careInstructions: z
    .string()
    .min(1, "Les instructions de soins sont requises"),
  additionalNotes: z.string().min(1, "Les notes supplémentaires sont requises"),
});

export const UpdateAnimalFormSchema = CreateAnimalFormSchema.extend({
  id: z.string(),
});
