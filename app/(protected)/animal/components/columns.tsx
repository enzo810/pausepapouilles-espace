"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Animal } from "@/generated/prisma/client";
import {
  displayAssessmentValues,
  displayGenderValues,
  displaySpeciesValues,
} from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Animal>[] = [
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
];
