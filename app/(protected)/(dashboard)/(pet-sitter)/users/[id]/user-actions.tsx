"use client";

import { DeleteItemDialog } from "@/components/delete-item-dialog";
import { Button } from "@/components/ui/button";
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
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserActionsProps {
  user: UserType;
}

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter();

  const { mutateAsync: updateRoleMutate } = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (data) => {
      if (data?.data?.status === 200) {
        toast.success(data.data.message);
        router.refresh();
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
        router.push("/users");
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

  const handleRoleChange = (role: UserType["role"]) => {
    toast.promise(
      updateRoleMutate({
        id: user.id,
        role,
      }),
      {
        loading: "Mise à jour en cours...",
      },
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={user.role} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sélectionner le rôle" />
        </SelectTrigger>
        <SelectContent>
          {userRoleValues.map((value) => (
            <SelectItem key={value} value={value}>
              {displayUserRoleValues(value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DeleteItemDialog
        handleDelete={handleDelete}
        description="Cette action est irréversible. Cet utilisateur sera définitivement supprimé."
        disabled={deleteStatus === "pending"}
      />
    </div>
  );
}
