"use client";

import { useState } from "react";
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Alert, Badge, Box, Button, Card, Collapse, Group, Modal, NumberInput, Paper, Stack, Switch, Text, Textarea, TextInput, Title, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import type { AdminPageLayout, AdminPageSection } from "@/shared/api/adapters/admin-page-layout.adapter";
import {
  PAGE_DND_SENSOR_OPTIONS,
  clampPreviewHeight,
  reorderSections,
  sectionActionModel,
  sectionUiModel,
} from "./admin-section-view-model";

type Props = {
  pageKey: string;
  initialData: AdminPageLayout;
  canManageCustomHtml: boolean;
};

type CustomForm = {
  name: string;
  html: string;
  css: string;
  javascript: string;
  iframeHeight: number;
};

const emptyCustom: CustomForm = {
  name: "Пользовательская HTML-секция",
  html: "",
  css: "",
  javascript: "",
  iframeHeight: 320,
};

const endpoint = (pageKey: string, suffix = "layout") =>
  `/api/admin/pages/${encodeURIComponent(pageKey)}/${suffix}`;

function SortableSection({
  section,
  index,
  disabled,
  onToggle,
  onEdit,
  onDelete,
}: {
  section: AdminPageSection;
  index: number;
  disabled: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.placementId,
    disabled: disabled || !section.canReorder,
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const model = sectionUiModel(section);
  const actions = sectionActionModel(section);
  const srcDoc = `<style>${section.css ?? ""}</style>${section.html ?? ""}<script>${section.javascript ?? ""}</script>`;

  return (
    <Card
      component="li"
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.7 : 1 }}
      p="md"
      withBorder
    >
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Group gap="sm" align="flex-start">
          {section.canReorder ? (
            <Tooltip label="Перетащите, чтобы изменить порядок">
              <Button
                variant="subtle"
                size="compact-md"
                {...attributes}
                {...listeners}
                aria-label={`Переместить секцию ${model.friendlyTitle}`}
                disabled={disabled}
              >
                ↕
              </Button>
            </Tooltip>
          ) : null}
          <Stack gap={3}>
            <Group gap="xs">
              <Text fw={700}>{index + 1}. {model.friendlyTitle}</Text>
              <Badge variant="light" color={model.badgeColor}>{model.badgeLabel}</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {model.friendlyDescription ?? model.immutableReason}
            </Text>
          </Stack>
        </Group>
        <Group gap="xs">
          <Switch
            checked={section.isVisible}
            onChange={onToggle}
            disabled={disabled || !section.canToggle}
            label="Видима"
          />
          {actions.edit ? <Button variant="subtle" onClick={onEdit} disabled={disabled}>
            Изменить
          </Button> : null}
          {actions.remove ? (
            <Button color="red" variant="subtle" onClick={onDelete} disabled={disabled}>
              Удалить
            </Button>
          ) : null}
          {actions.globalHref ? (
            <Button component={Link} href={actions.globalHref} variant="subtle">
              Открыть глобальную секцию
            </Button>
          ) : null}
          {model.settingsHref ? (
            <Button component={Link} href={model.settingsHref} variant="subtle">
              Настройки контактов
            </Button>
          ) : null}
        </Group>
      </Group>
      {actions.preview ? <>
        <Button variant="subtle" size="xs" onClick={() => setPreviewOpen((value) => !value)} aria-expanded={previewOpen}>{previewOpen ? "\u0421\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u0435\u0434\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440" : "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043f\u0440\u0435\u0434\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440"}</Button>
        <Collapse in={previewOpen}>
          {previewOpen ? (section.html ? <Box
            component="iframe"
            mt="md"
            w="100%"
            h={clampPreviewHeight(section.iframeHeight)}
            title={`Предпросмотр: ${section.name}`}
            srcDoc={srcDoc}
            sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"
            referrerPolicy="no-referrer"
          /> : <Text size="sm" c="dimmed">{"\u041f\u0440\u0435\u0434\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043f\u043e\u043a\u0430 \u043f\u0443\u0441\u0442"}</Text>) : null}
        </Collapse>
      </> : <Text mt="xs" size="sm" c="dimmed">Системный раздел отображается на публичной странице</Text>}
    </Card>
  );
}

export default function AdminPageLayoutEditor({
  pageKey,
  initialData,
  canManageCustomHtml,
}: Props) {
  const [sections, setSections] = useState(() => [...initialData.sections].sort((a, b) => a.sortOrder - b.sortOrder));
  const [revision, setRevision] = useState(initialData.revision);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<AdminPageSection | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [custom, setCustom] = useState<CustomForm>(emptyCustom);
  const sensors = useSensors(
    useSensor(PointerSensor, PAGE_DND_SENSOR_OPTIONS.pointer),
    useSensor(TouchSensor, PAGE_DND_SENSOR_OPTIONS.touch),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const acceptLayout = (data: AdminPageLayout) => {
    setSections([...data.sections].sort((a, b) => a.sortOrder - b.sortOrder));
    setRevision(data.revision);
  };

  const load = async () => {
    const response = await fetch(endpoint(pageKey), { cache: "no-store" });
    if (!response.ok) throw new Error("Не удалось загрузить секции страницы");
    acceptLayout(await response.json() as AdminPageLayout);
  };

  const mutate = async (url: string, method: "POST" | "PATCH" | "DELETE", body: object) => {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.status === 409) {
      await load().catch(() => undefined);
      throw new StaleLayoutError();
    }
    if (!response.ok) throw new Error("Не удалось сохранить изменения");
    acceptLayout(await response.json() as AdminPageLayout);
  };

  const saveOrder = async (next: AdminPageSection[], previous: AdminPageSection[]) => {
    setSections(next);
    setBusy(true);
    setError("");
    try {
      await mutate(endpoint(pageKey, "sections/reorder"), "POST", {
        sectionIds: next.map((item) => item.placementId),
        expectedRevision: revision,
      });
    } catch (reason) {
      if (reason instanceof StaleLayoutError) {
        const message = "Страница была изменена в другой вкладке. Загружен актуальный порядок.";
        setError(message);
        notifications.show({ color: "orange", message });
      } else {
        setSections(previous);
        const message = reason instanceof Error ? reason.message : "Не удалось сохранить порядок. Порядок восстановлен.";
        setError(message);
        notifications.show({ color: "red", message });
      }
    } finally {
      setBusy(false);
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id || busy) return;
    const previous = sections;
    const next = reorderSections(sections, Number(active.id), Number(over.id));
    if (next !== previous) void saveOrder(next, previous);
  };

  const toggle = async (section: AdminPageSection) => {
    setBusy(true);
    setError("");
    try {
      await mutate(endpoint(pageKey, `sections/${section.placementId}/toggle`), "POST", {
        isVisible: !section.isVisible,
        expectedRevision: revision,
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось изменить видимость");
    } finally {
      setBusy(false);
    }
  };

  const beginEdit = (section?: AdminPageSection) => {
    setEditing(section ?? null);
    setCustom(section ? {
      name: section.name,
      html: section.html ?? "",
      css: section.css ?? "",
      javascript: section.javascript ?? "",
      iframeHeight: section.iframeHeight ?? 320,
    } : emptyCustom);
    setModalOpen(true);
  };

  const saveCustom = async () => {
    if (!canManageCustomHtml || !custom.name.trim() || !custom.html.trim()) {
      setError("Заполните название и HTML-содержимое.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const suffix = editing ? `sections/${editing.placementId}` : "sections";
      await mutate(endpoint(pageKey, suffix), editing ? "PATCH" : "POST", {
        ...custom,
        expectedRevision: revision,
      });
      setEditing(null);
      setModalOpen(false);
      notifications.show({ title: "Сохранено", message: "HTML-секция обновлена", color: "green" });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось сохранить HTML-секцию");
    } finally {
      setBusy(false);
    }
  };

  const removeCustom = async (section: AdminPageSection) => {
    setBusy(true);
    setError("");
    try {
      await mutate(endpoint(pageKey, `sections/${section.placementId}`), "DELETE", { expectedRevision: revision });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось удалить секцию");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack data-testid="page-layout-editor" gap="lg">
      <Group justify="space-between" align="flex-start">
        <Stack gap={3}>
          <Text size="xs" fw={800} tt="uppercase" c="kciassoBlue.6">Редактор страниц</Text>
          <Title order={2}>Секции страницы: {initialData.title}</Title>
          <Text c="dimmed">{initialData.routePattern} · {sections.length} секций</Text>
        </Stack>
        {canManageCustomHtml ? <Button onClick={() => beginEdit()} disabled={busy}>Добавить HTML-секцию</Button> : null}
      </Group>
      {error ? <Alert color="red" role="alert">{error}</Alert> : null}
      {sections.length === 0 ? (
        <Paper p="xl"><Text c="dimmed">Для этой страницы пока нет сохранённых секций.</Text></Paper>
      ) : (
        <DndContext id="page-layout-editor-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={sections.map((item) => item.placementId)} strategy={verticalListSortingStrategy}>
            <Stack>
              {sections.map((section, index) => (
                <SortableSection
                  key={section.placementId}
                  section={section}
                  index={index}
                  disabled={busy}
                  onToggle={() => void toggle(section)}
                  onEdit={() => beginEdit(section)}
                  onDelete={() => void removeCustom(section)}
                />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      )}
      <Modal
        opened={canManageCustomHtml && modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? "Изменить HTML-секцию" : "Добавить HTML-секцию"}
        size="xl"
      >
        <Stack>
          <TextInput label="Название" value={custom.name} onChange={(event) => setCustom({ ...custom, name: event.currentTarget.value })} />
          <Textarea label="HTML" minRows={8} autosize value={custom.html} onChange={(event) => setCustom({ ...custom, html: event.currentTarget.value })} />
          <Textarea label="CSS" minRows={4} autosize value={custom.css} onChange={(event) => setCustom({ ...custom, css: event.currentTarget.value })} />
          <Textarea label="JavaScript" minRows={4} autosize value={custom.javascript} onChange={(event) => setCustom({ ...custom, javascript: event.currentTarget.value })} />
          <NumberInput label="Высота iframe" min={120} max={4000} value={custom.iframeHeight} onChange={(value) => setCustom({ ...custom, iframeHeight: Number(value) || 320 })} />
          <Button onClick={() => void saveCustom()} loading={busy}>{editing ? "Сохранить HTML-секцию" : "Создать HTML-секцию"}</Button>
        </Stack>
      </Modal>
    </Stack>
  );
}

class StaleLayoutError extends Error {
  constructor() {
    super("STALE_PAGE_LAYOUT_REVISION");
  }
}
