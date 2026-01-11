import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function displaySpeciesValues(value: "DOG" | "CAT" | "OTHER"): string {
  switch (value) {
    case "DOG":
      return "Chien";
    case "CAT":
      return "Chat";
    case "OTHER":
      return "Autre";
    default:
      return value;
  }
}

export function displayAssessmentValues(
  value: "GOOD" | "MIXED" | "DIFFICULT",
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

export function displayGenderValues(value: "MALE" | "FEMALE"): string {
  switch (value) {
    case "MALE":
      return "Mâle";
    case "FEMALE":
      return "Femelle";
    default:
      return value;
  }
}
