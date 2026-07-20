import { NextResponse } from "next/server";
import { getAdminTokenFromCookies } from "@/shared/admin/auth";
import { uploadAdminNewsImage } from "@/shared/api/adapters/admin-news.adapter";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const error = (message: string, code: "FILE_REQUIRED" | "FILE_EMPTY" | "FILE_TOO_LARGE" | "UNSUPPORTED_TYPE" | "UNAUTHORIZED" | "UPLOAD_FAILED", status: number) => NextResponse.json({ message, code }, { status });

export async function POST(request: Request) {
  const token = await getAdminTokenFromCookies();
  if (!token) return error("Требуется авторизация.", "UNAUTHORIZED", 401);
  let file: File | null = null;
  try { file = (await request.formData()).get("file") as File | null; } catch { return error("Выберите изображение.", "FILE_REQUIRED", 400); }
  if (!(file instanceof File)) return error("Выберите изображение.", "FILE_REQUIRED", 400);
  if (file.size === 0) return error("Файл пустой.", "FILE_EMPTY", 400);
  if (file.size > MAX_BYTES) return error("Размер изображения не должен превышать 10 МБ.", "FILE_TOO_LARGE", 413);
  if (!TYPES.has(file.type)) return error("Поддерживаются только JPG, PNG и WebP.", "UNSUPPORTED_TYPE", 400);
  try {
    const result = await uploadAdminNewsImage(token, file);
    return NextResponse.json({ key: result.key, url: result.url });
  } catch (cause) {
    if (isAdminApiErrorStatus(cause, 401) || isAdminApiErrorStatus(cause, 403)) return error("Требуется авторизация.", "UNAUTHORIZED", isAdminApiErrorStatus(cause, 403) ? 403 : 401);
    return error("Не удалось загрузить изображение.", "UPLOAD_FAILED", 502);
  }
}
