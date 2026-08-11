"use client";

import { Button, type ButtonProps } from "@mantine/core";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import type { AdminNewsCategoryDto } from "@/shared/api/generated/types";
import NewsEditorDrawer from "./NewsEditorDrawer.client";

type Props = { categories: AdminNewsCategoryDto[]; newsId?: number } & Pick<ButtonProps, "size" | "variant">;

export default function NewsEditorTrigger({ categories, newsId, size, variant }: Props) {
  const [opened, setOpened] = useState(false);
  return <>
    <Button variant={variant ?? (newsId ? "light" : "filled")} size={size ?? (newsId ? "xs" : "sm")}
      leftSection={newsId ? <IconEdit size={15} /> : <IconPlus size={18} />} onClick={() => setOpened(true)}>
      {newsId ? "Изменить" : "Создать новость"}
    </Button>
    <NewsEditorDrawer categories={categories} newsId={newsId} opened={opened} onClose={() => setOpened(false)} />
  </>;
}
