"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.email(),
});

export function UpdateEmailForm({
  setOpen,
}: {
  setOpen?: (open: boolean) => void;
}) {
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
          toast.success("Email updated");
          router.refresh();
          setOpen?.(false);
        },
        onError: (error) => {
          toast.error(error.error.message);
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

          <CardFooter>
            <Button type="submit" className="w-full">
              Enregistrer
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
