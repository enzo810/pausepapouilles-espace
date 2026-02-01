"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  displayAssessmentValues,
  displayGenderValues,
  displaySpeciesValues,
} from "@/lib/utils";
import { AnimalType } from "@/types/AnimalTypes";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<AnimalType>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Propriétaire" />
    ),
    cell: ({ row }) => {
      const template = `${row.original.user?.name} (${row.original.user?.email})`;
      return row.original.user ? (
        <span>{template}</span>
      ) : (
        <span className="opacity-30">Non défini</span>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => {
      return row.getValue("name") ? (
        <span>{row.getValue("name")}</span>
      ) : (
        <span className="opacity-30">Non défini</span>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sexe" />
    ),
    cell: ({ row }) => {
      return row.getValue("gender") ? (
        <span>{displayGenderValues(row.getValue("gender"))}</span>
      ) : (
        <span className="opacity-30">Non défini</span>
      );
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Âge" />
    ),
    cell: ({ row }) => {
      if (!row.getValue("age"))
        return <span className="opacity-30">Non défini</span>;
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
      return row.getValue("species") ? (
        <span>{displaySpeciesValues(row.getValue("species"))}</span>
      ) : (
        <span className="opacity-30">Non défini</span>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return row.getValue("type") ? (
        <span>{row.getValue("type")}</span>
      ) : (
        <span className="opacity-30">Non défini</span>
      );
    },
  },
  {
    accessorKey: "isIdentified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identifié" />
    ),
    cell: ({ row }) => {
      return row.getValue("isIdentified") ? <span>Oui</span> : <span>Non</span>;
    },
  },
  {
    accessorKey: "childFriendly",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enfants" />
    ),
    cell: ({ row }) => {
      return row.getValue("childFriendly") ? (
        <span>{displayAssessmentValues(row.getValue("childFriendly"))}</span>
      ) : (
        <span className="opacity-30">Non défini</span>
      );
    },
  },
  {
    accessorKey: "dogFriendly",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chiens" />
    ),
    cell: ({ row }) => {
      return row.getValue("dogFriendly") ? (
        <span>{displayAssessmentValues(row.getValue("dogFriendly"))}</span>
      ) : (
        <span className="opacity-30">Non défini</span>
      );
    },
  },
  {
    accessorKey: "trafficTolerance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tolérance circulation" />
    ),
    cell: ({ row }) => {
      return row.getValue("trafficTolerance") ? (
        <span>{displayAssessmentValues(row.getValue("trafficTolerance"))}</span>
      ) : (
        <span className="opacity-30">Non défini</span>
      );
    },
  },
  {
    accessorKey: "healthIssues",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Problèmes de santé" />
    ),
    cell: ({ row }) => {
      return row.getValue("healthIssues") ? <span>Oui</span> : <span>Non</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Créé le" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {new Date(row.getValue("createdAt")).toLocaleDateString("fr-FR")}
        </span>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modifié le" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {new Date(row.getValue("createdAt")).toLocaleDateString("fr-FR")}
        </span>
      );
    },
  },
];
