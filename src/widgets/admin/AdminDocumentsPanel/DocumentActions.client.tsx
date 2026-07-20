"use client";

import { useRef, useState } from "react";
import { IconEdit, IconFileUpload, IconHistory, IconInfoCircle, IconLink, IconTrash, IconDots, IconArrowUp, IconArrowDown } from "@tabler/icons-react";
import type { DocumentDto, DocumentVersionDto } from "@/shared/api/generated/types";
import FloatingPopover from "@/shared/ui/FloatingPopover/FloatingPopover.client";
import cls from "./DocumentActions.module.scss";

type Props = { document: DocumentDto; version?: DocumentVersionDto | null; index: number; orderedLength: number; busy: boolean; onMove?: (id: number, offset: -1 | 1) => void; canReorder?: boolean; onOpenFile: (d: DocumentDto, v: DocumentVersionDto) => void; onEdit: (d: DocumentDto) => void; onToggleVersion: (id: number) => void; onHistory: (id: number) => void; onShare: (id: number) => void; onTechnical: (id: number) => void; onDelete: (id: number) => void };
const ru = (s: string) => decodeURIComponent(s);
const labels = { open: ru("%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D1%8C"), edit: ru("%D0%A0%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C"), menu: ru("%D0%94%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D1%8F%20%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0") };

export default function DocumentActions({ document: doc, version, index, orderedLength, busy, onMove, canReorder, onOpenFile, onEdit, onToggleVersion, onHistory, onShare, onTechnical, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  const item = (label: string, icon: React.ReactNode, fn: () => void, disabled = false, destructive = false) => <button className={destructive ? cls.destructive : undefined} role="menuitem" type="button" disabled={disabled} onClick={() => { close(); if (triggerRef.current && document.contains(triggerRef.current)) triggerRef.current.focus(); fn(); }}><span className={cls.menuIcon}>{icon}</span>{label}</button>;
  return <div className={cls.actions}>
    {version ? <button type="button" onClick={() => onOpenFile(doc, version)}><IconFileUpload size={17} aria-hidden="true" />{labels.open}</button> : null}
    {doc.canManage !== false ? <button type="button" onClick={() => onEdit(doc)}><IconEdit size={17} aria-hidden="true" />{labels.edit}</button> : null}
    {doc.canManage !== false ? <><button ref={triggerRef} className={cls.menuTrigger} type="button" aria-label={labels.menu} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}><IconDots size={19} aria-hidden="true" /></button><FloatingPopover anchorRef={triggerRef} open={open} onClose={close} role="menu" placement="bottom-end"><div className={cls.menu}>{item(ru("%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B8%D1%82%D1%8C%20%D1%84%D0%B0%D0%B9%D0%BB"), <IconFileUpload size={18} />, () => onToggleVersion(doc.id))}{item(ru("%D0%92%D0%B5%D1%80%D1%81%D0%B8%D0%B8"), <IconHistory size={18} />, () => onHistory(doc.id))}{version ? item(ru("%D0%A1%D0%B5%D0%BA%D1%80%D0%B5%D1%82%D0%BD%D0%B0%D1%8F%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B0"), <IconLink size={18} />, () => onShare(doc.id)) : null}{item(ru("%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F"), <IconInfoCircle size={18} />, () => onTechnical(doc.id))}{canReorder && onMove ? <>{item(ru("%D0%92%D0%B2%D0%B5%D1%80%D1%85"), <IconArrowUp size={18} />, () => onMove(doc.id, -1), index === 0 || busy)}{item(ru("%D0%92%D0%BD%D0%B8%D0%B7"), <IconArrowDown size={18} />, () => onMove(doc.id, 1), index === orderedLength - 1 || busy)}</> : null}<div className={cls.menuSeparator} />{item(ru("%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C"), <IconTrash size={18} />, () => onDelete(doc.id), busy, true)}</div></FloatingPopover></> : null}
  </div>;
}
