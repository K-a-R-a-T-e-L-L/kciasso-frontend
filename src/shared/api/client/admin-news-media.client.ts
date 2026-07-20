export type NewsCoverUploadErrorCode = "FILE_REQUIRED" | "FILE_EMPTY" | "FILE_TOO_LARGE" | "UNSUPPORTED_TYPE" | "UNAUTHORIZED" | "UPLOAD_FAILED";

export class NewsCoverUploadError extends Error {
  constructor(public readonly code: NewsCoverUploadErrorCode, message: string) { super(message); }
}

export async function uploadNewsCoverFromBrowser(file: File, signal?: AbortSignal): Promise<{ key: string; url: string }> {
  const body = new FormData();
  body.set("file", file);
  const response = await fetch("/api/admin/news/media", { method: "POST", body, signal });
  const payload = await response.json().catch(() => null) as { key?: string; url?: string; code?: NewsCoverUploadErrorCode; message?: string } | null;
  if (!response.ok || !payload?.key || !payload.url) {
    throw new NewsCoverUploadError(payload?.code ?? "UPLOAD_FAILED", payload?.message ?? "Не удалось загрузить изображение.");
  }
  return { key: payload.key, url: payload.url };
}

export async function removeUploadedNewsCoverFromBrowser(key: string) {
  await fetch(`/api/admin/news/media/${encodeURIComponent(key)}`, { method: "DELETE" });
}
