"use client";

import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import type { AdminGlobalHtmlSection } from "@/shared/api/adapters/admin-page-layout.adapter";

type FormState = {
  name: string;
  html: string;
  css: string;
  javascript: string;
  iframeHeight: number;
};

const empty: FormState = {
  name: "",
  html: "",
  css: "",
  javascript: "",
  iframeHeight: 320,
};

export default function AdminGlobalHtmlSections({ initialSections }: { initialSections: AdminGlobalHtmlSection[] }) {
  const [sections, setSections] = useState(initialSections);
  const [editing, setEditing] = useState<AdminGlobalHtmlSection | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);

  const begin = (section?: AdminGlobalHtmlSection) => {
    setEditing(section ?? null);
    setForm(section ? {
      name: section.name,
      html: section.html ?? "",
      css: section.css ?? "",
      javascript: section.javascript ?? "",
      iframeHeight: section.iframeHeight ?? 320,
    } : empty);
    setOpened(true);
  };

  const reload = async () => {
    const response = await fetch("/api/admin/pages/global-sections", { cache: "no-store" });
    if (!response.ok) throw new Error("Не удалось обновить глобальные секции");
    setSections(await response.json() as AdminGlobalHtmlSection[]);
  };

  const save = async () => {
    setBusy(true);
    try {
      const response = await fetch(
        `/api/admin/pages/global-sections${editing ? `/${editing.definitionId}` : ""}`,
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            ...(editing ? { expectedDefinitionRevision: editing.revision } : {}),
          }),
        },
      );
      if (response.status === 409) {
        throw new Error("Секция была изменена в другой вкладке. Данные обновлены.");
      }
      if (!response.ok) throw new Error("Не удалось сохранить глобальную секцию");
      await reload();
      setOpened(false);
      notifications.show({ color: "teal", message: "Глобальная секция сохранена" });
    } catch (error) {
      await reload().catch(() => undefined);
      notifications.show({ color: "red", message: error instanceof Error ? error.message : "Ошибка сохранения" });
    } finally {
      setBusy(false);
    }
  };

  const remove = (section: AdminGlobalHtmlSection) => modals.openConfirmModal({
    title: "Удалить глобальную секцию?",
    children: <Text size="sm">Definition и её placements будут удалены со всех публичных страниц.</Text>,
    labels: { confirm: "Удалить", cancel: "Отмена" },
    confirmProps: { color: "red" },
    onConfirm: async () => {
      const response = await fetch(`/api/admin/pages/global-sections/${section.definitionId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedDefinitionRevision: section.revision }),
      });
      if (!response.ok) {
        notifications.show({ color: "red", message: "Не удалось удалить секцию" });
      }
      await reload();
    },
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Stack gap={2}>
          <Title order={2}>Глобальные секции</Title>
          <Text c="dimmed">
            Содержимое хранится один раз; порядок и видимость каждого placement управляются на соответствующей странице.
          </Text>
        </Stack>
        <Button leftSection={<IconPlus size={18} />} onClick={() => begin()}>Создать секцию</Button>
      </Group>
      {sections.length ? (
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {sections.map((section) => (
            <Card key={section.definitionId} withBorder shadow="sm">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Stack gap={1}>
                    <Title order={3} size="h5">{section.name}</Title>
                    <Text size="xs" c="dimmed">{section.key ?? `definition #${section.definitionId}`}</Text>
                  </Stack>
                  <Badge color="violet">GLOBAL_CUSTOM_HTML</Badge>
                </Group>
                <Group>
                  <Text size="sm">Placements: {section.totalPlacements}</Text>
                  <Text size="sm">Видимых: {section.visiblePlacements}</Text>
                  <Text size="sm">Скрытых: {section.hiddenPlacements}</Text>
                  <Text size="sm">Ревизия: {section.revision}</Text>
                </Group>
                <Box
                  component="iframe"
                  title={`Предпросмотр: ${section.name}`}
                  srcDoc={`<style>${section.css ?? ""}</style>${section.html ?? ""}<script>${section.javascript ?? ""}</script>`}
                  sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"
                  referrerPolicy="no-referrer"
                  w="100%"
                  h={Math.min(section.iframeHeight ?? 320, 260)}
                  bd="1px solid var(--mantine-color-gray-3)"
                />
                <Group justify="flex-end">
                  <ActionIcon variant="light" aria-label="Редактировать" onClick={() => begin(section)}>
                    <IconEdit size={17} />
                  </ActionIcon>
                  <ActionIcon color="red" variant="light" aria-label="Удалить" onClick={() => remove(section)}>
                    <IconTrash size={17} />
                  </ActionIcon>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Card withBorder><Text c="dimmed">Глобальные секции ещё не созданы.</Text></Card>
      )}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? "Редактирование глобальной секции" : "Новая глобальная секция"}
        size="xl"
      >
        <Stack>
          <TextInput label="Название" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.currentTarget.value }))} />
          <Textarea label="HTML" minRows={8} autosize value={form.html} onChange={(event) => setForm((current) => ({ ...current, html: event.currentTarget.value }))} />
          <Textarea label="CSS" minRows={4} autosize value={form.css} onChange={(event) => setForm((current) => ({ ...current, css: event.currentTarget.value }))} />
          <Textarea label="JavaScript" minRows={4} autosize value={form.javascript} onChange={(event) => setForm((current) => ({ ...current, javascript: event.currentTarget.value }))} />
          <NumberInput label="Высота iframe" min={120} max={4000} value={form.iframeHeight} onChange={(value) => setForm((current) => ({ ...current, iframeHeight: Number(value) || 320 }))} />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setOpened(false)}>Отмена</Button>
            <Button loading={busy} disabled={!form.name.trim() || !form.html.trim()} onClick={() => void save()}>Сохранить</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
