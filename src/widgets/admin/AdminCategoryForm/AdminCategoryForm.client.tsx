"use client";

import { Alert, Button, Checkbox, Group, Stack, Textarea, TextInput } from "@mantine/core";
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
    <Stack component="form" gap="lg" {...({ action: formAction } as { action: typeof formAction })}>
      <TextInput
        label="Название"
        description="Видимое название рубрики в административной и публичной части."
        name="title"
        defaultValue={initialData?.title ?? ""}
        required
      />
      <TextInput
        label="Slug (необязательно)"
        description="Оставьте пустым — адрес создастся автоматически из названия."
        name="slug"
        defaultValue={initialData?.slug ?? ""}
      />
      <Textarea
        label="Описание"
        description="Короткое пояснение для редакторов."
        name="description"
        minRows={5}
        defaultValue={initialData?.description ?? ""}
      />
      <Checkbox
        name="isActive"
        label="Рубрика активна"
        description="Неактивная рубрика не предлагается для новых публикаций."
        defaultChecked={initialData?.isActive ?? true}
      />
      {state.error ? <Alert color="red" role="alert">{state.error}</Alert> : null}
      <Group justify="flex-end">
        <Button type="submit" loading={pending}>{submitLabel}</Button>
      </Group>
    </Stack>
  );
}
