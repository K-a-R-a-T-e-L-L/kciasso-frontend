import { NextRequest, NextResponse } from "next/server";

const backendUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";
const SAFE_RESPONSE_HEADERS = [
  "cache-control",
  "content-disposition",
  "content-length",
  "content-type",
  "pragma",
  "referrer-policy",
  "x-content-type-options",
  "x-robots-tag",
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  const body = await request.text();
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { errorMessage: "DOCUMENT_SHARE_LINK_UNAVAILABLE" },
      { status: 400 },
    );
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    typeof (payload as { token?: unknown }).token !== "string"
  ) {
    return NextResponse.json(
      { errorMessage: "DOCUMENT_SHARE_LINK_UNAVAILABLE" },
      { status: 400 },
    );
  }

  let response: Response;
  try {
    response = await fetch(
      `${backendUrl}/api/public/document-share-links/resolve`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        cache: "no-store",
      },
    );
  } catch {
    return NextResponse.json(
      { errorMessage: "DOCUMENT_SHARE_PROXY_UNAVAILABLE" },
      { status: 502 },
    );
  }

  const headers = new Headers();
  for (const name of SAFE_RESPONSE_HEADERS) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("Cache-Control", "private, no-store");
  return new NextResponse(response.body, { status: response.status, headers });
}
