"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { assessmentValues, genderValues, speciesValues } from "@/lib/constants";
import {
  displayAssessmentValues,
  displayGenderValues,
  displaySpeciesValues,
} from "@/lib/utils";
import { CreateAnimalFormSchema } from "@/schemas/AnimalFormSchema";
import { createAnimal, updateAnimal } from "@/server/actions/animal.action";
import { AnimalType } from "@/types/AnimalTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AnimalFormProps {
  setOpen?: (open: boolean) => void;
  animal?: AnimalType;
}

export function AnimalForm({ setOpen, animal }: AnimalFormProps = {}) {
  const router = useRouter();
  const isEditMode = !!animal;

  const form = useForm<z.infer<typeof CreateAnimalFormSchema>>({
    resolver: zodResolver(CreateAnimalFormSchema),
    defaultValues: animal
      ? {
          name: animal.name,
          age: animal.age,
          gender: animal.gender,
          species: animal.species,
          otherSpecies: animal.otherSpecies ?? "",
          type: animal.type,
          isIdentified: animal.isIdentified,
          diet: animal.diet,
          treatsAllowed: animal.treatsAllowed,
          temperamentNotes: animal.temperamentNotes,
          childFriendly: animal.childFriendly,
          dogFriendly: animal.dogFriendly,
          trafficTolerance: animal.trafficTolerance,
          socializationNotes: animal.socializationNotes,
          fears: animal.fears,
          sensitiveAreas: animal.sensitiveAreas,
          healthIssues: animal.healthIssues,
          careInstructions: animal.careInstructions,
          additionalNotes: animal.additionalNotes,
        }
      : {
          name: "",
          age: 0,
          gender: "MALE",
          species: "DOG",
          otherSpecies: "",
          type: "",
          isIdentified: false,
          diet: "",
          treatsAllowed: false,
          temperamentNotes: "",
          childFriendly: "GOOD",
          dogFriendly: "GOOD",
          trafficTolerance: "GOOD",
          socializationNotes: "",
          fears: "",
          sensitiveAreas: "",
          healthIssues: false,
          careInstructions: "",
          additionalNotes: "",
        },
  });

  const { mutateAsync: mutateCreateAnimal, isPending: isCreating } =
    useMutation({
      mutationFn: createAnimal,
      onSuccess: async (data) => {
        if (data?.data?.status === 200) {
          toast.success(data?.data?.message);
          form.reset();
          router.refresh();
          setOpen?.(false);
        }
        if (data?.serverError) {
          toast.error(data.serverError);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Une erreur est survenue");
      },
    });

  const { mutateAsync: mutateUpdateAnimal, isPending: isUpdating } =
    useMutation({
      mutationFn: updateAnimal,
      onSuccess: async (data) => {
        if (data?.data?.status === 200) {
          toast.success(data?.data?.message);
          router.refresh();
          setOpen?.(false);
        }
        if (data?.serverError) {
          toast.error(data.serverError);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Une erreur est survenue");
      },
    });

  const isPending = isCreating || isUpdating;

  async function onSubmit(values: z.infer<typeof CreateAnimalFormSchema>) {
    if (isEditMode && animal) {
      await mutateUpdateAnimal({ ...values, id: animal.id });
    } else {
      await mutateCreateAnimal(values);
    }
  }

  const species = form.watch("species");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nom de l'animal" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Âge</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    placeholder="Âge en années"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexe</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-row gap-6"
                  >
                    {genderValues.map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={value} />
                        <label
                          htmlFor={value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {displayGenderValues(value)}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Espèce</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'espèce" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {speciesValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {displaySpeciesValues(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {species === "OTHER" && (
            <FormField
              control={form.control}
              name="otherSpecies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autre espèce</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Précisez l'espèce" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type / Race</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Type ou race de l'animal" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isIdentified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Identifié (puce/tatouage)</FormLabel>
                  <FormDescription>
                    L'animal est-il identifié par une puce ou un tatouage ?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Régime alimentaire</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Régime alimentaire" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="treatsAllowed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Friandises autorisées</FormLabel>
                  <FormDescription>
                    Les friandises sont-elles autorisées ?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="temperamentNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes sur le tempérament</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Notes sur le tempérament de l'animal"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="childFriendly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ami avec les enfants</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assessmentValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {displayAssessmentValues(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dogFriendly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ami avec les chiens</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assessmentValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {displayAssessmentValues(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trafficTolerance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tolérance à la circulation</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assessmentValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {displayAssessmentValues(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="socializationNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes de socialisation</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Notes sur la socialisation"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peurs</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Peurs de l'animal" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sensitiveAreas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zones sensibles</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Zones sensibles à éviter" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="healthIssues"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Problèmes de santé</FormLabel>
                  <FormDescription>
                    L'animal a-t-il des problèmes de santé ?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="careInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions de soins</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Instructions de soins spécifiques"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes supplémentaires</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Notes supplémentaires" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditMode
                  ? "Mise à jour..."
                  : "Création..."
                : isEditMode
                  ? "Mettre à jour"
                  : "Créer l'animal"}
            </Button>
            <FieldDescription className="text-center">
              Tous les champs sont obligatoires
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
