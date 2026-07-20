import type { NewsMutationRequest, NewsMutationResult } from "@/app/api/admin/news/_lib/news-mutation.schema";

async function send(url: string, method: "POST" | "PATCH", input: NewsMutationRequest, signal?: AbortSignal): Promise<NewsMutationResult> {
  try { const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(input), signal }); const result = await response.json().catch(() => null); if (!result || typeof result.ok !== "boolean") return { ok: false, message: "Не удалось сохранить новость." }; return result as NewsMutationResult; }
  catch { return { ok: false, message: "Не удалось сохранить новость." }; }
}
export function createNewsFromBrowser(input: NewsMutationRequest, signal?: AbortSignal) { return send("/api/admin/news", "POST", input, signal); }
export function updateNewsFromBrowser(id: string, input: NewsMutationRequest, signal?: AbortSignal) { return send(`/api/admin/news/${encodeURIComponent(id)}`, "PATCH", input, signal); }
