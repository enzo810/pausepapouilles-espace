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
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    toast.error("Token invalide");
    return;
  }

  async function onSubmit(formData: FormData) {
    const password = formData.get("password");
    await authClient.resetPassword(
      {
        newPassword: String(password),
        token: String(token),
      },
      {
        onSuccess: () => {
          router.push(`/signin`);
          toast.success("Mot de passe réinitialisé, veuillez vous connecter");
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
        <CardTitle>Réinitialiser le mot de passe</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Entrez votre nouveau mot de passe ci-dessous.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" action={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input type="password" id="password" name="password" />
          </div>
          <Button type="submit">Réinitialiser le mot de passe</Button>
        </form>
      </CardContent>
    </Card>
  );
}
