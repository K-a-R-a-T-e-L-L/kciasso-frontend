"use client";

import { useRef, useState, type FormEvent } from "react";
import type { DocumentDto, DocumentVersionDto } from "@/shared/api/generated/types";
import FloatingPopover from "@/shared/ui/FloatingPopover/FloatingPopover.client";
import DocumentActions from "./DocumentActions.client";
import DocumentMetadataForm from "./DocumentMetadataForm.client";
import DocumentShareLinks from "@/widgets/admin/DocumentShareLinks/DocumentShareLinks.client";
import DocumentVersionPanel from "./DocumentVersionPanel.client";
import { placementTitle } from "@/shared/documents/document-placement-registry";
import { formatDate, formatSize } from "./admin-document-response";
import type { FormState } from "./types";
import cls from "./DocumentCard.module.scss";

export type DrawerSection = "technical" | "edit" | "replace" | "versions" | "share";
const ru = (s: string) => decodeURIComponent(s);
const statusLabels = { DRAFT: ru("%D0%A7%D0%B5%D1%80%D0%BD%D0%BE%D0%B2%D0%B8%D0%BA"), PUBLISHED: ru("%D0%9E%D0%BF%D1%83%D0%B1%D0%BB%D0%B8%D0%BA%D0%BE%D0%B2%D0%B0%D0%BD") } as const;

type Props = { document: DocumentDto; index: number; orderedLength: number; canReorder: boolean; expanded: boolean; editing: boolean; versionDocumentId: number | null; shareDocumentId: number | null; historyDocumentId: number | null; versionFile: File | null; history: Record<number, DocumentVersionDto[]>; editingForm: FormState; editingPlacements: string[]; busy: string | null; drawer: DrawerSection | null; onCloseDrawer: () => void; onToggleExpanded: (id: number) => void; onMove?: (id: number, offset: -1 | 1) => void; onOpenFile: (d: DocumentDto, v: DocumentVersionDto) => void; onEdit: (d: DocumentDto) => void; onToggleVersion: (id: number) => void; onHistory: (id: number) => void; onShare: (id: number) => void; onTechnical: (id: number) => void; onDelete: (id: number) => void; onStatusChange: (id: number, status: "DRAFT" | "PUBLISHED") => void; onEditFieldChange: (key: keyof FormState, value: string) => void; onOpenPlacement: () => void; onSaveMetadata: (e: FormEvent<HTMLFormElement>, id: number) => void; onCancelEdit: () => void; onVersionFileChange: (f: File | null) => void; onUploadVersion: (e: FormEvent<HTMLFormElement>, id: number) => void; onCloseHistory: () => void; onMakeCurrent: (id: number, v: DocumentVersionDto) => void };

export default function DocumentCard(p: Props) {
  const version = p.document.currentVersion;
  const shown = p.document.placements.slice(0, 2);
  const extra = Math.max(0, p.document.placements.length - shown.length);
  const placementRef = useRef<HTMLButtonElement>(null);
  const [placementQuery, setPlacementQuery] = useState("");
  const filteredPlacements = p.document.placements.filter((item) => placementTitle(item.sectionKey).toLocaleLowerCase("ru-RU").includes(placementQuery.trim().toLocaleLowerCase("ru-RU")));

  return <article className={cls.card} data-testid={`document-card-${p.document.id}`}>
    <div className={cls.cardHeader}>
      <div className={cls.titleRow}><span className={cls.order}>{p.index + 1}</span><div><h2>{p.document.title}</h2><p>{p.document.documentNumber || ru("%D0%91%D0%B5%D0%B7%20%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%D0%B0")} · {formatDate(p.document.documentDate)}</p></div></div>
      {p.document.canManage !== false ? <label className={cls.statusControl}><span className={cls.srOnly}>Статус {p.document.title}</span><select value={p.document.status} onChange={(e) => p.onStatusChange(p.document.id, e.target.value as "DRAFT" | "PUBLISHED")} aria-label={`Status ${p.document.title}`}><option value="DRAFT">{statusLabels.DRAFT}</option><option value="PUBLISHED">{statusLabels.PUBLISHED}</option></select></label> : <strong className={cls.viewOnly}>Только просмотр</strong>}
    </div>
    <div className={cls.placements}>
      {shown.map((item) => <span key={item.sectionKey}>{placementTitle(item.sectionKey)}</span>)}
      {extra ? <><button ref={placementRef} className={cls.morePlacements} type="button" aria-haspopup="dialog" aria-expanded={p.expanded} onClick={() => p.onToggleExpanded(p.document.id)}>+ ещё {extra}</button><FloatingPopover anchorRef={placementRef} open={p.expanded} onClose={() => p.onToggleExpanded(p.document.id)} role="dialog" placement="bottom-start"><div className={cls.placementPopup}><header><div><strong>Все размещения</strong><span>{p.document.placements.length} разделов</span></div><button type="button" className={cls.popupClose} aria-label="Закрыть" onClick={() => p.onToggleExpanded(p.document.id)}>×</button></header>{p.document.placements.length > 12 ? <label className={cls.placementSearch}><span className={cls.srOnly}>Найти размещение</span><input value={placementQuery} onChange={(e) => setPlacementQuery(e.target.value)} placeholder="Найти размещение" /></label> : null}<div className={cls.placementRows}>{filteredPlacements.map((item) => <span key={item.sectionKey}>{placementTitle(item.sectionKey)}</span>)}{filteredPlacements.length === 0 ? <em>Ничего не найдено</em> : null}</div></div></FloatingPopover></> : null}
    </div>
    <div className={cls.meta}><strong>{version?.extension?.toUpperCase() ?? "—"}</strong><span title={version?.originalFilename ?? ""}>{version?.originalFilename ?? "Файл недоступен"}</span><span>{formatSize(version?.sizeBytes)}</span></div>
    {p.canReorder && p.onMove ? <div className={cls.reorder}><button type="button" aria-label="Вверх" title="Переместить вверх" disabled={p.index === 0} onClick={() => p.onMove?.(p.document.id, -1)}>↑</button><span>{p.index + 1}</span><button type="button" aria-label="Вниз" title="Переместить вниз" disabled={p.index === p.orderedLength - 1} onClick={() => p.onMove?.(p.document.id, 1)}>↓</button></div> : null}
    <DocumentActions document={p.document} version={version} index={p.index} orderedLength={p.orderedLength} busy={Boolean(p.busy)} canReorder={p.canReorder} onMove={p.onMove} onOpenFile={p.onOpenFile} onEdit={p.onEdit} onToggleVersion={p.onToggleVersion} onHistory={p.onHistory} onShare={p.onShare} onTechnical={p.onTechnical} onDelete={p.onDelete} />
    {p.drawer ? <div className={cls.drawerBackdrop} onMouseDown={p.onCloseDrawer}><aside className={cls.drawer} role="dialog" aria-modal="true" aria-labelledby={`document-drawer-title-${p.document.id}`} tabIndex={-1} onMouseDown={(e) => e.stopPropagation()}><header><h3 id={`document-drawer-title-${p.document.id}`}>{p.document.title}</h3><button type="button" onClick={p.onCloseDrawer} aria-label="Close">×</button></header><div className={cls.drawerBody}>{p.drawer === "technical" ? <p>ID: {p.document.id}<br />Версий: {p.document.versionsCount}</p> : null}{p.drawer === "edit" ? <DocumentMetadataForm mode="edit" form={p.editingForm} onFieldChange={p.onEditFieldChange} placements={p.editingPlacements} onOpenPlacement={p.onOpenPlacement} onSubmit={(e) => p.onSaveMetadata(e, p.document.id)} busy={Boolean(p.busy)} onCancel={p.onCancelEdit} /> : null}{p.drawer === "share" && version ? <DocumentShareLinks version={version} /> : null}{p.drawer === "replace" || p.drawer === "versions" ? <DocumentVersionPanel documentId={p.document.id} versionDocumentId={p.versionDocumentId} versionFile={p.versionFile} historyDocumentId={p.historyDocumentId} history={p.history} busy={Boolean(p.busy)} onFileChange={p.onVersionFileChange} onUpload={(e) => p.onUploadVersion(e, p.document.id)} onCloseHistory={p.onCloseHistory} onMakeCurrent={p.onMakeCurrent} /> : null}</div></aside></div> : null}
  </article>;
}
