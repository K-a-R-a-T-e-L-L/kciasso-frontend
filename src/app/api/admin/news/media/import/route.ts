import { NextResponse } from "next/server";
import { getAdminTokenFromCookies } from "@/shared/admin/auth";

export async function POST(request: Request) {
  const token = await getAdminTokenFromCookies();
  if (!token) return NextResponse.json({ message: "Требуется авторизация." }, { status: 401 });
  const body = await request.json().catch(() => null) as { url?: unknown } | null;
  if (!body || typeof body.url !== "string") return NextResponse.json({ message: "Укажите URL изображения." }, { status: 400 });
  const base = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const response = await fetch(`${base}/api/admin/news/media/import`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ url: body.url }) });
  const text = await response.text();
  return new NextResponse(text, { status: response.status, headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" } });
}
