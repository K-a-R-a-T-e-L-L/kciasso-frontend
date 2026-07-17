"use client";

import type { FormEvent } from "react";
import type { DocumentDto, DocumentVersionDto } from "@/shared/api/generated/types";
import { placementPageTitle, placementTitle } from "@/shared/documents/document-placement-registry";
import DocumentShareLinks from "@/widgets/admin/DocumentShareLinks/DocumentShareLinks.client";
import DocumentActions from "./DocumentActions.client";
import DocumentMetadataForm from "./DocumentMetadataForm.client";
import DocumentVersionPanel from "./DocumentVersionPanel.client";
import { formatDate, formatSize } from "./admin-document-response";
import type { FormState } from "./types";
import cls from "./DocumentCard.module.scss";

type Props = {
  document: DocumentDto;
  index: number;
  orderedLength: number;
  expanded: boolean;
  editing: boolean;
  versionDocumentId: number | null;
  shareDocumentId: number | null;
  historyDocumentId: number | null;
  versionFile: File | null;
  history: Record<number, DocumentVersionDto[]>;
  editingForm: FormState;
  editingPlacements: string[];
  busy: string | null;
  onToggleExpanded: (id: number) => void;
  onMove: (id: number, offset: -1 | 1) => void;
  onOpenFile: (document: DocumentDto, version: DocumentVersionDto) => void;
  onEdit: (document: DocumentDto) => void;
  onToggleVersion: (id: number) => void;
  onHistory: (id: number) => void;
  onShare: (id: number) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: "DRAFT" | "PUBLISHED") => void;
  onEditFieldChange: (key: keyof FormState, value: string) => void;
  onOpenPlacement: () => void;
  onSaveMetadata: (event: FormEvent<HTMLFormElement>, id: number) => void;
  onCancelEdit: () => void;
  onVersionFileChange: (file: File | null) => void;
  onUploadVersion: (event: FormEvent<HTMLFormElement>, id: number) => void;
  onCloseHistory: () => void;
  onMakeCurrent: (id: number, version: DocumentVersionDto) => void;
};

export default function DocumentCard({ document, index, orderedLength, expanded, editing, versionDocumentId, shareDocumentId, historyDocumentId, versionFile, history, editingForm, editingPlacements, busy, onToggleExpanded, onMove, onOpenFile, onEdit, onToggleVersion, onHistory, onShare, onDelete, onStatusChange, onEditFieldChange, onOpenPlacement, onSaveMetadata, onCancelEdit, onVersionFileChange, onUploadVersion, onCloseHistory, onMakeCurrent }: Props) {
  const version = document.currentVersion;
  const extension = version?.extension?.toUpperCase() ?? "—";
  return <article className={cls.card} data-testid={`document-card-${document.id}`}>
    <div className={cls.cardHeader}>
      <div><span className={cls.order}>{index + 1}</span><h2>{document.title}</h2><p>{document.documentNumber || "Без номера"} · {formatDate(document.documentDate)}</p></div>
      {document.canManage !== false ? <select value={document.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT"} disabled={Boolean(busy)} onChange={(event) => onStatusChange(document.id, event.target.value as "DRAFT" | "PUBLISHED")} aria-label={`Статус ${document.title}`}>
        <option value="DRAFT">Черновик</option><option value="PUBLISHED">Опубликован</option>
      </select> : <strong>Только просмотр</strong>}
    </div>
    <div className={cls.placements}>
      {(expanded ? document.placements : document.placements.slice(0, 3)).map((placement) => <span key={placement.sectionKey}>{placementPageTitle(placement.sectionKey)} · {placementTitle(placement.sectionKey)}</span>)}
      {document.placements.length > 3 ? <button type="button" className={cls.morePlacements} onClick={() => onToggleExpanded(document.id)}>{expanded ? "Свернуть" : `+ ещё ${document.placements.length - 3}`}</button> : null}
    </div>
    <p className={cls.note}>{document.status === "DRAFT" ? "Черновик не отображается публично; секретная ссылка может работать." : "Опубликованный документ отображается во всех выбранных разделах."}</p>
    <div className={cls.fileMeta}><strong>{extension}</strong><span>{version?.originalFilename ?? "Файл отсутствует"}</span><span>{formatSize(version?.sizeBytes)}</span></div>
    <DocumentActions document={document} version={version} index={index} orderedLength={orderedLength} busy={Boolean(busy)} onMove={onMove} onOpenFile={onOpenFile} onEdit={onEdit} onToggleVersion={onToggleVersion} onHistory={onHistory} onShare={onShare} onDelete={onDelete} />
    {document.canManage !== false && shareDocumentId === document.id && version ? <div className={cls.sharePanel}><DocumentShareLinks version={version} /></div> : null}
    {document.canManage !== false ? <details className={cls.technical}><summary>Техническая информация</summary><p>ID документа: {document.id} · версий: {document.versionsCount}</p><p>{version ? <>Версия {version.versionNumber} · {version.mimeType} · SHA-256: <code>{version.sha256}</code></> : "Текущая версия не определена."}</p></details> : null}
    {document.canManage !== false && editing ? <DocumentMetadataForm mode="edit" form={editingForm} onFieldChange={onEditFieldChange} placements={editingPlacements} onOpenPlacement={onOpenPlacement} onSubmit={(event) => onSaveMetadata(event, document.id)} busy={Boolean(busy)} onCancel={onCancelEdit} /> : null}
    {document.canManage !== false ? <DocumentVersionPanel documentId={document.id} versionDocumentId={versionDocumentId} versionFile={versionFile} historyDocumentId={historyDocumentId} history={history} busy={Boolean(busy)} onFileChange={onVersionFileChange} onUpload={onUploadVersion} onCloseHistory={onCloseHistory} onMakeCurrent={onMakeCurrent} /> : null}
  </article>;
}
