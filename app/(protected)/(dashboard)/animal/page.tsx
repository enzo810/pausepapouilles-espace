import { CreateAnimalDialog } from "@/components/create-animal-dialog";
import ServerError from "@/components/ServerError";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth-server";
import { getAnimals } from "@/server/actions/animal.action";
import { getUsers } from "@/server/actions/user.action";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { AnimalDataTable } from "./components/animal-data-table";

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
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">
                  {session.user.role === "ADMIN"
                    ? "Tous les Animaux"
                    : "Vos Animaux"}
                </h2>
                <Badge variant="secondary">{animals.length}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {session.user.role === "ADMIN"
                  ? "Gérez tous les animaux enregistrés"
                  : "Gérez les animaux de votre profil"}
              </p>
            </div>
          </div>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AnimalDataTable
            animals={animals}
            role={session.user.role}
            createButton={<CreateAnimalDialog />}
          />
        </HydrationBoundary>
      </>
    )
  );
}
