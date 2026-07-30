export async function importNewsCoverFromBrowser(url: string, signal?: AbortSignal): Promise<{ mediaId: number; url: string }> {
  const response = await fetch("/api/admin/news/media/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }), signal });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof data?.message === "string" ? data.message : "Не удалось импортировать изображение.");
  return data as { mediaId: number; url: string };
}
