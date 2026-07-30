"use client";

import { Box, Title, Button, Text } from "@mantine/core";

import type { DocumentVersionDto } from "@/shared/api/generated/types";
import DocumentShareLinks from "@/widgets/admin/DocumentShareLinks/DocumentShareLinks.client";
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

export default function DocumentVersionPanel({ documentId, versionDocumentId, versionFile, historyDocumentId, history, busy, onFileChange, onUpload, onCloseHistory, onMakeCurrent }: Props) {
  return <>
    {versionDocumentId === documentId ? <Box component="form" className={""} onSubmit={(event: any) => onUpload(event, documentId)}>
      <Title>Загрузить новую версию</Title>
      <Box component="input" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.jpeg,.png" onChange={(event: any) => onFileChange(event.target.files?.[0] ?? null)} required />
      <Button type="submit" disabled={busy}>Загрузить версию</Button>
      {versionFile ? <Text>{versionFile.name}</Text> : null}
    </Box> : null}
    {historyDocumentId === documentId ? <Box className={""} role="dialog" aria-label={`История версий ${documentId}`}>
      <Box className={""}><Title>История версий</Title><Button type="button" onClick={onCloseHistory} aria-label="Закрыть">×</Button></Box>
      {(history[documentId] ?? []).slice().sort((a, b) => b.versionNumber - a.versionNumber).map((item) => <Box className={""} data-testid={`version-row-${item.id}`} key={item.id}>
        <Box><Text>Версия {item.versionNumber}</Text>{item.isCurrent ? <Text className={""}>Текущая</Text> : null}</Box>
        <Text>{item.originalFilename}</Text><Text>{formatSize(item.sizeBytes)} · {formatDate(item.createdAt)}</Text>
        {!item.isCurrent ? <Button type="button" onClick={() => onMakeCurrent(documentId, item)} disabled={busy}>Сделать текущей</Button> : null}
        <DocumentShareLinks version={item} />
      </Box>)}
    </Box> : null}
  </>;
}
