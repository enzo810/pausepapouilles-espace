import { z } from "zod";

export const CreateUserFormSchema = z.object({
  name: z.string().optional(),
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  email: z.email("L'email n'est pas valide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const UpdateUserFormSchema = CreateUserFormSchema.extend({
  id: z.string(),
});
