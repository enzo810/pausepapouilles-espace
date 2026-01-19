"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimalType } from "@/types/AnimalTypes";
import { ArrowLeft, Pencil } from "lucide-react";
import { useState } from "react";
import { Animal } from "./animal";
import { AnimalForm } from "./animal-form";

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
            <AnimalForm setOpen={setOpen} animal={animal} />
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="w-fit"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Modifier les informations
            </Button>
            <Animal animal={animal} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
