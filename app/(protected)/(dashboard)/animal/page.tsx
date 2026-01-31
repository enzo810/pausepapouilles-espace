import { CreateAnimalDialog } from "@/components/create-animal-dialog";
import ServerError from "@/components/ServerError";
import { getSession } from "@/lib/auth-server";
import { getAnimals } from "@/server/actions/animal.action";
import { getUsers } from "@/server/actions/user.action";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { AnimalDataTable } from "./components/animals-data-table";

export default async function AnimalPage() {
  const session = await getSession();
  const result = await getAnimals();
  if (result.serverError) {
    return <ServerError message={result.serverError} />;
  }
  const animals = result.data?.animals || [];

  const queryClient = new QueryClient();
  if (session?.user.role === "ADMIN" || session?.user.role === "PET_SITTER") {
    await queryClient.prefetchQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const users = await getUsers();
        return users.data?.users ?? [];
      },
    });
  }

  return (
    session && (
      <>
        <CreateAnimalDialog />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AnimalDataTable animals={animals} role={session.user.role} />
        </HydrationBoundary>
      </>
    )
  );
}
