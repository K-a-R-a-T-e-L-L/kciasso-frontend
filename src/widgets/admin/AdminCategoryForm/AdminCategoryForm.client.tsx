"use client";

import { Box, Text, Button } from "@mantine/core";

import { useActionState } from "react";
import type { AdminNewsCategoryDto } from "@/shared/api/generated/types";
import type { AdminCategoryFormState } from "./AdminCategoryForm.types";
import { adminCategoryFormInitialState } from "./AdminCategoryForm.types";

type Props = {
  initialData?: AdminNewsCategoryDto;
  action: (state: AdminCategoryFormState, formData: FormData) => Promise<AdminCategoryFormState>;
  submitLabel: string;
};

export default function AdminCategoryForm({ initialData, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, adminCategoryFormInitialState);

  return (
    <Box component="form" className={""} action={formAction}>
      <Box className={""}>
        <Box component="label">
          <Text>Название</Text>
          <Box component="input" type="text" name="title" defaultValue={initialData?.title ?? ""} required />
        </Box>

        <Box component="label">
          <Text>Slug (необязательно)</Text>
          <Box component="input" type="text" name="slug" defaultValue={initialData?.slug ?? ""} />
          <Text>Оставьте поле пустым — адрес создастся автоматически из названия.</Text>
        </Box>

        <Box component="label" className={""}>
          <Text>Описание</Text>
          <Box component="textarea" name="description" rows={5} defaultValue={initialData?.description ?? ""} />
        </Box>

        <Box component="label" className={""}>
          <Box component="input" type="checkbox" name="isActive" defaultChecked={initialData?.isActive ?? true} />
          <Text>Категория активна</Text>
        </Box>
      </Box>

      {state.error ? <Text className={""}>{state.error}</Text> : null}

      <Box className={""}>
        <Button type="submit" disabled={pending}>
          {pending ? "Сохранение..." : submitLabel}
        </Button>
      </Box>
    </Box>
  );
}
