"use client";

import { DataTable } from "@/components/data-table/data-table";
import { UserRole } from "@/generated/prisma/enums";
import { UsersType } from "@/types/UserType";
import { useRouter } from "next/navigation";
import { columns } from "./users-columns";

type UserDataTableProps = {
  users: UsersType;
  role: UserRole;
};

export function UserDataTable({ users, role }: UserDataTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={users}
      role={role}
      onRowClick={(user) => router.push(`/users/${user.id}`)}
    />
  );
}
