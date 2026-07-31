"use client";

import {
  Alert,
  Button,
  FileButton,
  FileInput,
  Group,
  Image,
  Input,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
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
  const fileResetRef = useRef<() => void>(null);
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
    if (clearInput) fileResetRef.current?.();
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
    <Stack component="form" ref={formRef as never} gap="lg" onSubmit={submit as never}>
      <Input type="hidden" name="coverMutationKind" defaultValue="unchanged" />
      <Input type="hidden" name="coverImageUrl" defaultValue="" />
      <Input type="hidden" name="coverImageSource" defaultValue="" />
      <Input type="hidden" name="pendingOwnedMediaKey" defaultValue="" />

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <TextInput
          name="title"
          label="Заголовок"
          defaultValue={state.values?.title ?? initialData?.title ?? ""}
          required
        />
        <TextInput
          name="slug"
          label="Slug (необязательно)"
          description="Оставьте поле пустым — адрес создастся автоматически из заголовка."
          defaultValue={state.values?.slug ?? initialData?.slug ?? ""}
        />
      </SimpleGrid>
      <Select
        name="categoryId"
        label="Категория"
        clearable
        defaultValue={
          state.values?.categoryId
          ?? (initialData?.category?.id ? String(initialData.category.id) : null)
        }
        data={categories.map((category) => ({ value: String(category.id), label: category.title }))}
      />
      <Textarea
        name="excerpt"
        label="Краткое описание"
        minRows={4}
        defaultValue={state.values?.excerpt ?? initialData?.excerpt ?? ""}
        required
      />
      <Textarea
        name="content"
        label="Содержание"
        minRows={14}
        autosize
        defaultValue={state.values?.content ?? initialData?.content ?? ""}
        required
      />

      <Paper component="section" p="lg" withBorder aria-labelledby="cover-title">
        <Stack gap="md">
          <Stack gap={2}>
            <Title order={3} id="cover-title">Обложка новости</Title>
            <Text size="sm" c="dimmed">Добавьте JPG, PNG или WebP до 10 МБ.</Text>
          </Stack>
          <Group>
            <Button
              disabled={busy}
              type="button"
              variant={editorMode === "upload" ? "filled" : "light"}
              onClick={() => setEditorMode("upload")}
            >
              Загрузить файл
            </Button>
            <Button
              disabled={busy}
              type="button"
              variant={editorMode === "external" ? "filled" : "light"}
              onClick={() => setEditorMode("external")}
            >
              Указать ссылку
            </Button>
          </Group>
          {editorMode === "upload" ? (
            <FileInput
              label="Файл изображения"
              description="Один файл JPG, PNG или WebP, не более 10 МБ"
              accept="image/jpeg,image/png,image/webp"
              value={selectedFile}
              onChange={choose}
              disabled={busy}
              clearable
            />
          ) : (
            <Stack gap="sm">
              <TextInput
                label="Ссылка на изображение"
                placeholder="https://example.org/cover.jpg"
                inputMode="url"
                autoComplete="url"
                value={externalUrl}
                onChange={(event) => {
                  setExternalUrl(event.currentTarget.value);
                  setImportedMedia(null);
                  setRemoveCover(false);
                }}
              />
              <Button
                type="button"
                loading={uploading}
                disabled={busy || !externalUrl.trim()}
                onClick={() => void importExternal()}
              >
                Загрузить на сервер
              </Button>
            </Stack>
          )}

          {visiblePreview || persistedCover.kind === "external" ? (
            <Paper p="md" withBorder>
              <Stack gap="sm">
                {visiblePreview ? (
                  <Image
                    src={visiblePreview}
                    alt="Предпросмотр изображения новости"
                    mah={320}
                    fit="contain"
                    radius="md"
                  />
                ) : (
                  <Text c="dimmed">Внешняя обложка сохранена в старом формате. Импортируйте её на сервер или удалите.</Text>
                )}
                <Text fw={700}>
                  {selectedFile
                    ? "Новое изображение"
                    : importedMedia
                      ? "Загружено на сервер"
                      : persistedCover.kind === "owned"
                        ? "Текущая обложка"
                        : "Внешняя ссылка"}
                </Text>
                <Text size="sm" c="dimmed" style={{ overflowWrap: "anywhere" }}>
                  {selectedFile
                    ? `${selectedFile.name} · ${size(selectedFile.size)}`
                    : importedMedia
                      ? importedMedia.url
                      : persistedCover.kind === "owned"
                        ? persistedCover.filename
                        : externalUrl || "Текущее изображение"}
                </Text>
                <Group>
                  <FileButton
                    resetRef={fileResetRef}
                    onChange={choose}
                    accept="image/jpeg,image/png,image/webp"
                  >
                    {(props) => <Button {...props} type="button" disabled={busy}>Заменить</Button>}
                  </FileButton>
                  <Button type="button" color="red" variant="light" disabled={busy} onClick={remove}>
                    Удалить изображение
                  </Button>
                  {selectedFile ? (
                    <Button type="button" variant="default" disabled={busy} onClick={() => clearFile()}>
                      Убрать выбранный файл
                    </Button>
                  ) : null}
                </Group>
              </Stack>
            </Paper>
          ) : null}
          {coverError ? <Alert color="red" role="alert">{coverError}</Alert> : null}
        </Stack>
      </Paper>

      <Select
        name="publishMode"
        label="Статус публикации"
        value={publishMode}
        onChange={(value) => setPublishMode((value as PublishMode) ?? "draft")}
        data={[
          { value: "draft", label: "Черновик" },
          { value: "publish-now", label: "Опубликовать сейчас" },
          { value: "schedule", label: "Запланировать" },
        ]}
      />
      {publishMode === "schedule" ? (
        <TextInput
          name="publishedAt"
          type="datetime-local"
          label="Дата и время публикации"
          defaultValue={state.values?.publishedAt ?? dateLocal(initialData?.publishedAt)}
          required
        />
      ) : (
        <Alert color="blue" title="Пояснение">
          {publishMode === "draft"
            ? "Запись сохранится без публикации в публичной ленте."
            : "Дата публикации будет установлена текущим временем."}
        </Alert>
      )}
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput name="publishUntil" type="datetime-local" label="Показывать до (необязательно)" />
        <TextInput
          name="displayPublishedAt"
          type="datetime-local"
          label="Дата на сайте (необязательно)"
          defaultValue={dateLocal(initialData?.publishedAt)}
        />
      </SimpleGrid>
      {actionError ? <Alert color="red" role="alert">{actionError}</Alert> : null}
      <Group justify="flex-end">
        <Button type="submit" loading={busy}>
          {uploading ? "Загрузка изображения…" : pending ? "Сохранение новости…" : submitLabel}
        </Button>
      </Group>
    </Stack>
  );
}
