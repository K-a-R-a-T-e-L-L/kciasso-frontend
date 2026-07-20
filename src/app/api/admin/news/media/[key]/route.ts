import { NextResponse } from "next/server";
import { getAdminTokenFromCookies } from "@/shared/admin/auth";
import { removeUnreferencedAdminNewsImage } from "@/shared/api/adapters/admin-news.adapter";

const KEY = /^[a-f0-9]{64}\.(?:jpg|jpeg|png|webp)$/;
export async function DELETE(_request: Request, context: { params: Promise<{ key: string }> }) {
  const token = await getAdminTokenFromCookies();
  if (!token) return new NextResponse(null, { status: 401 });
  const { key } = await context.params;
  if (!KEY.test(key)) return new NextResponse(null, { status: 404 });
  try { await removeUnreferencedAdminNewsImage(token, key); return new NextResponse(null, { status: 204 }); }
  catch { return new NextResponse(null, { status: 502 }); }
}
