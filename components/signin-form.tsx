"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { LoadingButton } from "./ui/loading-button";

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const SigninFormSchema = z.object({
    email: z.string(),
  });

  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync: signInMutate, isPending: isSigningIn } = useMutation({
    mutationFn: async (values: z.infer<typeof SigninFormSchema>) => {
      await authClient.signIn.magicLink(
        {
          email: values.email,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            router.push(`/verify-email?email=${values.email}`);
            router.refresh();
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      );
    },
  });

  async function onSubmit(values: z.infer<typeof SigninFormSchema>) {
    toast.promise(signInMutate(values), {
      loading: "Connexion en cours...",
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Accédez à votre compte</CardTitle>
          <CardDescription>
            Entrez votre email ci-dessous pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nous utiliserons cette adresse email pour vous contacter.
                      Nous ne partagerons pas votre adresse email avec personne
                      d&apos;autre.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton
                type="submit"
                className="w-full"
                loading={isSigningIn}
              >
                Se connecter
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
