"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { displayUserRoleValues } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prénom" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("firstname");
      return value != null && value !== "" ? (
        <span>{String(value)}</span>
      ) : (
        <span className="opacity-30">Non défini</span>
      );
    },
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("lastname");
      return value != null && value !== "" ? (
        <span>{String(value)}</span>
      ) : (
        <span className="opacity-30">Non défini</span>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("email");
      return value != null && value !== "" ? (
        <span>{String(value)}</span>
      ) : (
        <span className="opacity-30">Non défini</span>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rôle" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as UserType["role"] | null;
      if (role == null) {
        return <span className="opacity-30">Non défini</span>;
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
