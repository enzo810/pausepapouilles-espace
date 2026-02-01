"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { deleteAnimal } from "@/server/actions/animal.action";
import { AnimalType } from "@/types/AnimalTypes";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Animal } from "./animal";
import { AnimalForm } from "./animal-form";
import { DeleteItemDialog } from "./delete-item-dialog";
import { LoadingButton } from "./ui/loading-button";

interface AnimalDialogProps {
  animal: AnimalType;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AnimalDialog({
  animal,
  open = false,
  setOpen,
}: AnimalDialogProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { mutateAsync: deleteAnimalMutate, isPending: isDeleting } =
    useMutation({
      mutationFn: deleteAnimal,
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
    toast.promise(deleteAnimalMutate({ id: animal.id }), {
      loading: "Suppression en cours...",
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setIsEditing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="hidden">{animal.name}</DialogTitle>
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="w-fit"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <LoadingButton
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="w-fit"
                loading={isDeleting}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </LoadingButton>
              <DeleteItemDialog
                handleDelete={handleDelete}
                description="Cette action est irréversible. Cet animal sera définitivement supprimé."
              />
            </div>
          )}
        </DialogHeader>

        {isEditing ? (
          <AnimalForm setOpen={setOpen} animal={animal} type="update" />
        ) : (
          <Animal animal={animal} />
        )}
      </DialogContent>
    </Dialog>
  );
}
