"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateEmailForm } from "@/components/update-email-form";
import { UpdateProfileFormSchema } from "@/schemas/UserFormSchema";
import { updateProfile } from "@/server/actions/user.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function UpdateProfileForm({
  profile,
  email,
}: {
  profile: { firstname: string; lastname: string };
  email: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof UpdateProfileFormSchema>>({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues: {
      firstname: profile.firstname,
      lastname: profile.lastname,
    },
  });

  const { mutateAsync: mutateUpdateProfile, isPending: isUpdating } =
    useMutation({
      mutationFn: updateProfile,
      onSuccess: async (data) => {
        if (data?.data?.status === 200) {
          toast.success(data?.data?.message);
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
    if (
      values.firstname !== profile.firstname ||
      values.lastname !== profile.lastname
    ) {
      toast.promise(mutateUpdateProfile(values), {
        loading: "Mise à jour en cours...",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 px-8">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <p className="min-w-16">Prénom :</p>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="given-name"
                      {...field}
                      className="flex-1 shadow-none"
                      onBlur={() => onSubmit(form.getValues())}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <p className="min-w-16">Nom :</p>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="family-name"
                      {...field}
                      className="flex-1 shadow-none"
                      onBlur={() => onSubmit(form.getValues())}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>

        <div className="flex items-center gap-2 px-8 pb-6 pt-10">
          <p className="min-w-16">Email :</p>
          <p>{email}</p>
        </div>

        <CardFooter className="flex-col gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="secondary" className="w-full">
                Modifier l&apos;email
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Modifier l&apos;email</DialogTitle>
              </DialogHeader>

              <UpdateEmailForm />
            </DialogContent>
          </Dialog>
        </CardFooter>
      </form>
    </Form>
  );
}
