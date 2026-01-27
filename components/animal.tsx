"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  displayAssessmentValues,
  displayGenderValues,
  displaySpeciesValues,
} from "@/lib/utils";
import { AnimalType } from "@/types/AnimalTypes";
import {
  AlertTriangle,
  Baby,
  Car,
  Cookie,
  Dog,
  FileText,
  Heart,
  Stethoscope,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AnimalProps {
  animal: AnimalType;
}

function AssessmentBadge({ value }: { value: "GOOD" | "MIXED" | "DIFFICULT" }) {
  const variants: Record<
    typeof value,
    "default" | "secondary" | "destructive"
  > = {
    GOOD: "default",
    MIXED: "secondary",
    DIFFICULT: "destructive",
  };
  return (
    <Badge variant={variants[value]}>{displayAssessmentValues(value)}</Badge>
  );
}

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function Animal({ animal }: AnimalProps) {
  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <Section title="Informations générales">
        <div className="grid grid-cols-2 gap-4">
          <InfoRow
            label="Âge"
            value={`${animal.age} an${animal.age ? (animal.age > 1 ? "s" : "") : ""}`}
          />
          <InfoRow label="Sexe" value={displayGenderValues(animal.gender)} />
          <InfoRow
            label="Espèce"
            value={displaySpeciesValues(
              animal.species,
              animal.otherSpecies ?? undefined,
            )}
          />
          <InfoRow label="Race / Type" value={animal.type} />
          <InfoRow
            label="Identifié"
            value={
              <Badge variant={animal.isIdentified ? "default" : "secondary"}>
                {animal.isIdentified ? "Oui" : "Non"}
              </Badge>
            }
          />
        </div>
      </Section>

      <Separator />

      {/* Alimentation */}
      <Section title="Alimentation">
        <InfoRow
          icon={Utensils}
          label="Régime alimentaire"
          value={animal.diet}
        />
        <InfoRow
          icon={Cookie}
          label="Friandises autorisées"
          value={
            <Badge variant={animal.treatsAllowed ? "default" : "secondary"}>
              {animal.treatsAllowed ? "Oui" : "Non"}
            </Badge>
          }
        />
      </Section>

      <Separator />

      {/* Comportement et socialisation */}
      <Section title="Comportement et socialisation">
        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col items-center gap-2">
            <Baby className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Enfants</p>
            <AssessmentBadge value={animal.childFriendly || "GOOD"} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Dog className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Chiens</p>
            <AssessmentBadge value={animal.dogFriendly || "GOOD"} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Car className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Circulation</p>
            <AssessmentBadge value={animal.trafficTolerance || "GOOD"} />
          </div>
        </div>
        {animal.temperamentNotes && (
          <InfoRow
            icon={Heart}
            label="Notes sur le tempérament"
            value={animal.temperamentNotes}
          />
        )}
        {animal.socializationNotes && (
          <InfoRow
            icon={FileText}
            label="Notes de socialisation"
            value={animal.socializationNotes}
          />
        )}
      </Section>

      <Separator />

      {/* Santé et soins */}
      <Section title="Santé et soins">
        {animal.fears && (
          <InfoRow icon={AlertTriangle} label="Peurs" value={animal.fears} />
        )}
        {animal.sensitiveAreas && (
          <InfoRow
            icon={AlertTriangle}
            label="Zones sensibles"
            value={animal.sensitiveAreas}
          />
        )}
        <InfoRow
          icon={Stethoscope}
          label="Problèmes de santé"
          value={
            <Badge variant={animal.healthIssues ? "destructive" : "default"}>
              {animal.healthIssues ? "Oui" : "Non"}
            </Badge>
          }
        />
        {animal.careInstructions && (
          <InfoRow
            icon={FileText}
            label="Instructions de soins"
            value={animal.careInstructions}
          />
        )}
      </Section>

      {animal.additionalNotes && (
        <>
          <Separator />
          <Section title="Notes supplémentaires">
            <p className="text-sm">{animal.additionalNotes}</p>
          </Section>
        </>
      )}

      {animal.imageUrl && (
        <>
          <Separator />
          <Section title="Photo">
            <Link
              href={animal.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border shadow-sm transition-transform group-hover:scale-[1.02]">
                <Image
                  src={animal.imageUrl}
                  alt={`Photo de ${animal.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            </Link>
          </Section>
        </>
      )}
    </div>
  );
}
