import ServerError from "@/components/ServerError";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth-server";
import { getUsers } from "@/server/actions/user.action";
import { UserDataTable } from "./components/user-data-table";

export default async function UsersPage() {
  const session = await getSession();
  const result = await getUsers();
  if (result.serverError) {
    return <ServerError message={result.serverError} />;
  }
  const users = result.data?.users || [];

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              Tous les Utilisateurs
            </h2>
            <Badge variant="secondary">{users.length}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Gérez tous les utilisateurs enregistrés
          </p>
        </div>
      </div>
      {session && <UserDataTable users={users} role={session.user.role} />}
    </>
  );
}
