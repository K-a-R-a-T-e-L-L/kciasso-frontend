"use client";

import { Box, Text, Title, Button, Image } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AdminNewsCategoryDto,
  AdminNewsDto,
} from "@/shared/api/generated/types";
import {
  classifyNewsCover,
  type ExistingNewsCover,
} from "@/shared/news/news-cover";
import {
  removeUploadedNewsCoverFromBrowser,
  uploadNewsCoverFromBrowser,
} from "@/shared/api/client/admin-news-media.client";
import { importNewsCoverFromBrowser } from "@/shared/api/client/admin-news-media-import.client";
import {
  buildNewsActionFormData,
  type ServerCoverMutationInput,
} from "@/app/admin/(protected)/news/news-action-form-data";
import {
  createNewsFromBrowser,
  updateNewsFromBrowser,
} from "@/shared/api/client/admin-news.client";
import type { NewsMutationRequest } from "@/app/api/admin/news/_lib/news-mutation.schema";
import type { NewsFormValues } from "./AdminNewsForm.types";

type Props = {
  categories: AdminNewsCategoryDto[];
  initialData?: AdminNewsDto;
  mutation: { method: "create" | "update"; id?: string };
  submitLabel: string;
};
type PublishMode = "draft" | "publish-now" | "schedule";
type EditorMode = "upload" | "external";
const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function dateLocal(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? ""
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function initialPublish(data?: AdminNewsDto): PublishMode {
  return data?.status === "scheduled"
    ? "schedule"
    : data?.status === "published"
      ? "publish-now"
      : "draft";
}
function validExternal(value: string) {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
}
function size(value: number) {
  return `${(value / 1024 / 1024).toFixed(value >= 1024 * 1024 ? 1 : 2)} МБ`;
}

export default function AdminNewsForm({
  categories,
  initialData,
  mutation,
  submitLabel,
}: Props) {
  const initialCover = classifyNewsCover(initialData?.coverImageUrl);
  const [persistedCover] = useState<ExistingNewsCover>(initialCover);
  const [publishMode, setPublishMode] = useState<PublishMode>(
    initialPublish(initialData),
  );
  const [editorMode, setEditorMode] = useState<EditorMode>(
    initialCover.kind === "external" ? "external" : "upload",
  );
  const [externalUrl, setExternalUrl] = useState(
    initialCover.kind === "external" ? initialCover.url : "",
  );
  const [importedMedia, setImportedMedia] = useState<{
    mediaId: number;
    url: string;
    key: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [removeCover, setRemoveCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const objectUrl = useRef<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  const hidden = useRef({ kind: "unchanged", url: "", source: "", key: "" });
  const busy = uploading || saving;
  const pending = saving;
  const state = { values: undefined as NewsFormValues | undefined };
  const visiblePreview = removeCover
    ? ""
    : selectedFile
      ? preview
      : importedMedia
        ? importedMedia.url
        : persistedCover.kind === "owned"
          ? persistedCover.url
          : "";

  useEffect(
    () => () => {
      abort.current?.abort();
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );
  const clearFile = useCallback((clearInput = true) => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    setPreview("");
    setSelectedFile(null);
    if (clearInput && fileRef.current) fileRef.current.value = "";
  }, []);
  const choose = (file: File | null) => {
    setCoverError(null);
    clearFile(false);
    if (!file) return;
    if (file.size === 0) return setCoverError("Файл пустой.");
    if (file.size > MAX_BYTES)
      return setCoverError("Размер изображения не должен превышать 10 МБ.");
    if (!TYPES.has(file.type))
      return setCoverError("Поддерживаются только JPG, PNG и WebP.");
    objectUrl.current = URL.createObjectURL(file);
    setPreview(objectUrl.current);
    setSelectedFile(file);
    setRemoveCover(false);
  };
  const remove = () => {
    clearFile();
    setExternalUrl("");
    setRemoveCover(true);
    setCoverError(null);
  };
  const setHidden = (kind: string, url = "", source = "", key = "") => {
    hidden.current = { kind, url, source, key };
    const form = formRef.current!;
    (form.elements.namedItem("coverMutationKind") as HTMLInputElement).value =
      kind;
    (form.elements.namedItem("coverImageUrl") as HTMLInputElement).value = url;
    (form.elements.namedItem("coverImageSource") as HTMLInputElement).value =
      source;
    (
      form.elements.namedItem("pendingOwnedMediaKey") as HTMLInputElement
    ).value = key;
  };
  const importExternal = async () => {
    const url = externalUrl.trim();
    if (!validExternal(url))
      return setCoverError("Укажите полный URL изображения.");
    setUploading(true);
    try {
      const result = await importNewsCoverFromBrowser(url);
      setImportedMedia({ ...result, key: result.url.split("/").pop() ?? "" });
      setCoverError(null);
    } catch (error) {
      setCoverError(
        error instanceof Error
          ? error.message
          : "Не удалось импортировать изображение.",
      );
    } finally {
      setUploading(false);
    }
  };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    setCoverError(null);
    if (removeCover) setHidden("remove");
    else if (selectedFile) {
      setUploading(true);
      abort.current = new AbortController();
      try {
        const uploaded = await uploadNewsCoverFromBrowser(
          selectedFile,
          abort.current.signal,
        );
        setHidden("set", uploaded.url, "owned", uploaded.key);
      } catch (error) {
        setCoverError(
          error instanceof Error
            ? error.message
            : "Не удалось загрузить изображение.",
        );
        setUploading(false);
        return;
      }
      setUploading(false);
    } else if (importedMedia) {
      setHidden("set", importedMedia.url, "owned", importedMedia.key);
    } else if (editorMode === "external") {
      const url = externalUrl.trim();
      if (!url) {
        if (persistedCover.kind !== "none") {
          setCoverError(
            "Чтобы убрать текущее изображение, используйте кнопку «Удалить изображение». ",
          );
          return;
        }
        setHidden("unchanged");
      } else if (!validExternal(url)) {
        setCoverError(
          "Укажите полный адрес изображения, начинающийся с http:// или https://",
        );
        return;
      } else if (
        persistedCover.kind === "external" &&
        persistedCover.url === url
      )
        setHidden("unchanged");
      else {
        setCoverError("Сначала загрузите изображение на сервер.");
        return;
      }
    } else setHidden("unchanged");
    const coverMutation =
      hidden.current.kind === "set"
        ? {
            kind: "set" as const,
            url: hidden.current.url,
            source: hidden.current.source as "owned" | "external",
            key: hidden.current.key,
          }
        : { kind: hidden.current.kind as "remove" | "unchanged" };
    let prepared: FormData;
    try {
      prepared = buildNewsActionFormData(form, coverMutation);
    } catch {
      setSubmitError("Не удалось подготовить данные новости.");
      return;
    }
    const input: NewsMutationRequest = {
      title: String(prepared.get("title") ?? ""),
      slug: String(prepared.get("slug") ?? ""),
      excerpt: String(prepared.get("excerpt") ?? ""),
      content: String(prepared.get("content") ?? ""),
      categoryId: String(prepared.get("categoryId") ?? ""),
      publishMode: String(
        prepared.get("publishMode") ?? "draft",
      ) as NewsMutationRequest["publishMode"],
      publishedAt: String(prepared.get("publishedAt") ?? "") || null,
      publishUntil: String(prepared.get("publishUntil") ?? "") || null,
      displayPublishedAt:
        String(prepared.get("displayPublishedAt") ?? "") || null,
      cover: {
        kind: coverMutation.kind,
        url: "url" in coverMutation ? coverMutation.url : undefined,
        source: "source" in coverMutation ? coverMutation.source : undefined,
        ...(coverMutation.key
          ? { pendingOwnedMediaKey: coverMutation.key }
          : {}),
        ...(importedMedia ? { mediaId: importedMedia.mediaId } : {}),
      },
    };
    setSaving(true);
    setSubmitError(null);
    const result =
      mutation.method === "create"
        ? await createNewsFromBrowser(input)
        : await updateNewsFromBrowser(mutation.id!, input);
    setSaving(false);
    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }
    window.location.assign("/admin/news");
  };
  const actionError = submitError;
  return (
    <Box component="form" ref={formRef} className={""} onSubmit={submit}>
      <Box component="input" type="hidden" name="coverMutationKind" defaultValue="unchanged" />
      <Box component="input" type="hidden" name="coverImageUrl" defaultValue="" />
      <Box component="input" type="hidden" name="coverImageSource" defaultValue="" />
      <Box component="input" type="hidden" name="pendingOwnedMediaKey" defaultValue="" />
      <Box className={""}>
        <Box component="label" className={""}>
          <Text>Заголовок</Text>
          <Box component="input"
            name="title"
            type="text"
            defaultValue={state.values?.title ?? initialData?.title ?? ""}
            required
          />
        </Box>
        <Box component="label">
          <Text>Slug (необязательно)</Text>
          <Box component="input"
            name="slug"
            type="text"
            defaultValue={state.values?.slug ?? initialData?.slug ?? ""}
          />
          <Text>
            Оставьте поле пустым — адрес создастся автоматически из заголовка.
          </Text>
        </Box>
        <Box component="label">
          <Text>Категория</Text>
          <Box component="select"
            name="categoryId"
            defaultValue={
              state.values?.categoryId ??
              (initialData?.category?.id ? String(initialData.category.id) : "")
            }
          >
            <Box component="option" value="">Без рубрики</Box>
            {categories.map((x) => (
              <Box component="option" key={x.id} value={x.id}>
                {x.title}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="label" className={""}>
          <Text>Краткое описание</Text>
          <Box component="textarea"
            name="excerpt"
            rows={4}
            defaultValue={state.values?.excerpt ?? initialData?.excerpt ?? ""}
            required
          />
        </Box>
        <Box component="label" className={""}>
          <Text>Содержание</Text>
          <Box component="textarea"
            name="content"
            rows={14}
            defaultValue={state.values?.content ?? initialData?.content ?? ""}
            required
          />
        </Box>
        <Box component="section"
          className={`${""} ${""}`}
          aria-labelledby="cover-title"
        >
          <Box>
            <Title id="cover-title">Обложка новости</Title>
            <Text>Добавьте JPG, PNG или WebP до 10 МБ.</Text>
          </Box>
          <Box className={""}>
            <Button
              disabled={busy}
              type="button"
              data-active={editorMode === "upload"}
              onClick={() => setEditorMode("upload")}
            >
              Загрузить файл
            </Button>
            <Button
              disabled={busy}
              type="button"
              data-active={editorMode === "external"}
              onClick={() => setEditorMode("external")}
            >
              Указать ссылку
            </Button>
          </Box>
          {editorMode === "upload" ? (
            <Box className={""}>
              <Box component="input"
                ref={fileRef}
                className={""}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e: any) => choose(e.target.files?.[0] ?? null)}
                aria-label="Файл изображения"
              />
              <Button
                type="button"
                disabled={busy}
                onClick={() => fileRef.current?.click()}
              >
                {selectedFile || persistedCover.kind === "owned"
                  ? "Заменить файл"
                  : "Выбрать изображение"}
              </Button>
              <Text>Перетащите изображение сюда или выберите файл</Text>
            </Box>
          ) : (
            <Box component="label">
              <Text>Ссылка на изображение</Text>
              <Box component="input"
                type="text"
                inputMode="url"
                autoComplete="url"
                value={externalUrl}
                onChange={(e: any) => {
                  setExternalUrl(e.target.value);
                  setImportedMedia(null);
                  setRemoveCover(false);
                }}
              />
            </Box>
          )}
        {editorMode === "external" ? <Button type="button" disabled={busy} onClick={() => void importExternal()}>Загрузить на сервер</Button> : null}
        {visiblePreview || persistedCover.kind === "external" ? (
            <Box className={""}>
              {visiblePreview ? (
                <Image
                  src={visiblePreview}
                  alt="Предпросмотр изображения новости"
                />
              ) : (
                <Text c="dimmed">Внешняя обложка сохранена в старом формате. Импортируйте её на сервер или удалите.</Text>
              )}
              <Box>
                <Text>
                  {selectedFile
                    ? "Новое изображение"
                    : importedMedia
                      ? "Загружено с внешнего адреса"
                    : persistedCover.kind === "owned"
                      ? "Загружено с компьютера"
                      : "Внешняя ссылка"}
                </Text>
                <Text>
                  {selectedFile
                    ? `${selectedFile.name} · ${size(selectedFile.size)}`
                    : importedMedia
                      ? importedMedia.url
                    : persistedCover.kind === "owned"
                      ? persistedCover.filename
                      : editorMode === "external"
                        ? externalUrl
                        : "Текущее изображение"}
                </Text>
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => fileRef.current?.click()}
                >
                  Заменить
                </Button>
                <Button type="button" disabled={busy} onClick={remove}>
                  Удалить изображение
                </Button>
                {selectedFile ? (
                  <Button
                    type="button"
                    disabled={busy}
                    onClick={() => clearFile()}
                  >
                    Убрать выбранный файл
                  </Button>
                ) : null}
              </Box>
            </Box>
          ) : null}
          {coverError ? (
            <Text className={""} role="alert">
              {coverError}
            </Text>
          ) : null}
        </Box>
        <Box component="label">
          <Text>Статус публикации</Text>
          <Box component="select"
            name="publishMode"
            value={publishMode}
            onChange={(e: any) => setPublishMode(e.target.value as PublishMode)}
          >
            <Box component="option" value="draft">Черновик</Box>
            <Box component="option" value="publish-now">Опубликовать сейчас</Box>
            <Box component="option" value="schedule">Запланировать</Box>
          </Box>
        </Box>
        {publishMode === "schedule" ? (
          <Box component="label">
            <Text>Дата и время публикации</Text>
            <Box component="input"
              name="publishedAt"
              type="datetime-local"
              defaultValue={
                state.values?.publishedAt ?? dateLocal(initialData?.publishedAt)
              }
              required
            />
          </Box>
        ) : (
          <Box className={""}>
            <Text>Пояснение</Text>
            <Text>
              {publishMode === "draft"
                ? "Запись сохранится без публикации в публичной ленте."
                : "Дата публикации будет установлена текущим временем."}
            </Text>
          </Box>
        )}
        <Box component="label">
          <Text>Показывать до (необязательно)</Text>
          <Box component="input" name="publishUntil" type="datetime-local" />
        </Box>
        <Box component="label">
          <Text>Дата на сайте (необязательно)</Text>
          <Box component="input"
            name="displayPublishedAt"
            type="datetime-local"
            defaultValue={dateLocal(initialData?.publishedAt)}
          />
        </Box>
      </Box>
      {actionError ? (
        <Text className={""} role="alert">
          {actionError}
        </Text>
      ) : null}
      <Box className={""}>
        <Button type="submit" disabled={busy}>
          {uploading
            ? "Загрузка изображения…"
            : pending
              ? "Сохранение новости…"
              : submitLabel}
        </Button>
      </Box>
    </Box>
  );
}
