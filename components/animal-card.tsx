"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AnimalType } from "@/types/AnimalTypes";
import { Cat, Dog, PawPrint } from "lucide-react";
import Image from "next/image";
import { Badge } from "./ui/badge";

type AnimalCardProps = {
  animal: AnimalType;
  onClick?: () => void;
};

const speciesConfig = {
  DOG: { label: "Chien", icon: Dog, gradient: "from-amber-100 to-orange-200" },
  CAT: { label: "Chat", icon: Cat, gradient: "from-violet-100 to-purple-200" },
  OTHER: {
    label: "Autre",
    icon: PawPrint,
    gradient: "from-emerald-100 to-teal-200",
  },
};

const genderConfig = {
  MALE: { label: "Mâle", className: "bg-blue-100 text-blue-700" },
  FEMALE: { label: "Femelle", className: "bg-pink-100 text-pink-700" },
};

export function AnimalCard({ animal, onClick }: AnimalCardProps) {
  const species = speciesConfig[animal.species];
  const gender = genderConfig[animal.gender];
  const SpeciesIcon = species.icon;

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-0 shadow-sm pt-0 gap-2"
      onClick={onClick}
    >
      <div
        className={`relative h-52 w-full bg-gradient-to-br ${species.gradient} overflow-hidden`}
      >
        {animal.imageUrl ? (
          <Image
            src={animal.imageUrl}
            alt={animal.name}
            fill
            className="object-cover"
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <SpeciesIcon className="h-16 w-16 text-gray-600/40 transition-transform" />
          </div>
        )}
      </div>
      <CardContent className="space-y-1 p-4">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="text-lg font-semibold tracking-tight">
            {animal.name}
          </h3>
          <Badge className={gender.className}>{gender.label}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{species.label}</span>
          <span className="text-xs">•</span>
          <span>{animal.type}</span>
        </div>
      </CardContent>
    </Card>
  );
}
