import { CreateAnimalDialog } from "@/components/create-animal-dialog";
import { getSession } from "@/lib/auth-server";
import { getAnimals } from "@/server/actions/animal.action";
import { AnimalDataTable } from "./components/animal-data-table";

export default async function AnimalPage() {
  const session = await getSession();
  const result = await getAnimals();
  const animals = result.data?.animals || [];

  return (
    session && (
      <>
        <CreateAnimalDialog />
        <AnimalDataTable animals={animals} role={session.user.role} />
      </>
    )
  );
}
