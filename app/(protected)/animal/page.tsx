import { CreateAnimalDialog } from "@/components/create-animal-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { getAnimals } from "@/server/actions/animal.action";
import { columns } from "./components/columns";

export default async function AnimalPage() {
  const result = await getAnimals();
  const animals = result.data?.animals || [];

  return (
    <>
      <CreateAnimalDialog />
      <DataTable columns={columns} data={animals} type="animal" />
    </>
  );
}
