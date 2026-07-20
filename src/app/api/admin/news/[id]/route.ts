import { NextResponse } from "next/server";
import { getAdminTokenFromCookies } from "@/shared/admin/auth";
import { updateNewsFromRequest } from "../_lib/news-mutation.server";
import { parseNewsMutation } from "../_lib/news-mutation.schema";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const token = await getAdminTokenFromCookies();
  if (!token) return NextResponse.json({ ok: false, message: "Требуется авторизация." }, { status: 401 });
  try { const parsed = parseNewsMutation(await request.json()); if (!parsed.ok) return NextResponse.json(parsed, { status: 400 }); const result = await updateNewsFromRequest(token, (await context.params).id, parsed.input); return NextResponse.json(result, { status: result.ok ? 200 : 400 }); }
  catch { return NextResponse.json({ ok: false, message: "Проверьте данные новости." }, { status: 400 }); }
}
