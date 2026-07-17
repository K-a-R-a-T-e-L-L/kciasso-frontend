"use server";

import { redirect } from "next/navigation";
import { getAdminApiErrorMessage, isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import {
  createAdminNews,
  deleteAdminNews,
  updateAdminNews,
} from "@/shared/api/adapters/admin-news.adapter";
import type { NewsFormState } from "@/widgets/admin/AdminNewsForm/AdminNewsForm.types";

function toOptionalString(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized : undefined;
}

function toOptionalNumber(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toOptionalDateTime(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return undefined;
  }

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function parseNewsFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const publishMode = String(formData.get("publishMode") ?? "draft");

  let isPublished = false;
  let publishedAt: string | undefined;

  if (publishMode === "publish-now") {
    isPublished = true;
    publishedAt = new Date().toISOString();
  }

  if (publishMode === "schedule") {
    isPublished = true;
    publishedAt = toOptionalDateTime(formData.get("publishedAt"));
  }

  return {
    title,
    slug,
    excerpt,
    content,
    publishMode,
    coverImageUrl: toOptionalString(formData.get("coverImageUrl")),
    categoryId: toOptionalNumber(formData.get("categoryId")),
    isPublished,
    publishedAt,
  };
}

async function handleProtectedError(error: unknown, fallback: string): Promise<NewsFormState> {
  if (isAdminApiErrorStatus(error, 401)) {
    await clearAdminTokenCookie();
    redirect("/admin/login");
  }

  if (isAdminApiErrorStatus(error, 403)) {
    redirect("/admin/forbidden");
  }

  if (isAdminApiErrorStatus(error, 404)) {
    return {
      error: "Запись не найдена.",
    };
  }

  return {
    error: getAdminApiErrorMessage(error, fallback),
  };
}

export async function createNewsAction(_: NewsFormState, formData: FormData): Promise<NewsFormState> {
  const { token } = await requireAdminSectionToken("news");
  const payload = parseNewsFormData(formData);

  if (!payload.title || !payload.slug || !payload.excerpt || !payload.content) {
    return {
      error: "Заполните заголовок, slug, краткое описание и содержание.",
    };
  }

  if (payload.publishMode === "schedule" && !payload.publishedAt) {
    return {
      error: "Для отложенной публикации укажите дату и время.",
    };
  }

  try {
    await createAdminNews(token, payload);
  } catch (error) {
    return handleProtectedError(error, "Не удалось создать новость.");
  }

  redirect("/admin/news");
}

export async function updateNewsAction(
  id: number,
  _: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  const { token } = await requireAdminSectionToken("news");
  const payload = parseNewsFormData(formData);

  if (!payload.title || !payload.slug || !payload.excerpt || !payload.content) {
    return {
      error: "Заполните заголовок, slug, краткое описание и содержание.",
    };
  }

  if (payload.publishMode === "schedule" && !payload.publishedAt) {
    return {
      error: "Для отложенной публикации укажите дату и время.",
    };
  }

  try {
    await updateAdminNews(token, id, payload);
  } catch (error) {
    return handleProtectedError(error, "Не удалось сохранить изменения.");
  }

  redirect("/admin/news");
}

export async function deleteNewsAction(id: number) {
  const { token } = await requireAdminSectionToken("news");

  try {
    await deleteAdminNews(token, id);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) {
      await clearAdminTokenCookie();
      redirect("/admin/login");
    }

    if (isAdminApiErrorStatus(error, 403)) {
      redirect("/admin/forbidden");
    }

    throw error;
  }

  redirect("/admin/news");
}
