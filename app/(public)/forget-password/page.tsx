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
          router.push(`/verify?email=${email}`);
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
        <CardTitle>Forget Password</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Enter your email address below and we&apos;ll send you instructions to
          reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" action={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" />
          </div>
          <Button type="submit">Reset Password</Button>
        </form>
      </CardContent>
    </Card>
  );
}
