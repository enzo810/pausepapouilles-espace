"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserDialog } from "@/components/user-dialog";
import { displayUserRoleValues } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useState } from "react";

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prénom" />
    ),
    cell: ({ row }) => row.getValue("firstname") || "-",
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => row.getValue("lastname") || "-",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rôle" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as UserType["role"];
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
      const date = row.getValue("createdAt") as Date;
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modifié le" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
  },
];
