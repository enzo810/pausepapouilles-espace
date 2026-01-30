"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteItemDialogProps {
  handleDelete: () => void;
  triggerLabel?: string;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  disabled?: boolean;
}

export function DeleteItemDialog({
  handleDelete,
  triggerLabel = "Supprimer",
  title = "Êtes-vous sûr ?",
  description = "Cette action est irréversible. Cet élément sera définitivement supprimé.",
  cancelLabel = "Annuler",
  confirmLabel = "Supprimer",
  disabled = false,
}: DeleteItemDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-fit" disabled={disabled}>
          <Trash2 className="h-4 w-4 mr-2" />
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
