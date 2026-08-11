"use client";

import {
  Badge,
  Button,
  FileInput,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { DocumentVersionDto } from "@/shared/api/generated/types";
import { formatDate, formatSize } from "./admin-document-response";

type Props = {
  documentId: number;
  versionDocumentId: number | null;
  versionFile: File | null;
  historyDocumentId: number | null;
  history: Record<number, DocumentVersionDto[]>;
  busy: boolean;
  onFileChange: (file: File | null) => void;
  onUpload: (event: React.FormEvent<HTMLFormElement>, id: number) => void;
  onCloseHistory: () => void;
  onMakeCurrent: (id: number, version: DocumentVersionDto) => void;
};

export default function DocumentVersionPanel({
  documentId,
  versionDocumentId,
  versionFile,
  historyDocumentId,
  history,
  busy,
  onFileChange,
  onUpload,
  onCloseHistory,
  onMakeCurrent,
}: Props) {
  const versions = (history[documentId] ?? [])
    .slice()
    .sort((a, b) => b.versionNumber - a.versionNumber);
  return (
    <Stack gap="lg">
      {versionDocumentId === documentId ? (
        <Stack
          component="form"
          gap="md"
          onSubmit={
            ((event: React.FormEvent<HTMLFormElement>) =>
              onUpload(event, documentId)) as never
          }
        >
          <Title order={3}>Загрузить новую версию</Title>
          <FileInput
            label="Файл новой версии"
            description="PDF, документы Office, архивы или изображения"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.jpeg,.png"
            value={versionFile}
            onChange={onFileChange}
            required
          />
          <Group justify="flex-end">
            <Button type="submit" loading={busy}>
              Загрузить версию
            </Button>
          </Group>
        </Stack>
      ) : null}

      {historyDocumentId === documentId ? (
        <Stack gap="md" aria-label={`История версий ${documentId}`}>
          <Group justify="space-between">
            <Title order={3}>История версий</Title>
            <Button type="button" variant="default" onClick={onCloseHistory}>
              Закрыть
            </Button>
          </Group>
          {versions.length ? (
            versions.map((item) => (
              <Paper
                p="md"
                withBorder
                data-testid={`version-row-${item.id}`}
                key={item.id}
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text fw={700}>Версия {item.versionNumber}</Text>
                    {item.isCurrent ? (
                      <Badge color="teal">Текущая версия</Badge>
                    ) : null}
                  </Group>
                  <Text size="sm">{item.originalFilename}</Text>
                  <Text size="sm" c="dimmed">
                    {item.mimeType} · {formatSize(item.sizeBytes)} ·{" "}
                    {formatDate(item.createdAt)}
                  </Text>
                  <Group justify="space-between" align="flex-start">
                    {!item.isCurrent ? (
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => onMakeCurrent(documentId, item)}
                        disabled={busy}
                      >
                        Сделать текущей
                      </Button>
                    ) : (
                      <Text size="sm" c="dimmed">
                        Эта версия используется для скачивания.
                      </Text>
                    )}
                  </Group>
                </Stack>
              </Paper>
            ))
          ) : (
            <Paper p="lg" withBorder>
              <Text c="dimmed">История версий пока пуста.</Text>
            </Paper>
          )}
        </Stack>
      ) : null}
    </Stack>
  );
}
