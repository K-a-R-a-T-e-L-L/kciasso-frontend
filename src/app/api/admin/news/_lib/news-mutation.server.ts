import { createAdminNews, removeUnreferencedAdminNewsImage, updateAdminNews } from "@/shared/api/adapters/admin-news.adapter";
import { getAdminApiErrorMessage } from "@/shared/admin/api-error";
import type { NewsMutationRequest } from "./news-mutation.schema";

export type NewsMutationResult = { ok: true; news: { id: number; slug: string; coverImageUrl?: string | null } } | { ok: false; message: string; code?: string };

function dto(input: NewsMutationRequest) {
  const coverImageUrl = input.cover.kind === "remove" ? null : input.cover.kind === "set" ? input.cover.url : undefined;
  return { title: input.title, slug: input.slug, excerpt: input.excerpt, content: input.content, categoryId: input.categoryId ? Number(input.categoryId) : undefined, isPublished: input.publishMode !== "draft", publishedAt: input.publishMode === "schedule" ? input.publishedAt ?? undefined : input.publishMode === "publish-now" ? new Date().toISOString() : undefined, publishUntil: input.publishUntil || undefined, displayPublishedAt: input.displayPublishedAt || undefined, ...(coverImageUrl !== undefined ? { coverImageUrl } : {}) };
}

async function run(token: string, input: NewsMutationRequest, operation: () => Promise<any>): Promise<NewsMutationResult> {
  try { const news = await operation(); return { ok: true, news: { id: news.id, slug: news.slug, coverImageUrl: news.coverImageUrl } }; }
  catch (error) {
    if (input.cover.kind === "set" && input.cover.source === "owned" && input.cover.pendingOwnedMediaKey) await removeUnreferencedAdminNewsImage(token, input.cover.pendingOwnedMediaKey).catch(() => undefined);
    return { ok: false, message: getAdminApiErrorMessage(error, "Не удалось сохранить новость.") };
  }
}

export function createNewsFromRequest(token: string, input: NewsMutationRequest) { return run(token, input, () => createAdminNews(token, dto(input))); }
export function updateNewsFromRequest(token: string, id: string, input: NewsMutationRequest) { return run(token, input, () => updateAdminNews(token, Number(id), dto(input))); }
