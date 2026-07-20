"use server";

import { redirect } from "next/navigation";
import { getAdminApiErrorMessage, isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import {
  createAdminNews,
  deleteAdminNews,
  updateAdminNews,
  removeUnreferencedAdminNewsImage,
} from "@/shared/api/adapters/admin-news.adapter";
import type { NewsFormState } from "@/widgets/admin/AdminNewsForm/AdminNewsForm.types";
import { formValuesFromFormData, parseNewsFormData } from "./news-form.serialization";

async function handleProtectedError(error: unknown, fallback: string, formData: FormData): Promise<NewsFormState> {
  if (isAdminApiErrorStatus(error, 401)) {
    await clearAdminTokenCookie();
    redirect("/admin/login");
  }
  if (isAdminApiErrorStatus(error, 403)) redirect("/admin/forbidden");
  return {
    error: isAdminApiErrorStatus(error, 404) ? "\u0417\u0430\u043f\u0438\u0441\u044c \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430." : getAdminApiErrorMessage(error, fallback),
    values: formValuesFromFormData(formData),
  };
}

function publishFields(payload: ReturnType<typeof parseNewsFormData>) {
  if (payload.publishMode === "publish-now") return { isPublished: true, publishedAt: new Date().toISOString() };
  if (payload.publishMode === "schedule") return { isPublished: true, publishedAt: payload.publishedAt };
  return { isPublished: false, publishedAt: undefined };
}

function coverFields(payload: ReturnType<typeof parseNewsFormData>) {
  if (payload.coverMutation.kind === "set") return { coverImageUrl: payload.coverMutation.url };
  if (payload.coverMutation.kind === "remove") return { coverImageUrl: null };
  return {};
}

export async function createNewsAction(_: NewsFormState, formData: FormData): Promise<NewsFormState> {
  const { token } = await requireAdminSectionToken("news");
  const payload = parseNewsFormData(formData);
  const values = formValuesFromFormData(formData);
  if (!payload.title || !payload.excerpt || !payload.content) return { error: "\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0444\u043e\u0440\u043c\u0443.", values };
  if (payload.publishMode === "schedule" && !payload.publishedAt) return { error: "\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u0434\u0430\u0442\u0443 \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438.", values };

  try {
    if (payload.coverError) return { error: payload.coverError, values };
    const { coverMutation: _cover, coverError: _coverError, publishMode: _mode, ...newsFields } = payload;
    await createAdminNews(token, { ...newsFields, ...publishFields(payload), ...coverFields(payload) });
  } catch (error) {
    if (payload.coverMutation.kind === "set" && payload.coverMutation.source === "owned" && payload.coverMutation.pendingKey) await removeUnreferencedAdminNewsImage(token, payload.coverMutation.pendingKey).catch(() => undefined);
    return handleProtectedError(error, "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u043d\u043e\u0432\u043e\u0441\u0442\u044c.", formData);
  }
  redirect("/admin/news");
}

export async function updateNewsAction(id: number, _: NewsFormState, formData: FormData): Promise<NewsFormState> {
  const { token } = await requireAdminSectionToken("news");
  const payload = parseNewsFormData(formData);
  const values = formValuesFromFormData(formData);
  if (!payload.title || !payload.excerpt || !payload.content) return { error: "\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0444\u043e\u0440\u043c\u0443.", values };
  if (payload.publishMode === "schedule" && !payload.publishedAt) return { error: "\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u0434\u0430\u0442\u0443 \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438.", values };

  try {
    if (payload.coverError) return { error: payload.coverError, values };
    const { coverMutation: _cover, coverError: _coverError, publishMode: _mode, ...newsFields } = payload;
    await updateAdminNews(token, id, { ...newsFields, ...publishFields(payload), ...coverFields(payload) });
  } catch (error) {
    if (payload.coverMutation.kind === "set" && payload.coverMutation.source === "owned" && payload.coverMutation.pendingKey) await removeUnreferencedAdminNewsImage(token, payload.coverMutation.pendingKey).catch(() => undefined);
    return handleProtectedError(error, "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f.", formData);
  }
  redirect("/admin/news");
}

export async function deleteNewsAction(id: number) {
  const { token } = await requireAdminSectionToken("news");
  try {
    await deleteAdminNews(token, id);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) { await clearAdminTokenCookie(); redirect("/admin/login"); }
    if (isAdminApiErrorStatus(error, 403)) redirect("/admin/forbidden");
    throw error;
  }
  redirect("/admin/news");
}
