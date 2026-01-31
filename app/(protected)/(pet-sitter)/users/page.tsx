import { CreateAnimalDialog } from "@/components/create-animal-dialog";
import { getSession } from "@/lib/auth-server";
import { getAnimals } from "@/server/actions/animal.action";

export default async function UsersPage() {
  const session = await getSession();
  const result = await getAnimals();
  const animals = result.data?.animals || [];

  return (
    session && (
      <>
        <CreateAnimalDialog />
      </>
    )
  );
}
