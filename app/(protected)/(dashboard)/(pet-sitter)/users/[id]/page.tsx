import { AnimalDataTable } from "@/components/animal-data-table";
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
import { InfoRow } from "@/components/ui/info-row";
import { getSession } from "@/lib/auth-server";
import { displayUserRoleValues } from "@/lib/utils";
import { getUser } from "@/server/actions/user.action";
import {
  Calendar,
  CheckCircle,
  Mail,
  MailCheck,
  PawPrint,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { UserActions } from "./user-actions";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

function getDisplayName(user: {
  firstname?: string | null;
  lastname?: string | null;
  name?: string | null;
  email: string;
}): string {
  if (user.firstname && user.lastname) {
    return `${user.firstname} ${user.lastname}`;
  }
  return user.name || user.email;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const session = await getSession();

  const userResult = await getUser({ id });
  if (userResult.serverError || !userResult.data?.user) {
    return <ServerError message={userResult.serverError} />;
  }

  const user = userResult.data.user;
  const displayName = getDisplayName(user);

  return (
    session && (
      <div className="flex flex-col">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Informations de l&apos;utilisateur
          </h2>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/users">Utilisateurs</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{displayName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {session.user.role == "ADMIN" && (
          <div className="flex items-center justify-end mb-6">
            <UserActions user={user} />
          </div>
        )}
        <Card className="mb-12">
          <CardHeader className="sr-only">
            <CardTitle>Informations de l&apos;utilisateur</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoRow label="Prénom" value={user.firstname} icon={User} />
            <InfoRow label="Nom" value={user.lastname} icon={User} />
            <InfoRow label="Email" value={user.email} icon={Mail} />
            <InfoRow
              label="Rôle"
              value={displayUserRoleValues(user.role)}
              icon={Shield}
            />
            <InfoRow
              label="Statut email"
              icon={MailCheck}
              value={
                user.emailVerified ? (
                  <span className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle className="size-4" />
                    Vérifié
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-red-600">
                    <XCircle className="size-4" />
                    Non vérifié
                  </span>
                )
              }
            />
            <InfoRow
              label="Compte créé le"
              value={new Date(user.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              icon={Calendar}
            />
            <InfoRow
              label="Dernière modification"
              value={new Date(user.updatedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              icon={Calendar}
            />
            <InfoRow
              label="Nombre d'animaux"
              value={user.animals?.length ?? 0}
              icon={PawPrint}
            />
          </CardContent>
        </Card>

        <AnimalDataTable
          animals={user.animals}
          role={session.user.role}
          createButton={<CreateAnimalDialog userId={user.id} />}
          customColumns={true}
        />
      </div>
    )
  );
}
