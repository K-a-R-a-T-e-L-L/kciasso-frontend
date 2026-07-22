import { ownedNewsMediaKeyFromUrl } from "@/shared/news/news-cover";

export type ServerCoverMutation =
  | { kind: "unchanged" }
  | { kind: "remove" }
  | { kind: "set"; url: string; source: "owned" | "external"; pendingKey?: string };

export type ParsedNewsFormData = {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  publishMode: string;
  publishedAt?: string;
  publishUntil?: string;
  displayPublishedAt?: string;
  categoryId?: number;
  coverMutation: ServerCoverMutation;
  coverError?: string;
};

import type { NewsFormValues } from "@/widgets/admin/AdminNewsForm/AdminNewsForm.types";

function optionalString(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
}

function optionalNumber(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function optionalDateTime(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return undefined;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function parseNewsFormData(formData: FormData): ParsedNewsFormData {
  const kind = String(formData.get("coverMutationKind") ?? "unchanged");
  const url = optionalString(formData.get("coverImageUrl"));
  const source = String(formData.get("coverImageSource") ?? "");
  const pendingKey = optionalString(formData.get("pendingOwnedMediaKey"));
  let coverMutation: ServerCoverMutation = { kind: "unchanged" };
  let coverError: string | undefined;
  if (kind === "remove") coverMutation = { kind: "remove" };
  else if (kind === "set" && url && (source === "owned" || source === "external")) {
    if (source === "owned") {
      const key = ownedNewsMediaKeyFromUrl(url);
      if (!key || pendingKey !== key) coverError = "Некорректные данные загруженного изображения.";
      else coverMutation = { kind: "set", url, source, pendingKey };
    } else {
      try { const parsed = new URL(url); if (!/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password || pendingKey) throw new Error(); coverMutation = { kind: "set", url, source }; }
      catch { coverError = "Укажите полный адрес изображения, начинающийся с http:// или https://"; }
    }
  } else if (kind !== "unchanged") coverError = "Некорректные данные обложки.";

  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: optionalString(formData.get("slug")),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    publishMode: String(formData.get("publishMode") ?? "draft"),
    publishedAt: optionalDateTime(formData.get("publishedAt")),
    publishUntil: optionalDateTime(formData.get("publishUntil")),
    displayPublishedAt: optionalDateTime(formData.get("displayPublishedAt")),
    categoryId: optionalNumber(formData.get("categoryId")),
    coverMutation,
    coverError,
  };
}

export function formValuesFromFormData(formData: FormData): NewsFormValues {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    publishMode: String(formData.get("publishMode") ?? "draft"),
    publishedAt: String(formData.get("publishedAt") ?? ""),
    coverMode: String(formData.get("coverMode") ?? "upload") === "url" ? "url" : "upload",
    externalUrl: String(formData.get("coverImageUrl") ?? ""),
    removeCover: formData.get("removeCoverImage") === "true",
  };
}
