"use client";
import type { FormEvent } from "react";
import type { FormState } from "./types";
import cls from "./DocumentMetadataForm.module.scss";
type Props = { mode: "create" | "edit"; form: FormState; onFieldChange: (key: keyof FormState, value: string) => void; placements: string[]; onOpenPlacement: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; busy: boolean; onCancel?: () => void; file?: File | null; onFileChange?: (file: File | null) => void };
export default function DocumentMetadataForm({ mode, form, onFieldChange, placements, onOpenPlacement, onSubmit, busy, onCancel, file, onFileChange }: Props) {
  const isCreate = mode === "create";
  return <form className={cls.inlineForm} onSubmit={onSubmit}>
    {!isCreate ? <h3>Редактирование документа</h3> : null}
    <label>Название<input value={form.title} onChange={(event) => onFieldChange("title", event.target.value)} required /></label>
    <label>Описание<textarea value={form.description} onChange={(event) => onFieldChange("description", event.target.value)} rows={3} /></label>
    <div className={cls.grid}><label>Номер<input value={form.documentNumber} onChange={(event) => onFieldChange("documentNumber", event.target.value)} /></label><label>Дата<input type="date" value={form.documentDate} onChange={(event) => onFieldChange("documentDate", event.target.value)} /></label></div>
    <button type="button" className={cls.placementSummaryButton} onClick={onOpenPlacement}>Выбрано разделов: {placements.length} · Изменить размещение</button>
    {isCreate ? <label>Файл<input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.jpeg,.png" onChange={(event) => onFileChange?.(event.target.files?.[0] ?? null)} required /></label> : null}
    <div className={cls.actions}><button type="submit" className={cls.primary} disabled={busy}>{busy ? (isCreate ? "Загрузка…" : "Сохранение…") : isCreate ? "Создать документ" : "Сохранить"}</button>{onCancel ? <button type="button" onClick={onCancel}>Отмена</button> : null}</div>
    {isCreate && file ? <small>{file.name}</small> : null}
  </form>;
}
