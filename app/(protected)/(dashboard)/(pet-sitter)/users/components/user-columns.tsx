"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { NotDefined } from "@/components/ui/not-defined";
import { displayUserRoleValues } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import { ColumnDef } from "@tanstack/react-table";

function getColumnLabel(columnId: string): string {
  return (
    (columnId === "firstname" && "Prénom") ||
    (columnId === "lastname" && "Nom") ||
    (columnId === "email" && "Email") ||
    (columnId === "role" && "Rôle") ||
    (columnId === "createdAt" && "Créé le") ||
    (columnId === "updatedAt" && "Modifié le") ||
    columnId
  );
}

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "firstname",
    meta: { label: getColumnLabel("firstname") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("firstname");
      return value != null && value !== "" ? (
        <span>{String(value)}</span>
      ) : (
        <NotDefined />
      );
    },
  },
  {
    accessorKey: "lastname",
    meta: { label: getColumnLabel("lastname") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("lastname");
      return value != null && value !== "" ? (
        <span>{String(value)}</span>
      ) : (
        <NotDefined />
      );
    },
  },
  {
    accessorKey: "email",
    meta: { label: getColumnLabel("email") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("email");
      return value != null && value !== "" ? (
        <span>{String(value)}</span>
      ) : (
        <NotDefined />
      );
    },
  },
  {
    accessorKey: "role",
    meta: { label: getColumnLabel("role") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={getColumnLabel(column.id)}
      />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as UserType["role"] | null;
      if (role == null) {
        return <NotDefined />;
      }
      const variants: Record<
        UserType["role"],
        "default" | "secondary" | "outline"
      > = {
        ADMIN: "default",
        PET_SITTER: "secondary",
        CLIENT: "outline",
      };
      return (
        <Badge variant={variants[role]}>{displayUserRoleValues(role)}</Badge>
      );
    },
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
