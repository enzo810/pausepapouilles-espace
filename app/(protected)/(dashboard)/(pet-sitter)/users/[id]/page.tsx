import { CreateAnimalDialog } from "@/components/create-animal-dialog";
import ServerError from "@/components/ServerError";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth-server";
import { getUser } from "@/server/actions/user.action";
import { Mail, User } from "lucide-react";
import Link from "next/link";
import { AnimalDataTable } from "../../../animal/components/animal-data-table";
import { UserActions } from "./user-actions";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const session = await getSession();

  const userResult = await getUser({ id });
  if (userResult.serverError) {
    return <ServerError message={userResult.serverError} />;
  }

  const user = userResult.data?.user;

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/users">Utilisateurs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {user?.firstname && user?.lastname
                ? `${user.firstname} ${user.lastname}`
                : user?.name || user?.email}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            {user?.firstname && user?.lastname
              ? `${user.firstname} ${user.lastname}`
              : user?.name || "Utilisateur"}
          </CardTitle>
          {user && <UserActions user={user} />}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="size-4" />
            <span>{user?.email}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Animaux ({user?.animals.length || 0})
          </h2>
          <CreateAnimalDialog userId={id} />
        </div>

        {session && (
          <AnimalDataTable
            animals={user?.animals || []}
            role={session.user.role}
          />
        )}
      </div>
    </div>
  );
}
