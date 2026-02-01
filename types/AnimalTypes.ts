import { Animal, User } from "@/generated/prisma/client";

export type AnimalType = Animal & {
  user?: User;
};

export type AnimalsType = AnimalType[];
