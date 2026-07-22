export type NewsMutationRequest = {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  categoryId?: number | string;
  publishMode: "draft" | "publish-now" | "schedule";
  publishedAt?: string | null;
  publishUntil?: string | null;
  displayPublishedAt?: string | null;
  cover: { kind: "unchanged" | "remove" | "set"; url?: string; source?: "owned" | "external"; pendingOwnedMediaKey?: string };
};
export type NewsMutationResult = { ok: true; news: { id: number; slug: string; coverImageUrl?: string | null } } | { ok: false; message: string; code?: string };

export function parseNewsMutation(value: unknown): { ok: true; input: NewsMutationRequest } | { ok: false; message: string } {
  if (!value || typeof value !== "object") return { ok: false, message: "Проверьте данные новости." };
  const source = value as Record<string, unknown>;
  const title = typeof source.title === "string" ? source.title.trim() : "";
  const excerpt = typeof source.excerpt === "string" ? source.excerpt.trim() : "";
  const content = typeof source.content === "string" ? source.content.trim() : "";
  const publishMode = source.publishMode;
  if (!title || !excerpt || !content || !["draft", "publish-now", "schedule"].includes(String(publishMode))) return { ok: false, message: "Проверьте данные новости." };
  const rawCover = source.cover;
  if (!rawCover || typeof rawCover !== "object") return { ok: false, message: "Проверьте изображение новости." };
  const cover = rawCover as NewsMutationRequest["cover"];
  if (!["unchanged", "remove", "set"].includes(cover.kind)) return { ok: false, message: "Проверьте изображение новости." };
  if (cover.kind === "set") {
    if (cover.source === "external") { try { const url = new URL(String(cover.url)); if (!/^https?:$/.test(url.protocol) || url.username || url.password) throw new Error(); } catch { return { ok: false, message: "Проверьте изображение новости." }; } }
    else if (cover.source !== "owned" || !/^\/api\/public\/news\/media\/[a-f0-9]{64}\.(jpg|png|webp)$/.test(String(cover.url)) || !cover.pendingOwnedMediaKey || !String(cover.url).endsWith(String(cover.pendingOwnedMediaKey))) return { ok: false, message: "Проверьте изображение новости." };
  }
  return { ok: true, input: { title, excerpt, content, slug: typeof source.slug === "string" && source.slug.trim() ? source.slug.trim() : undefined, categoryId: typeof source.categoryId === "number" || typeof source.categoryId === "string" ? source.categoryId : undefined, publishMode: publishMode as NewsMutationRequest["publishMode"], publishedAt: typeof source.publishedAt === "string" ? source.publishedAt : null, publishUntil: typeof source.publishUntil === "string" ? source.publishUntil : null, displayPublishedAt: typeof source.displayPublishedAt === "string" ? source.displayPublishedAt : null, cover } };
}
