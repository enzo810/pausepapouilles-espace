"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { displaySpeciesValues } from "@/lib/utils";
import { AnimalType } from "@/types/AnimalTypes";
import Image from "next/image";
import { genderConfig, speciesConfig } from "./animal/utils";
import { Badge } from "./ui/badge";

type AnimalCardProps = {
  animal: AnimalType;
  onClick?: () => void;
};

export function AnimalCard({ animal, onClick }: AnimalCardProps) {
  const species = speciesConfig[animal.species];
  const gender = genderConfig[animal.gender];
  const SpeciesIcon = species.icon;

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-0 shadow-sm pt-0"
      onClick={onClick}
    >
      <CardContent className="px-0 pb-0">
        {animal.imageUrl ? (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={animal.imageUrl}
              alt={animal.name}
              fill
              className="rounded-t-xl object-cover object-top"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        ) : (
          <div
            className={`flex aspect-[4/3] w-full items-center justify-center rounded-t-xl bg-gradient-to-br ${species.gradient}`}
          >
            <SpeciesIcon className="h-16 w-16 text-gray-600/40 transition-transform" />
          </div>
        )}
      </CardContent>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="text-lg font-semibold tracking-tight">
            {animal.name}
          </h3>
          <Badge className={gender.className}>{gender.label}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {displaySpeciesValues(
              animal.species,
              animal.otherSpecies ?? undefined,
            )}
          </span>
          {animal.type && (
            <>
              <span className="text-xs">•</span>
              <span>{animal.type}</span>
            </>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
