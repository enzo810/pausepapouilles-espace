import { Cat, Dog, PawPrint } from "lucide-react";

export const speciesConfig = {
  DOG: { icon: Dog, gradient: "from-orange-100 to-orange-200" },
  CAT: { icon: Cat, gradient: "from-rose-100 to-pink-200" },
  OTHER: {
    icon: PawPrint,
    gradient: "from-violet-100 to-purple-200",
  },
};

export const genderConfig = {
  MALE: { label: "Mâle", className: "bg-blue-100 text-blue-700" },
  FEMALE: { label: "Femelle", className: "bg-pink-100 text-pink-700" },
};
