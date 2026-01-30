"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
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
import { signIn } from "@/lib/auth-client";
import { CreateUserFormSchema } from "@/schemas/UserFormSchema";
import { signup } from "@/server/actions/user.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateUserFormSchema>>({
    resolver: zodResolver(CreateUserFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  const { mutateAsync: mutateSignUp, isPending: isPendingSignUp } = useMutation(
    {
      mutationFn: signup,
      onSuccess: async (data, variables) => {
        if (data?.data?.status === 200) {
          toast.success(data?.data?.message);
          await signIn.email(
            {
              email: variables.email,
              password: variables.password,
            },
            {
              onSuccess: () => {
                router.push("/");
                router.refresh();
              },
              onError: (error) => {
                toast.error(error.error.message);
              },
            },
          );
        }
        if (data?.serverError) {
          toast.error(data.serverError);
        }
      },
    },
  );

  async function onSubmit(values: z.infer<typeof CreateUserFormSchema>) {
    mutateSignUp(values);
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>
          Entrez vos informations ci-dessous pour créer votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FieldGroup>
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Ce sera votre prénom affiché publiquement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Ce sera votre nom affiché publiquement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Votre mot de passe doit contenir au moins 8 caractères.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Field>
                <Button type="submit">Valider</Button>
                <FieldDescription className="text-center">
                  Vous avez déjà un compte ?
                  <Link href="/signin" className="text-indigo-500 text-sm ml-2">
                    Se connecter
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
