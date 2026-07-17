import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, context: { params: Promise<{ key: string }> }) {
  const { key } = await context.params;
  if (!/^[a-f0-9]{64}\.(?:jpg|png|webp)$/.test(key)) return new NextResponse(null, { status: 404 });
  const base = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const response = await fetch(new URL(`/api/public/news/media/${key}`, base), { cache: "force-cache" });
  if (!response.ok || !response.body) return new NextResponse(null, { status: response.status });
  return new NextResponse(response.body, {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
