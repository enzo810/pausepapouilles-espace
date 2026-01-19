import { Animal, AnimalTemperament } from "@/generated/prisma/client";

export type AnimalType = Animal & {
  animalTemperaments: AnimalTemperament[];
};
