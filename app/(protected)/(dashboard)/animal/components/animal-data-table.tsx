"use client";

import { AnimalCard } from "@/components/animal-card";
import { AnimalDialog } from "@/components/animal-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { UserRole } from "@/generated/prisma/enums";
import { AnimalsType } from "@/types/AnimalTypes";
import { columns } from "./animal-columns";

type AnimalDataTableProps = {
  animals: AnimalsType;
  role: UserRole;
  createButton?: React.ReactNode;
};

export function AnimalDataTable({
  animals,
  role,
  createButton,
}: AnimalDataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={animals}
      role={role}
      renderCard={({ item, select }) => (
        <AnimalCard animal={item} onClick={select} key={item.id} />
      )}
      renderDialog={({ selected, open, setOpen }) => (
        <AnimalDialog
          animal={selected}
          open={open}
          setOpen={setOpen}
          key={selected.id}
        />
      )}
      createButton={createButton}
    />
  );
}
