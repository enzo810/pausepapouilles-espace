import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { assessmentValues, genderValues, speciesValues } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function displaySpeciesValues(
  value: (typeof speciesValues)[number],
  otherSpecies?: string,
): string {
  switch (value) {
    case "DOG":
      return "Chien";
    case "CAT":
      return "Chat";
    case "OTHER":
      return otherSpecies || "Autre";
    default:
      return value;
  }
}

export function displayAssessmentValues(
  value: (typeof assessmentValues)[number],
): string {
  switch (value) {
    case "GOOD":
      return "Bon";
    case "MIXED":
      return "Mitigé";
    case "DIFFICULT":
      return "Difficile";
    default:
      return value;
  }
}

export function displayGenderValues(
  value: (typeof genderValues)[number],
): string {
  switch (value) {
    case "MALE":
      return "Mâle";
    case "FEMALE":
      return "Femelle";
    default:
      return value;
  }
}
