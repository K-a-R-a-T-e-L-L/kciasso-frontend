"use client";

import { ActionIcon, Box, Group, Menu } from "@mantine/core";
import { IconDotsVertical, IconEdit } from "@tabler/icons-react";
import AdminLinkButton from "@/shared/ui/admin/AdminLinkButton.client";
import DeleteNewsButton from "@/widgets/admin/DeleteNewsButton/DeleteNewsButton.client";

export default function AdminNewsListActions({ id, deleteAction }: { id: number; deleteAction: () => Promise<void> }) {
  return (
    <Group gap={4} justify="flex-end" wrap="nowrap">
      <AdminLinkButton href={`/admin/news/${id}/edit`} variant="light" size="xs" leftSection={<IconEdit size={15} />}>
        Изменить
      </AdminLinkButton>
      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon variant="subtle" aria-label="Дополнительные действия"><IconDotsVertical size={18} /></ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Новость</Menu.Label>
          <Box px="xs"><DeleteNewsButton action={deleteAction} /></Box>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
