import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const SAFE_HEADERS = [
  "cache-control",
  "content-disposition",
  "content-length",
  "content-type",
  "referrer-policy",
  "x-content-type-options",
  "x-robots-tag",
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await context.params;
  if (!/^\d+$/.test(documentId)) return NextResponse.json({ errorMessage: "DOCUMENT_PUBLIC_FILE_UNAVAILABLE" }, { status: 404 });
  let response: Response;
  try {
    response = await fetch(`${backendUrl}/api/public/documents/${documentId}/file`, { cache: "no-store" });
  } catch {
    return NextResponse.json({ errorMessage: "DOCUMENT_PUBLIC_PROXY_UNAVAILABLE" }, { status: 502 });
  }
  const headers = new Headers();
  for (const name of SAFE_HEADERS) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Robots-Tag", "noindex");
  headers.set("X-Content-Type-Options", "nosniff");
  return new NextResponse(response.body, { status: response.status, headers });
}
