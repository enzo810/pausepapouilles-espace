"use client";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
} from "@/components/ui/combobox";
import { useDialogContainer } from "@/components/ui/dialog";
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
import { useSession } from "@/lib/auth-client";
import { assessmentValues, genderValues, speciesValues } from "@/lib/constants";
import {
  displayAssessmentValues,
  displayGenderValues,
  displaySpeciesValues,
} from "@/lib/utils";
import { CreateAnimalFormSchema } from "@/schemas/AnimalFormSchema";
import { createAnimal, updateAnimal } from "@/server/actions/animal.action";
import { getUsers } from "@/server/actions/user.action";
import { AnimalType } from "@/types/AnimalTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AnimalFormProps {
  setOpen?: (open: boolean) => void;
  animal?: AnimalType;
  userId?: string;
}

export function AnimalForm({ setOpen, animal, userId }: AnimalFormProps = {}) {
  const { data: session } = useSession();
  const router = useRouter();
  const isEditMode = !!animal;
  const dialogContainer = useDialogContainer();

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await getUsers();
      return users.data?.users ?? [];
    },
    enabled:
      session?.user.role === "ADMIN" || session?.user.role === "PET_SITTER",
    refetchInterval: 0,
    staleTime: Infinity,
  });

  const form = useForm<z.infer<typeof CreateAnimalFormSchema>>({
    resolver: zodResolver(CreateAnimalFormSchema),
    defaultValues: {
      name: animal?.name || "",
      age: animal?.age || 0,
      birthDate: animal?.birthDate || undefined,
      gender: animal?.gender || "MALE",
      species: animal?.species || undefined,
      otherSpecies: animal?.otherSpecies || "",
      type: animal?.type || "",
      isIdentified: animal?.isIdentified || false,
      diet: animal?.diet || "",
      treatsAllowed: animal?.treatsAllowed || false,
      temperamentNotes: animal?.temperamentNotes || "",
      childFriendly: animal?.childFriendly || undefined,
      dogFriendly: animal?.dogFriendly || undefined,
      trafficTolerance: animal?.trafficTolerance || undefined,
      socializationNotes: animal?.socializationNotes || "",
      fears: animal?.fears || "",
      sensitiveAreas: animal?.sensitiveAreas || "",
      healthIssues: animal?.healthIssues || false,
      careInstructions: animal?.careInstructions || "",
      additionalNotes: animal?.additionalNotes || "",
      userId: animal?.userId || userId || undefined,
      formData: undefined,
      imageUrl: undefined,
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
    const formDataWithFile = new FormData();
    if (values?.imageUrl?.[0]) {
      const blob = new Blob([values?.imageUrl?.[0] as BlobPart], {
        type: values?.imageUrl?.[0]?.type,
      });
      formDataWithFile.append("file", blob);
    }

    if (isEditMode && animal) {
      await mutateUpdateAnimal({
        ...values,
        id: animal.id,
        formData: formDataWithFile,
        imageUrl: undefined,
      });
    } else {
      await mutateCreateAnimal({
        ...values,
        formData: formDataWithFile,
        imageUrl: undefined,
      });
    }
  }

  const species = form.watch("species");
  const inputRef = form.register("imageUrl");

  // const userId = form.watch("userId");a
  // console.log("userId", userId);

  // console.log("usersData", usersData);

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

          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => {
              const users = usersData ?? [];
              const selectedUser = users.find((u) => u.id === field.value);
              return (
                <FormItem>
                  <FormLabel>Propriétaire</FormLabel>
                  <FormControl>
                    <Combobox
                      items={users}
                      modal={true}
                      value={selectedUser ?? null}
                      onValueChange={(user) => field.onChange(user?.id ?? null)}
                      itemToStringLabel={(user) => user.name ?? ""}
                      isItemEqualToValue={(item, value) =>
                        item?.id === value?.id
                      }
                    >
                      <ComboboxInput
                        placeholder="Sélectionner le propriétaire"
                        showClear
                      />
                      <ComboboxContent container={dialogContainer}>
                        {usersError ? (
                          <ComboboxStatus>
                            Une erreur est survenue
                          </ComboboxStatus>
                        ) : usersLoading ? (
                          <ComboboxStatus>Chargement...</ComboboxStatus>
                        ) : (
                          <>
                            <ComboboxEmpty>
                              Aucun propriétaire trouvé.
                            </ComboboxEmpty>
                            <ComboboxList>
                              {(user) => (
                                <ComboboxItem key={user.id} value={user}>
                                  {user.name}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </>
                        )}
                      </ComboboxContent>
                    </Combobox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={() => (
              <FormItem>
                <FormLabel>Photo de l'animal</FormLabel>
                <FormControl>
                  <Input {...inputRef} type="file" accept="image/*" />
                </FormControl>
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
