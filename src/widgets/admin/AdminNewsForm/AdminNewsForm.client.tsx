"use client";
/* eslint-disable @next/next/no-img-element -- blob and arbitrary external preview */

import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminNewsCategoryDto, AdminNewsDto } from "@/shared/api/generated/types";
import { classifyNewsCover, type ExistingNewsCover } from "@/shared/news/news-cover";
import { removeUploadedNewsCoverFromBrowser, uploadNewsCoverFromBrowser } from "@/shared/api/client/admin-news-media.client";
import { buildNewsActionFormData, type ServerCoverMutationInput } from "@/app/admin/(protected)/news/news-action-form-data";
import { createNewsFromBrowser, updateNewsFromBrowser } from "@/shared/api/client/admin-news.client";
import type { NewsMutationRequest } from "@/app/api/admin/news/_lib/news-mutation.schema";
import type { NewsFormValues } from "./AdminNewsForm.types";
import cls from "./AdminNewsForm.module.scss";

type Props = { categories: AdminNewsCategoryDto[]; initialData?: AdminNewsDto; mutation: { method: "create" | "update"; id?: string }; submitLabel: string };
type PublishMode = "draft" | "publish-now" | "schedule";
type EditorMode = "upload" | "external";
const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function dateLocal(value?: string | null) { if (!value) return ""; const d = new Date(value); return Number.isNaN(d.getTime()) ? "" : `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}T${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; }
function initialPublish(data?: AdminNewsDto): PublishMode { return data?.status === "scheduled" ? "schedule" : data?.status === "published" ? "publish-now" : "draft"; }
function validExternal(value: string) { try { const url = new URL(value); return /^https?:$/.test(url.protocol) && !url.username && !url.password; } catch { return false; } }
function size(value: number) { return `${(value / 1024 / 1024).toFixed(value >= 1024 * 1024 ? 1 : 2)} МБ`; }

export default function AdminNewsForm({ categories, initialData, mutation, submitLabel }: Props) {
  const initialCover = classifyNewsCover(initialData?.coverImageUrl);
  const [persistedCover] = useState<ExistingNewsCover>(initialCover);
  const [publishMode, setPublishMode] = useState<PublishMode>(initialPublish(initialData));
  const [editorMode, setEditorMode] = useState<EditorMode>(initialCover.kind === "external" ? "external" : "upload");
  const [externalUrl, setExternalUrl] = useState(initialCover.kind === "external" ? initialCover.url : "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [removeCover, setRemoveCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null); const formRef = useRef<HTMLFormElement>(null); const objectUrl = useRef<string | null>(null); const abort = useRef<AbortController | null>(null);
  const hidden = useRef({ kind: "unchanged", url: "", source: "", key: "" });
  const busy = uploading || saving;
  const pending = saving;
  const state = { values: undefined as NewsFormValues | undefined };
  const visiblePreview = removeCover ? "" : selectedFile ? preview : editorMode === "external" && externalUrl && validExternal(externalUrl.trim()) ? externalUrl.trim() : persistedCover.kind === "none" ? "" : persistedCover.url;

  useEffect(() => () => { abort.current?.abort(); if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);
  const clearFile = useCallback((clearInput = true) => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); objectUrl.current = null; setPreview(""); setSelectedFile(null); if (clearInput && fileRef.current) fileRef.current.value = ""; }, []);
  const choose = (file: File | null) => { setCoverError(null); clearFile(false); if (!file) return; if (file.size === 0) return setCoverError("Файл пустой."); if (file.size > MAX_BYTES) return setCoverError("Размер изображения не должен превышать 10 МБ."); if (!TYPES.has(file.type)) return setCoverError("Поддерживаются только JPG, PNG и WebP."); objectUrl.current = URL.createObjectURL(file); setPreview(objectUrl.current); setSelectedFile(file); setRemoveCover(false); };
  const remove = () => { clearFile(); setExternalUrl(""); setRemoveCover(true); setCoverError(null); };
  const setHidden = (kind: string, url = "", source = "", key = "") => { hidden.current = { kind, url, source, key }; const form = formRef.current!; (form.elements.namedItem("coverMutationKind") as HTMLInputElement).value = kind; (form.elements.namedItem("coverImageUrl") as HTMLInputElement).value = url; (form.elements.namedItem("coverImageSource") as HTMLInputElement).value = source; (form.elements.namedItem("pendingOwnedMediaKey") as HTMLInputElement).value = key; };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (busy) return; const form = event.currentTarget; setCoverError(null);
    if (removeCover) setHidden("remove");
    else if (selectedFile) {
      setUploading(true); abort.current = new AbortController();
      try { const uploaded = await uploadNewsCoverFromBrowser(selectedFile, abort.current.signal); setHidden("set", uploaded.url, "owned", uploaded.key); }
      catch (error) { setCoverError(error instanceof Error ? error.message : "Не удалось загрузить изображение."); setUploading(false); return; }
      setUploading(false);
    } else if (editorMode === "external") {
      const url = externalUrl.trim();
      if (!url) { if (persistedCover.kind !== "none") { setCoverError("Чтобы убрать текущее изображение, используйте кнопку «Удалить изображение». "); return; } setHidden("unchanged"); }
      else if (!validExternal(url)) { setCoverError("Укажите полный адрес изображения, начинающийся с http:// или https://"); return; }
      else if (persistedCover.kind === "external" && persistedCover.url === url) setHidden("unchanged"); else setHidden("set", url, "external");
    } else setHidden("unchanged");
    const coverMutation = hidden.current.kind === "set"
      ? { kind: "set" as const, url: hidden.current.url, source: hidden.current.source as "owned" | "external", key: hidden.current.key }
      : { kind: hidden.current.kind as "remove" | "unchanged" };
    let prepared: FormData;
    try { prepared = buildNewsActionFormData(form, coverMutation); }
    catch { setSubmitError("Не удалось подготовить данные новости."); return; }
    const input: NewsMutationRequest = {
      title: String(prepared.get("title") ?? ""), slug: String(prepared.get("slug") ?? ""), excerpt: String(prepared.get("excerpt") ?? ""), content: String(prepared.get("content") ?? ""), categoryId: String(prepared.get("categoryId") ?? ""), publishMode: String(prepared.get("publishMode") ?? "draft") as NewsMutationRequest["publishMode"], publishedAt: String(prepared.get("publishedAt") ?? "") || null, publishUntil: String(prepared.get("publishUntil") ?? "") || null, displayPublishedAt: String(prepared.get("displayPublishedAt") ?? "") || null,
      cover: { kind: coverMutation.kind, url: "url" in coverMutation ? coverMutation.url : undefined, source: "source" in coverMutation ? coverMutation.source : undefined, ...(coverMutation.key ? { pendingOwnedMediaKey: coverMutation.key } : {}) },
    };
    setSaving(true); setSubmitError(null);
    const result = mutation.method === "create" ? await createNewsFromBrowser(input) : await updateNewsFromBrowser(mutation.id!, input);
    setSaving(false);
    if (!result.ok) { setSubmitError(result.message); return; }
    window.location.assign("/admin/news");
  };
  const actionError = submitError;
  return <form ref={formRef} className={cls.form} onSubmit={submit}>
    <input type="hidden" name="coverMutationKind" defaultValue="unchanged" /><input type="hidden" name="coverImageUrl" defaultValue="" /><input type="hidden" name="coverImageSource" defaultValue="" /><input type="hidden" name="pendingOwnedMediaKey" defaultValue="" />
    <div className={cls.grid}>
      <label className={cls.spanFull}><span>Заголовок</span><input name="title" type="text" defaultValue={state.values?.title ?? initialData?.title ?? ""} required /></label>
      <label><span>Slug (необязательно)</span><input name="slug" type="text" defaultValue={state.values?.slug ?? initialData?.slug ?? ""} /><small>Оставьте поле пустым — адрес создастся автоматически из заголовка.</small></label>
      <label><span>Категория</span><select name="categoryId" defaultValue={state.values?.categoryId ?? (initialData?.category?.id ? String(initialData.category.id) : "")}><option value="">Без рубрики</option>{categories.map(x => <option key={x.id} value={x.id}>{x.title}</option>)}</select></label>
      <label className={cls.spanFull}><span>Краткое описание</span><textarea name="excerpt" rows={4} defaultValue={state.values?.excerpt ?? initialData?.excerpt ?? ""} required /></label>
      <label className={cls.spanFull}><span>Содержание</span><textarea name="content" rows={14} defaultValue={state.values?.content ?? initialData?.content ?? ""} required /></label>
      <section className={`${cls.coverCard} ${cls.spanFull}`} aria-labelledby="cover-title"><div><h2 id="cover-title">Обложка новости</h2><p>Добавьте JPG, PNG или WebP до 10 МБ.</p></div><div className={cls.imageModeSwitch}><button disabled={busy} type="button" data-active={editorMode === "upload"} onClick={() => setEditorMode("upload")}>Загрузить файл</button><button disabled={busy} type="button" data-active={editorMode === "external"} onClick={() => setEditorMode("external")}>Указать ссылку</button></div>
        {editorMode === "upload" ? <div className={cls.uploadArea}><input ref={fileRef} className={cls.fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => choose(e.target.files?.[0] ?? null)} aria-label="Файл изображения" /><button type="button" disabled={busy} onClick={() => fileRef.current?.click()}>{selectedFile || persistedCover.kind === "owned" ? "Заменить файл" : "Выбрать изображение"}</button><p>Перетащите изображение сюда или выберите файл</p></div> : <label><span>Ссылка на изображение</span><input type="text" inputMode="url" autoComplete="url" value={externalUrl} onChange={e => { setExternalUrl(e.target.value); setRemoveCover(false); }} /></label>}
        {visiblePreview ? <div className={cls.coverPreview}><img src={visiblePreview} alt="Предпросмотр изображения новости" /><div><strong>{selectedFile ? "Новое изображение" : persistedCover.kind === "owned" ? "Загружено с компьютера" : "Внешняя ссылка"}</strong><p>{selectedFile ? `${selectedFile.name} · ${size(selectedFile.size)}` : persistedCover.kind === "owned" ? persistedCover.filename : editorMode === "external" ? externalUrl : "Текущее изображение"}</p><button type="button" disabled={busy} onClick={() => fileRef.current?.click()}>Заменить</button><button type="button" disabled={busy} onClick={remove}>Удалить изображение</button>{selectedFile ? <button type="button" disabled={busy} onClick={() => clearFile()}>Убрать выбранный файл</button> : null}</div></div> : null}
        {coverError ? <p className={cls.error} role="alert">{coverError}</p> : null}
      </section>
      <label><span>Статус публикации</span><select name="publishMode" value={publishMode} onChange={e => setPublishMode(e.target.value as PublishMode)}><option value="draft">Черновик</option><option value="publish-now">Опубликовать сейчас</option><option value="schedule">Запланировать</option></select></label>
      {publishMode === "schedule" ? <label><span>Дата и время публикации</span><input name="publishedAt" type="datetime-local" defaultValue={state.values?.publishedAt ?? dateLocal(initialData?.publishedAt)} required /></label> : <div className={cls.modeHint}><span>Пояснение</span><p>{publishMode === "draft" ? "Запись сохранится без публикации в публичной ленте." : "Дата публикации будет установлена текущим временем."}</p></div>}<label><span>Показывать до (необязательно)</span><input name="publishUntil" type="datetime-local" /></label><label><span>Дата на сайте (необязательно)</span><input name="displayPublishedAt" type="datetime-local" defaultValue={dateLocal(initialData?.publishedAt)} /></label>
    </div>
    {actionError ? <p className={cls.error} role="alert">{actionError}</p> : null}<div className={cls.actions}><button type="submit" disabled={busy}>{uploading ? "Загрузка изображения…" : pending ? "Сохранение новости…" : submitLabel}</button></div>
  </form>;
}
