"use client";

import {
  Alert,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useMemo, useState } from "react";
import type { DocumentPlacementDto } from "@/shared/api/generated/types";
import { placementTitle } from "@/shared/documents/document-placement-registry";

type Props = {
  documentId: number;
  placements: DocumentPlacementDto[];
  canManage: boolean;
  onRefresh: () => Promise<void>;
};
const labels: Record<string, string> = {
  DRAFT: "Скрыт",
  SCHEDULED: "Запланирован",
  PUBLISHED: "Показан",
};

export default function PlacementPublicationControls({
  documentId,
  placements,
  canManage,
  onRefresh,
}: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(placements[0]?.sectionKey ?? "");
  const [requestedAction, setRequestedAction] = useState("publish_now");
  const [from, setFrom] = useState("");
  const [until, setUntil] = useState("");

  const current = placements.find(
    (placement) => placement.sectionKey === selected,
  );
  const currentStatus = current?.publicationStatus ?? "DRAFT";
  const actionOptions = useMemo(() => {
    if (currentStatus === "SCHEDULED")
      return [
        { value: "publish_now", label: "Показывать сейчас" },
        { value: "schedule", label: "Изменить время показа" },
        { value: "draft", label: "Скрыть из раздела" },
      ];
    if (currentStatus === "PUBLISHED")
      return [
        { value: "schedule", label: "Запланировать показ" },
        { value: "draft", label: "Скрыть из раздела" },
      ];
    return [
      { value: "publish_now", label: "Показывать сейчас" },
      { value: "schedule", label: "Запланировать показ" },
    ];
  }, [currentStatus]);
  const action = actionOptions.some((item) => item.value === requestedAction)
    ? requestedAction
    : actionOptions[0].value;

  const submit = async () => {
    if (!current) return;
    setError("");
    const now = new Date();
    const start =
      action === "schedule"
        ? from
          ? new Date(from)
          : null
        : action === "publish_now"
          ? now
          : null;
    const end = until && action !== "draft" ? new Date(until) : null;
    if (action === "schedule" && (!start || start.getTime() <= now.getTime())) {
      setError("Начало запланированного показа должно быть в будущем.");
      return;
    }
    if (start && end && end.getTime() <= start.getTime()) {
      setError("Окончание показа должно быть позже начала.");
      return;
    }
    setBusy(true);
    try {
      const body: Record<string, string> = { command: action };
      if (from) body.publishFrom = new Date(from).toISOString();
      if (until && action !== "draft")
        body.publishUntil = new Date(until).toISOString();
      const response = await fetch(
        `/api/admin/documents/${documentId}/placements/${encodeURIComponent(current.sectionKey)}/publication`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!response.ok)
        throw new Error("Не удалось изменить видимость документа.");
      await onRefresh();
      setOpen(false);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Не удалось изменить видимость документа.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        variant="subtle"
        type="button"
        onClick={() => setOpen(true)}
        disabled={!canManage || !placements.length}
      >
        Видимость в разделе
      </Button>
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title="Видимость документа в разделе"
        centered
      >
        <Stack>
          <Alert color="blue">
            Настройка действует только для выбранного раздела. Файл и общий
            статус документа не меняются.
          </Alert>
          <Select
            label="Раздел"
            value={selected}
            onChange={(value) => {
              setSelected(value ?? "");
              setRequestedAction("publish_now");
            }}
            data={placements.map((placement) => ({
              value: placement.sectionKey,
              label: `${placementTitle(placement.sectionKey)} — ${labels[placement.publicationStatus] ?? placement.publicationStatus}`,
            }))}
          />
          <Alert
            color={
              currentStatus === "PUBLISHED"
                ? "teal"
                : currentStatus === "SCHEDULED"
                  ? "yellow"
                  : "gray"
            }
          >
            Сейчас: {labels[currentStatus] ?? "скрыт"}.
          </Alert>
          <Select
            label="Действие"
            value={action}
            onChange={(value) => setRequestedAction(value ?? "publish_now")}
            data={actionOptions}
          />
          {action === "schedule" ? (
            <TextInput
              type="datetime-local"
              required
              label="Начало показа"
              value={from}
              onChange={(event) => setFrom(event.currentTarget.value)}
            />
          ) : null}
          {action !== "draft" ? (
            <TextInput
              type="datetime-local"
              label="Окончание показа (необязательно)"
              value={until}
              onChange={(event) => setUntil(event.currentTarget.value)}
            />
          ) : null}
          {error ? <Alert color="red">{error}</Alert> : null}
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button loading={busy} onClick={submit}>
              Сохранить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
