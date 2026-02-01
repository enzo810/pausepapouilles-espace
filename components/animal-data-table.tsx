"use client";

import { AnimalCard } from "@/components/animal-card";
import { AnimalDialog } from "@/components/animal-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { UserRole } from "@/generated/prisma/enums";
import { AnimalsType } from "@/types/AnimalTypes";
import { columns, columnsWithoutUser } from "./animal-columns";

type AnimalDataTableProps = {
  animals: AnimalsType;
  role: UserRole;
  createButton?: React.ReactNode;
  customColumns?: boolean;
};

export function AnimalDataTable({
  animals,
  role,
  createButton,
  customColumns = false,
}: AnimalDataTableProps) {
  return (
    <DataTable
      columns={customColumns ? columnsWithoutUser : columns}
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
