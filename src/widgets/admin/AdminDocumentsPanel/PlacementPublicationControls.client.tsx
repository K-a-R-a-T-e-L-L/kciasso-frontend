"use client";
import { useState } from "react";
import type { DocumentPlacementDto } from "@/shared/api/generated/types";
import { placementTitle } from "@/shared/documents/document-placement-registry";

type Props = { documentId: number; placements: DocumentPlacementDto[]; canManage: boolean; onRefresh: () => Promise<void> };
const labels: Record<string, string> = { DRAFT: "Черновик", SCHEDULED: "Запланирован", PUBLISHED: "Опубликован" };

export default function PlacementPublicationControls({ documentId, placements, canManage, onRefresh }: Props) {
  const [open, setOpen] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [selected, setSelected] = useState(placements[0]?.sectionKey ?? ""), [action, setAction] = useState("publish_now");
  const [from, setFrom] = useState(""), [until, setUntil] = useState(""), [display, setDisplay] = useState("");
  const submit = async () => {
    const item = placements.find((p) => p.sectionKey === selected); if (!item) return;
    setBusy(true); setError("");
    try {
      const body: Record<string, string> = { command: action };
      if (from) body.publishFrom = new Date(from).toISOString(); if (until) body.publishUntil = new Date(until).toISOString(); if (display) body.displayPublishedAt = new Date(display).toISOString();
      const response = await fetch(`/api/admin/documents/${documentId}/placements/${encodeURIComponent(item.sectionKey)}/publication`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error("Не удалось изменить публикацию"); await onRefresh(); setOpen(false);
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось изменить публикацию"); } finally { setBusy(false); }
  };
  return <div data-testid={`placement-publication-${documentId}`}>
    <button type="button" onClick={() => setOpen((v) => !v)} disabled={!canManage || !placements.length}>Публикация раздела</button>
    {open ? <div role="dialog" aria-modal="true"><h4>Публикация размещений</h4>
      <label>Раздел<select value={selected} onChange={(e) => setSelected(e.target.value)}>{placements.map((p) => <option key={p.sectionKey} value={p.sectionKey}>{placementTitle(p.sectionKey)} — {labels[p.publicationStatus] ?? p.publicationStatus}</option>)}</select></label>
      <label>Действие<select value={action} onChange={(e) => setAction(e.target.value)}><option value="publish_now">Опубликовать сейчас</option><option value="schedule">Запланировать</option><option value="actualize">Актуализировать</option><option value="publish_as_of">Опубликовать от</option><option value="draft">В черновик</option></select></label>
      {action === "schedule" ? <label>Начало<input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} /></label> : null}
      {action === "publish_as_of" ? <label>Дата на сайте<input type="datetime-local" value={display} onChange={(e) => setDisplay(e.target.value)} /></label> : null}
      <label>Окончание<input type="datetime-local" value={until} onChange={(e) => setUntil(e.target.value)} /></label>
      {error ? <p role="alert">{error}</p> : null}<button type="button" onClick={submit} disabled={busy}>Сохранить</button><button type="button" onClick={() => setOpen(false)}>Закрыть</button>
    </div> : null}
  </div>;
}
