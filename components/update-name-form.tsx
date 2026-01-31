"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

const formSchema = z.object({
  name: z.string().min(3, "Le nom doit faire au moins 3 caractères"),
});

export function UpdateNameForm({
  defaultValue,
  className,
}: {
  defaultValue: string;
  className?: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValue,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.name !== defaultValue) {
      await authClient.updateUser(
        {
          name: values.name,
        },
        {
          onSuccess: () => {
            toast.success("Nom mis à jour");
            router.refresh();
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      );
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="name"
                  {...field}
                  className="shadow-none"
                  onBlur={() => onSubmit(form.getValues())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
