"use client";

import type { DocumentDto, DocumentVersionDto } from "@/shared/api/generated/types";
import cls from "./DocumentActions.module.scss";

type Props = {
  document: DocumentDto;
  version?: DocumentVersionDto | null;
  index: number;
  orderedLength: number;
  busy: boolean;
  onMove: (id: number, offset: -1 | 1) => void;
  onOpenFile: (document: DocumentDto, version: DocumentVersionDto) => void;
  onEdit: (document: DocumentDto) => void;
  onToggleVersion: (id: number) => void;
  onHistory: (id: number) => void;
  onShare: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function DocumentActions({ document, version, index, orderedLength, busy, onMove, onOpenFile, onEdit, onToggleVersion, onHistory, onShare, onDelete }: Props) {
  return (
    <div className={cls.actions}>
      <button type="button" onClick={() => onMove(document.id, -1)} disabled={index === 0 || busy}>Вверх</button>
      <button type="button" onClick={() => onMove(document.id, 1)} disabled={index === orderedLength - 1 || busy}>Вниз</button>
      {version ? <button type="button" onClick={() => onOpenFile(document, version)}>Открыть файл</button> : null}
      <button type="button" onClick={() => onEdit(document)}>Редактировать</button>
      <button type="button" onClick={() => onToggleVersion(document.id)}>Заменить файл</button>
      <button type="button" onClick={() => onHistory(document.id)}>Версии</button>
      {version ? <button type="button" onClick={() => onShare(document.id)}>Секретная ссылка</button> : null}
      <button type="button" onClick={() => onDelete(document.id)} disabled={busy}>Удалить полностью</button>
    </div>
  );
}
