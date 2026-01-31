import ServerError from "@/components/ServerError";
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
    <>{session && <UserDataTable users={users} role={session.user.role} />}</>
  );
}
