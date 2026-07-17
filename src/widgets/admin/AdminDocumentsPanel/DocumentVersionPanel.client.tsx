"use client";

import type { DocumentVersionDto } from "@/shared/api/generated/types";
import DocumentShareLinks from "@/widgets/admin/DocumentShareLinks/DocumentShareLinks.client";
import { formatDate, formatSize } from "./admin-document-response";
import cls from "./DocumentVersionPanel.module.scss";

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
    {versionDocumentId === documentId ? <form className={cls.inlineForm} onSubmit={(event) => onUpload(event, documentId)}>
      <h3>Загрузить новую версию</h3>
      <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.jpeg,.png" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} required />
      <button type="submit" disabled={busy}>Загрузить версию</button>
      {versionFile ? <small>{versionFile.name}</small> : null}
    </form> : null}
    {historyDocumentId === documentId ? <div className={cls.history} role="dialog" aria-label={`История версий ${documentId}`}>
      <div className={cls.historyHeader}><h3>История версий</h3><button type="button" onClick={onCloseHistory} aria-label="Закрыть">×</button></div>
      {(history[documentId] ?? []).slice().sort((a, b) => b.versionNumber - a.versionNumber).map((item) => <div className={cls.version} data-testid={`version-row-${item.id}`} key={item.id}>
        <div><strong>Версия {item.versionNumber}</strong>{item.isCurrent ? <span className={cls.current}>Текущая</span> : null}</div>
        <span>{item.originalFilename}</span><span>{formatSize(item.sizeBytes)} · {formatDate(item.createdAt)}</span>
        {!item.isCurrent ? <button type="button" onClick={() => onMakeCurrent(documentId, item)} disabled={busy}>Сделать текущей</button> : null}
        <DocumentShareLinks version={item} />
      </div>)}
    </div> : null}
  </>;
}
