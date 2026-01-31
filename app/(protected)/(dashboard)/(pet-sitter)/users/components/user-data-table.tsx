"use client";

import { DataTable } from "@/components/data-table/data-table";
import { UserDialog } from "@/components/user-dialog";
import { UserRole } from "@/generated/prisma/enums";
import { UsersType } from "@/types/UserType";
import { columns } from "./users-columns";

type UserDataTableProps = {
  users: UsersType;
  role: UserRole;
};

export function UserDataTable({ users, role }: UserDataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={users}
      role={role}
      renderDialog={({ selected, open, setOpen }) => (
        <UserDialog
          user={selected}
          open={open}
          setOpen={setOpen}
          key={selected.id}
        />
      )}
    />
  );
}
