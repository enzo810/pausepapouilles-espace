"use client";

import { AssessmentBadge } from "@/components/assessment-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  displayGenderValues,
  displaySpeciesValues,
  formatAge,
} from "@/lib/utils";
import { AnimalType } from "@/types/AnimalTypes";
import {
  AlertTriangle,
  Baby,
  Cake,
  Calendar,
  Car,
  Clock,
  Cookie,
  Dog,
  FileText,
  Heart,
  PawPrint,
  ShieldQuestionMark,
  Stethoscope,
  User,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { genderConfig, speciesConfig } from "./animal/utils";
import { InfoRow } from "./ui/info-row";
import { NotDefined } from "./ui/not-defined";

interface AnimalProps {
  animal: AnimalType;
}

export function Animal({ animal }: AnimalProps) {
  const species = speciesConfig[animal.species];
  const gender = genderConfig[animal.gender];

  return (
    <div className="space-y-6">
      {/* En-tête avec photo et infos principales */}
      <div className="flex gap-6">
        {animal.imageUrl ? (
          <Link
            href={animal.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block group shrink-0"
          >
            <div className="relative h-32 w-32 rounded-xl overflow-hidden">
              <Image
                src={animal.imageUrl}
                alt={`Photo de ${animal.name}`}
                fill
                className="object-cover"
                sizes="128px"
                priority
              />
            </div>
          </Link>
        ) : (
          <div
            className={`flex h-32 w-32 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${species.gradient} border-1`}
          >
            <species.icon className="h-12 w-12 text-gray-600/40 transition-transform" />
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {displaySpeciesValues(
                animal.species,
                animal.otherSpecies ?? undefined,
              )}
            </Badge>
            <Badge variant="outline" className={gender.className}>
              {displayGenderValues(animal.gender)}
            </Badge>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <PawPrint className="h-4 w-4" />
              <span>{animal.name}</span>
            </div>
            {animal.birthDate && (
              <div className="flex items-center gap-2">
                <Cake className="h-4 w-4" />
                <span>
                  {animal.birthDate ? (
                    <>
                      Né le{" "}
                      {new Date(animal.birthDate).toLocaleDateString("fr-FR")}
                    </>
                  ) : (
                    <NotDefined />
                  )}
                </span>
              </div>
            )}
            {animal.user && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>
                  {animal.user.name} ({animal.user.email})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Onglets avec les différentes sections */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="behavior">Comportement</TabsTrigger>
          <TabsTrigger value="health">Santé</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Informations générales
              </CardTitle>
              <CardDescription>Détails de base de l'animal</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  icon={PawPrint}
                  label="Race / Type"
                  value={animal.type}
                />
                <InfoRow
                  icon={Calendar}
                  label="Âge"
                  value={formatAge(animal.age)}
                />
                <InfoRow
                  icon={ShieldQuestionMark}
                  label="Identifié"
                  value={
                    animal.isIdentified !== null &&
                    animal.isIdentified !== undefined ? (
                      <Badge
                        variant={animal.treatsAllowed ? "default" : "secondary"}
                      >
                        {animal.isIdentified ? "Identifié" : "Non identifié"}
                      </Badge>
                    ) : (
                      <NotDefined />
                    )
                  }
                />
                <InfoRow
                  icon={Cookie}
                  label="Friandises autorisées"
                  value={
                    animal.treatsAllowed !== null &&
                    animal.treatsAllowed !== undefined ? (
                      <Badge
                        variant={animal.treatsAllowed ? "default" : "secondary"}
                      >
                        {animal.treatsAllowed ? "Oui" : "Non"}
                      </Badge>
                    ) : null
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Alimentation</CardTitle>
              <CardDescription>
                Régime et préférences alimentaires
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <InfoRow
                icon={Utensils}
                label="Régime alimentaire"
                value={animal.diet}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Compatibilité</CardTitle>
              <CardDescription>
                Évaluation du comportement avec différents environnements
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InfoRow
                  icon={Baby}
                  label="Enfants"
                  value={<AssessmentBadge value={animal.childFriendly} />}
                />
                <InfoRow
                  icon={Dog}
                  label="Chiens"
                  value={<AssessmentBadge value={animal.dogFriendly} />}
                />
                <InfoRow
                  icon={Car}
                  label="Circulation"
                  value={<AssessmentBadge value={animal.trafficTolerance} />}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tempérament</CardTitle>
              <CardDescription>
                Notes sur le caractère et la socialisation
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <InfoRow
                icon={Heart}
                label="Notes sur le tempérament"
                value={animal.temperamentNotes}
              />
              <InfoRow
                icon={FileText}
                label="Notes de socialisation"
                value={animal.socializationNotes}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">État de santé</CardTitle>
              <CardDescription>
                Informations médicales et zones sensibles
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <InfoRow
                icon={Stethoscope}
                label="Problèmes de santé"
                value={
                  animal.healthIssues !== null &&
                  animal.healthIssues !== undefined ? (
                    <Badge
                      variant={animal.healthIssues ? "destructive" : "default"}
                    >
                      {animal.healthIssues ? "Oui" : "Non"}
                    </Badge>
                  ) : null
                }
              />
              <InfoRow
                icon={AlertTriangle}
                label="Peurs"
                value={animal.fears}
              />
              <InfoRow
                icon={AlertTriangle}
                label="Zones sensibles"
                value={animal.sensitiveAreas}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Soins</CardTitle>
              <CardDescription>
                Instructions de soins spécifiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InfoRow
                icon={FileText}
                label="Instructions de soins"
                value={animal.careInstructions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Notes supplémentaires</CardTitle>
              <CardDescription>
                Informations complémentaires sur l'animal
              </CardDescription>
            </CardHeader>
            <CardContent>
              {animal.additionalNotes ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {animal.additionalNotes}
                </p>
              ) : (
                <NotDefined />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Historique</CardTitle>
              <CardDescription>
                Dates de création et modification
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  icon={Clock}
                  label="Créé le"
                  value={new Date(animal.createdAt).toLocaleDateString("fr-FR")}
                />
                <InfoRow
                  icon={Clock}
                  label="Modifié le"
                  value={new Date(animal.updatedAt).toLocaleDateString("fr-FR")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
