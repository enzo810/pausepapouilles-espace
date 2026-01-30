"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { CheckCircle2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const formSchema = z.object({
  email: z.email("L'email n'est pas valide"),
});

export function UpdateEmailForm() {
  const [displayAlert, setDisplayAlert] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authClient.changeEmail(
      {
        newEmail: values.email,
      },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Opération réussie");
          setDisplayAlert(true);
        },
        onError: (error) => {
          toast.error(error.error.message);
          setDisplayAlert(false);
        },
      },
    );
    form.reset();
  }

  return (
    <Card className="w-full max-w-sm shadow-none">
      <CardHeader>
        <CardDescription>
          Entrez votre nouvel email. Un email de confirmation pourra être
          envoyé.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouvel email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-6">
            <Button type="submit" className="w-full">
              Enregistrer
            </Button>
            {displayAlert && (
              <Alert variant="borderless" className="p-0">
                <CheckCircle2Icon />
                <AlertTitle>Opération réussie</AlertTitle>
                <AlertDescription>
                  Un email de confirmation a été envoyé à l&apos;ancien email.
                  Une fois validé, un email de confirmation sera envoyé au
                  nouvel email.
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
