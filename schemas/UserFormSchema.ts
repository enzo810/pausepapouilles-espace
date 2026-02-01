import { z } from "zod";

export const UpdateProfileFormSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
});
