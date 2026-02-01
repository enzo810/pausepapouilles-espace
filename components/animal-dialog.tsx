"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAnimal } from "@/server/actions/animal.action";
import { AnimalType } from "@/types/AnimalTypes";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Animal } from "./animal";
import { AnimalForm } from "./animal-form";
import { DeleteItemDialog } from "./delete-item-dialog";

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

  const { mutateAsync: deleteAnimalMutate, status } = useMutation({
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{animal.name}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifier les informations de votre animal"
              : "Informations de votre animal"}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <AnimalForm setOpen={setOpen} animal={animal} type="update" />
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="w-fit"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <DeleteItemDialog
                handleDelete={handleDelete}
                description="Cette action est irréversible. Cet animal sera définitivement supprimé."
                disabled={status === "pending"}
              />
            </div>
            <Animal animal={animal} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
