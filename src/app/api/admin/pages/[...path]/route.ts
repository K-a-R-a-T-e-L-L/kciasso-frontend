import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminTokenFromCookies } from "@/shared/admin/auth";

async function forward(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const token = await getAdminTokenFromCookies(); if (!token) return NextResponse.json({ message: "Требуется авторизация." }, { status: 401 });
  const { path } = await context.params; const base = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"; const url = `${base}/api/admin/pages/${path.map(encodeURIComponent).join("/")}`;
  const body = request.method === "GET" ? undefined : await request.text();
  const response = await fetch(url, { method: request.method, headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) }, body, cache: "no-store" });
  const text = await response.text();
  if (response.ok && request.method !== "GET") {
    const pageKey = path[0];
    const paths: Record<string, string[]> = {
      home: ["/"], "news.archive": ["/news"], "news.article": ["/news/[slug]"], gia: ["/gia"], "gia.9": ["/gia-9"], "gia.11": ["/gia-11"], quality: ["/kachestvo-obrazovaniya"], "quality.section": ["/kachestvo-obrazovaniya/[...slug]"], "regional-project": ["/regionalnyy-proekt"], "regional-project.section": ["/regionalnyy-proekt/[slug]"], about: ["/o-centre"], "about.contacts": ["/o-centre/kontakty"], resources: ["/resources"],
    };
    revalidateTag(`page-layout:${pageKey}`, "max");
    for (const route of paths[pageKey] ?? []) revalidatePath(route, "page");
    if (pageKey === "global-sections") {
      for (const key of Object.keys(paths)) revalidateTag(`page-layout:${key}`, "max");
      for (const routes of Object.values(paths)) for (const route of routes) revalidatePath(route, "page");
    }
  }
  return new NextResponse(text, { status: response.status, headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" } });
}
export const GET = forward; export const POST = forward; export const PATCH = forward; export const DELETE = forward;
