"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateProfileForm } from "@/components/update-profile-form";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export function UpdateProfile({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Votre profil</CardTitle>
          </CardHeader>
          <div className="px-6">
            <Skeleton className="w-full h-20" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Votre profil</CardTitle>
        </CardHeader>

        <UpdateProfileForm
          profile={{
            firstname: session.user.firstname ?? "",
            lastname: session.user.lastname ?? "",
          }}
          email={session.user.email ?? ""}
        />
      </Card>
    </div>
  );
}
