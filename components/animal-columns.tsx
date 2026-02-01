"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  displayAssessmentValues,
  displayGenderValues,
  displaySpeciesValues,
} from "@/lib/utils";
import { AnimalType } from "@/types/AnimalTypes";
import { ColumnDef } from "@tanstack/react-table";
import { NotDefined } from "./ui/not-defined";

function getColumnLabel(columnId: string): string {
  return (
    (columnId === "user" && "Propriétaire") ||
    (columnId === "name" && "Nom") ||
    (columnId === "gender" && "Sexe") ||
    (columnId === "age" && "Âge") ||
    (columnId === "species" && "Espèce") ||
    (columnId === "type" && "Type") ||
    (columnId === "isIdentified" && "Identifié") ||
    (columnId === "childFriendly" && "Tolérance enfants") ||
    (columnId === "dogFriendly" && "Tolérance chiens") ||
    (columnId === "trafficTolerance" && "Tolérance circulation") ||
    (columnId === "healthIssues" && "Problèmes de santé") ||
    (columnId === "createdAt" && "Créé le") ||
    (columnId === "updatedAt" && "Modifié le") ||
    columnId
  );
}

export const columns: ColumnDef<AnimalType>[] = [
  {
    accessorKey: "user",
    meta: { label: getColumnLabel("user") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) => {
      const template = `${row.original.user?.name} (${row.original.user?.email})`;
      return row.original.user ? <span>{template}</span> : <NotDefined />;
    },
  },
  {
    accessorKey: "name",
    meta: { label: getColumnLabel("name") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) =>
      row.getValue("name") ? (
        <span>{row.getValue("name")}</span>
      ) : (
        <NotDefined />
      ),
  },
  {
    accessorKey: "gender",
    meta: { label: getColumnLabel("gender") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) =>
      row.getValue("gender") ? (
        <span>{displayGenderValues(row.getValue("gender"))}</span>
      ) : (
        <NotDefined />
      ),
  },
  {
    accessorKey: "age",
    meta: { label: getColumnLabel("age") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) => {
      const age = row.getValue("age");
      if (age == null || age === "") return <NotDefined />;
      const n = age as number;
      return (
        <span>
          {n} an{n > 1 ? "s" : ""}
        </span>
      );
    },
  },
  {
    accessorKey: "species",
    meta: { label: getColumnLabel("species") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) =>
      row.getValue("species") ? (
        <span>{displaySpeciesValues(row.getValue("species"))}</span>
      ) : (
        <NotDefined />
      ),
  },
  {
    accessorKey: "type",
    meta: { label: getColumnLabel("type") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) =>
      row.getValue("type") ? (
        <span>{row.getValue("type")}</span>
      ) : (
        <NotDefined />
      ),
  },
  {
    accessorKey: "isIdentified",
    meta: { label: getColumnLabel("isIdentified") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) =>
      row.getValue("isIdentified") ? <span>Oui</span> : <span>Non</span>,
  },
  {
    accessorKey: "childFriendly",
    meta: { label: getColumnLabel("childFriendly") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) =>
      row.getValue("childFriendly") ? (
        <span>{displayAssessmentValues(row.getValue("childFriendly"))}</span>
      ) : (
        <NotDefined />
      ),
  },
  {
    accessorKey: "dogFriendly",
    meta: { label: getColumnLabel("dogFriendly") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) =>
      row.getValue("dogFriendly") ? (
        <span>{displayAssessmentValues(row.getValue("dogFriendly"))}</span>
      ) : (
        <NotDefined />
      ),
  },
  {
    accessorKey: "trafficTolerance",
    meta: { label: getColumnLabel("trafficTolerance") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) =>
      row.getValue("trafficTolerance") ? (
        <span>{displayAssessmentValues(row.getValue("trafficTolerance"))}</span>
      ) : (
        <NotDefined />
      ),
  },
  {
    accessorKey: "healthIssues",
    meta: { label: getColumnLabel("healthIssues") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) =>
      row.getValue("healthIssues") ? <span>Oui</span> : <span>Non</span>,
  },
  {
    accessorKey: "createdAt",
    meta: { label: getColumnLabel("createdAt") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) => (
      <span>
        {new Date(row.getValue("createdAt")).toLocaleDateString("fr-FR")}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    meta: { label: getColumnLabel("updatedAt") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) => (
      <span>
        {new Date(row.getValue("updatedAt")).toLocaleDateString("fr-FR")}
      </span>
    ),
  },
];
