"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { UpdateEmailForm } from "@/components/update-email-form";
import { UpdateNameForm } from "@/components/update-name-form";
import { UpdatePasswordForm } from "@/components/update-password-form";

export default function UserProfilePage() {
  const { data: session } = useSession();

  const [openPassword, setOpenPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100svh-200px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Votre profil</CardTitle>
          </CardHeader>

          {session?.user ? (
            <>
              <CardContent className="space-y-2 px-8">
                <div className="flex items-center gap-2">
                  <p>Nom : </p>
                  <UpdateNameForm
                    defaultValue={session?.user?.name || ""}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <p>Email : </p>
                  <p>{session?.user?.email}</p>
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                    >
                      Modifier l&apos;email
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Modifier l’email</DialogTitle>
                    </DialogHeader>

                    <UpdateEmailForm />
                  </DialogContent>
                </Dialog>

                <Dialog open={openPassword} onOpenChange={setOpenPassword}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                    >
                      Modifier le mot de passe
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Modifier le mot de passe</DialogTitle>
                    </DialogHeader>

                    <UpdatePasswordForm setOpen={setOpenPassword} />
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </>
          ) : (
            <div className="px-6">
              <Skeleton className="w-full h-20" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
