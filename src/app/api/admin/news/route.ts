import { NextResponse } from "next/server";
import { getAdminTokenFromCookies } from "@/shared/admin/auth";
import { createNewsFromRequest } from "./_lib/news-mutation.server";
import { parseNewsMutation } from "./_lib/news-mutation.schema";

export async function POST(request: Request) {
  const token = await getAdminTokenFromCookies();
  if (!token) return NextResponse.json({ ok: false, message: "Требуется авторизация." }, { status: 401 });
  try { const parsed = parseNewsMutation(await request.json()); if (!parsed.ok) return NextResponse.json(parsed, { status: 400 }); const result = await createNewsFromRequest(token, parsed.input); return NextResponse.json(result, { status: result.ok ? 201 : 400 }); }
  catch { return NextResponse.json({ ok: false, message: "Проверьте данные новости." }, { status: 400 }); }
}
