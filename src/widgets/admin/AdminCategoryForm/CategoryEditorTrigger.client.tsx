"use client";

import { Button } from "@mantine/core";
import { useState } from "react";
import CategoryEditorDrawer from "./CategoryEditorDrawer.client";
import type { AdminCategoryFormState } from "./AdminCategoryForm.types";

export default function CategoryEditorTrigger({ action }: {
  action: (state: AdminCategoryFormState, formData: FormData) => Promise<AdminCategoryFormState>;
}) {
  const [opened, setOpened] = useState(false);
  return <>
    <Button onClick={() => setOpened(true)}>Создать рубрику</Button>
    <CategoryEditorDrawer opened={opened} onClose={() => setOpened(false)} action={action} />
  </>;
}
