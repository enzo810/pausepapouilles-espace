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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateProfileFormSchema } from "@/schemas/UserFormSchema";
import { updateProfile } from "@/server/actions/user.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";

export function CompleteProfile({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<z.infer<typeof UpdateProfileFormSchema>>({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
    },
  });

  const { mutateAsync: mutateUpdateProfile, isPending: isUpdating } =
    useMutation({
      mutationFn: updateProfile,
      onSuccess: async (data) => {
        if (data?.data?.status === 200) {
          toast.success(data?.data?.message);
          router.push("/");
          router.refresh();
        }
        if (data?.serverError) {
          toast.error(data.serverError);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Une erreur est survenue");
      },
    });

  async function onSubmit(values: z.infer<typeof UpdateProfileFormSchema>) {
    toast.promise(mutateUpdateProfile(values), {
      loading: "Mise à jour en cours...",
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Complétez votre profil</CardTitle>
        <CardDescription>
          Entrez votre prénom et nom pour continuer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Votre prénom" {...field} />
                  </FormControl>
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
                    <Input type="text" placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Valider
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
