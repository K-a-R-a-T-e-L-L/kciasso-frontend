"use client";

import { ActionIcon, Box, Group, Menu } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import type { AdminNewsCategoryDto } from "@/shared/api/generated/types";
import DeleteNewsButton from "@/widgets/admin/DeleteNewsButton/DeleteNewsButton.client";
import NewsEditorTrigger from "@/widgets/admin/AdminNewsForm/NewsEditorTrigger.client";

export default function AdminNewsListActions({ id, categories, deleteAction }: {
  id: number;
  categories: AdminNewsCategoryDto[];
  deleteAction: () => Promise<void>;
}) {
  return <Group gap={4} justify="flex-end" wrap="nowrap">
    <NewsEditorTrigger categories={categories} newsId={id} />
    <Menu position="bottom-end" withinPortal>
      <Menu.Target><ActionIcon variant="subtle" aria-label="Дополнительные действия"><IconDotsVertical size={18}/></ActionIcon></Menu.Target>
      <Menu.Dropdown><Menu.Label>Новость</Menu.Label><Box px="xs"><DeleteNewsButton action={deleteAction}/></Box></Menu.Dropdown>
    </Menu>
  </Group>;
}
