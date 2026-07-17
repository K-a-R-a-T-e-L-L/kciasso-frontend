import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const backendUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export async function forwardAdminRequest(
  request: NextRequest,
  backendPath: string,
) {
  const token = (await cookies()).get("kciasso_admin_token")?.value;
  if (!token) {
    return NextResponse.json(
      { statusCode: 401, errorMessage: "NOT_AUTH", error: "Unauthorized" },
      { status: 401 },
    );
  }

  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : request.body;
  const response = await fetch(
    `${backendUrl}${backendPath}${request.nextUrl.search}`,
    {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      ...(body ? { duplex: "half" as const } : {}),
    },
  );

  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
