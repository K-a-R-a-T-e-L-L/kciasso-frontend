import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_ACCESS_TOKEN_MAX_AGE_SECONDS,
  ADMIN_REFRESH_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_MAX_AGE_SECONDS,
  adminAuthEndpoint,
  adminSessionCookieOptions,
} from "@/shared/admin/session-config";

const backendUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export async function forwardAdminRequest(
  request: NextRequest,
  backendPath: string,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();
  const send = (accessToken: string) => {
    headers.set("Authorization", `Bearer ${accessToken}`);
    return fetch(`${backendUrl}${backendPath}${request.nextUrl.search}`, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      ...(body ? { duplex: "half" as const } : {}),
    });
  };

  let response = token ? await send(token) : null;

  let refreshed: { token: string; refreshToken: string } | null = null;
  if (!response || response.status === 401) {
    const refreshToken = cookieStore.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value;
    if (refreshToken) {
      const refreshResponse = await fetch(
        adminAuthEndpoint(backendUrl, "refresh"),
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          cache: "no-store",
        },
      );
      if (refreshResponse.ok) {
        const refreshedSession = (await refreshResponse.json()) as {
          token: string;
          refreshToken: string;
        };
        refreshed = refreshedSession;
        response = await send(refreshedSession.token);
      }
    }
  }

  if (!response) {
    const unauthorized = NextResponse.json(
      { statusCode: 401, errorMessage: "NOT_AUTH", error: "Unauthorized" },
      { status: 401 },
    );
    unauthorized.cookies.delete(ADMIN_ACCESS_TOKEN_COOKIE);
    unauthorized.cookies.delete(ADMIN_REFRESH_TOKEN_COOKIE);
    return unauthorized;
  }

  const responseBody = [204, 205, 304].includes(response.status)
    ? null
    : response.body;
  const responseHeaders = new Headers(response.headers);
  if (responseBody === null) {
    responseHeaders.delete("content-length");
    responseHeaders.delete("content-type");
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("transfer-encoding");
  }
  const result = new NextResponse(responseBody, {
    status: response.status,
    headers: responseHeaders,
  });
  if (refreshed) {
    result.cookies.set(
      ADMIN_ACCESS_TOKEN_COOKIE,
      refreshed.token,
      adminSessionCookieOptions(ADMIN_ACCESS_TOKEN_MAX_AGE_SECONDS),
    );
    result.cookies.set(
      ADMIN_REFRESH_TOKEN_COOKIE,
      refreshed.refreshToken,
      adminSessionCookieOptions(ADMIN_REFRESH_TOKEN_MAX_AGE_SECONDS),
    );
  } else if (response.status === 401) {
    result.cookies.delete(ADMIN_ACCESS_TOKEN_COOKIE);
    result.cookies.delete(ADMIN_REFRESH_TOKEN_COOKIE);
  }
  return result;
}
