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

import { UpdateEmailForm } from "@/components/update-email-form";
import { UpdatePasswordForm } from "@/components/update-password-form";

export default function UserProfilePage() {
  const { data: session } = useSession();

  const [openEmail, setOpenEmail] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100svh-200px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-1">
            <div>
              <strong>Name:</strong> {session?.user?.name}
            </div>
            <div>
              <strong>Email:</strong> {session?.user?.email}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Dialog open={openEmail} onOpenChange={setOpenEmail}>
              <DialogTrigger asChild>
                <Button type="button" variant="secondary" className="w-full">
                  Modifier l&apos;email
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Modifier l’email</DialogTitle>
                </DialogHeader>

                <UpdateEmailForm setOpen={setOpenEmail} />
              </DialogContent>
            </Dialog>

            <Dialog open={openPassword} onOpenChange={setOpenPassword}>
              <DialogTrigger asChild>
                <Button type="button" variant="secondary" className="w-full">
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
        </Card>
      </div>
    </div>
  );
}
