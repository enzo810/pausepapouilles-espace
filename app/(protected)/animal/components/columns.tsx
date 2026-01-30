"use client";

import { AnimalDialog } from "@/components/animal-dialog";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  displayAssessmentValues,
  displayGenderValues,
  displaySpeciesValues,
} from "@/lib/utils";
import { AnimalType } from "@/types/AnimalTypes";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export const columns: ColumnDef<AnimalType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sexe" />
    ),
    cell: ({ row }) => {
      return displayGenderValues(row.getValue("gender"));
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Âge" />
    ),
    cell: ({ row }) => {
      const age = row.getValue("age") as number;
      return `${age} an${age > 1 ? "s" : ""}`;
    },
  },
  {
    accessorKey: "species",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Espèce" />
    ),
    cell: ({ row }) => {
      return displaySpeciesValues(
        row.getValue("species"),
        row.original.otherSpecies,
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
  },
  {
    accessorKey: "isIdentified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identifié" />
    ),
    cell: ({ row }) => {
      return row.getValue("isIdentified") ? "Oui" : "Non";
    },
  },
  {
    accessorKey: "childFriendly",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enfants" />
    ),
    cell: ({ row }) => {
      return displayAssessmentValues(row.getValue("childFriendly"));
    },
  },
  {
    accessorKey: "dogFriendly",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chiens" />
    ),
    cell: ({ row }) => {
      return displayAssessmentValues(row.getValue("dogFriendly"));
    },
  },
  {
    accessorKey: "trafficTolerance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tolérance circulation" />
    ),
    cell: ({ row }) => {
      return displayAssessmentValues(row.getValue("trafficTolerance"));
    },
  },
  {
    accessorKey: "healthIssues",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Problèmes de santé" />
    ),
    cell: ({ row }) => {
      return row.getValue("healthIssues") ? "Oui" : "Non";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const animal = row.original;
      return (
        <AnimalDialog
          animal={animal}
          trigger={
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </Button>
          }
        />
      );
    },
  },
];
