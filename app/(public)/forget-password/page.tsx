"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ForgetPasswordPage() {
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    const email = formData.get("email");
    await authClient.requestPasswordReset(
      {
        email: String(email),
        redirectTo: "/reset-password",
      },
      {
        onSuccess: () => {
          router.push(`/verify-email?email=${email}`);
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe oublié</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Entrez votre adresse email ci-dessous et nous vous enverrons les
          instructions pour réinitialiser votre mot de passe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" action={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" />
          </div>
          <Button type="submit">Réinitialiser le mot de passe</Button>
        </form>
      </CardContent>
    </Card>
  );
}
