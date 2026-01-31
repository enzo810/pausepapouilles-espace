"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userRoleValues } from "@/lib/constants";
import { displayUserRoleValues } from "@/lib/utils";
import { deleteUser, updateUserRole } from "@/server/actions/user.action";
import { UserType } from "@/types/UserType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DeleteItemDialog } from "./delete-item-dialog";

const UpdateRoleSchema = z.object({
  role: z.enum(["CLIENT", "PET_SITTER", "ADMIN"]),
});

interface UserDialogProps {
  user: UserType;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function UserDialog({ user, open = false, setOpen }: UserDialogProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof UpdateRoleSchema>>({
    resolver: zodResolver(UpdateRoleSchema),
    defaultValues: {
      role: user.role,
    },
  });

  const { mutateAsync: updateRoleMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (data) => {
      if (data?.data?.status === 200) {
        toast.success(data.data.message);
        router.refresh();
        setOpen(false);
      }
      if (data?.serverError) {
        toast.error(data.serverError);
      }
    },
  });

  const { mutateAsync: deleteUserMutate, status: deleteStatus } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      if (data?.data?.status === 200) {
        toast.success(data.data.message);
        setOpen(false);
      }
      if (data?.serverError) {
        toast.error(data.serverError);
      }
    },
  });

  const handleDelete = () => {
    toast.promise(deleteUserMutate({ id: user.id }), {
      loading: "Suppression en cours...",
    });
  };

  const onSubmit = async (values: z.infer<typeof UpdateRoleSchema>) => {
    toast.promise(
      updateRoleMutate({
        id: user.id,
        role: values.role,
      }),
      {
        loading: "Mise à jour en cours...",
      },
    );
  };

  const displayName = user.name || `${user.firstname} ${user.lastname}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{displayName}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.handleSubmit(onSubmit)();
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userRoleValues.map((value) => (
                          <SelectItem key={value} value={value}>
                            {displayUserRoleValues(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DeleteItemDialog
            handleDelete={handleDelete}
            description="Cette action est irréversible. Cet utilisateur sera définitivement supprimé."
            disabled={deleteStatus === "pending"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
