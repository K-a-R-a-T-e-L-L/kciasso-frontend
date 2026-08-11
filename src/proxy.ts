import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_ACCESS_TOKEN_MAX_AGE_SECONDS,
  ADMIN_REFRESH_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_MAX_AGE_SECONDS,
  adminAuthEndpoint,
  adminSessionCookieOptions,
} from "@/shared/admin/session-config";

function isExpired(token: string | undefined) {
  if (!token) return true;
  try {
    const encoded = token.split(".")[1];
    const payload = JSON.parse(atob(encoded.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return !payload.exp || payload.exp * 1000 <= Date.now() + 15_000;
  } catch {
    return true;
  }
}

function clearSession(response: NextResponse) {
  response.cookies.delete(ADMIN_ACCESS_TOKEN_COOKIE);
  response.cookies.delete(ADMIN_REFRESH_TOKEN_COOKIE);
  return response;
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const access = request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  if (!isExpired(access)) return NextResponse.next();

  const refreshToken = request.cookies.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) return clearSession(NextResponse.redirect(new URL("/admin/login", request.url)));

  const backendUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  let refreshed: Response;
  try {
    refreshed = await fetch(adminAuthEndpoint(backendUrl, "refresh"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.next();
  }
  if (!refreshed.ok) return clearSession(NextResponse.redirect(new URL("/admin/login", request.url)));

  const session = await refreshed.json() as { token: string; refreshToken: string };
  const requestHeaders = new Headers(request.headers);
  const requestCookies = request.cookies;
  requestCookies.set(ADMIN_ACCESS_TOKEN_COOKIE, session.token);
  requestCookies.set(ADMIN_REFRESH_TOKEN_COOKIE, session.refreshToken);
  requestHeaders.set("cookie", requestCookies.toString());
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set(
    ADMIN_ACCESS_TOKEN_COOKIE,
    session.token,
    adminSessionCookieOptions(ADMIN_ACCESS_TOKEN_MAX_AGE_SECONDS),
  );
  response.cookies.set(
    ADMIN_REFRESH_TOKEN_COOKIE,
    session.refreshToken,
    adminSessionCookieOptions(ADMIN_REFRESH_TOKEN_MAX_AGE_SECONDS),
  );
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
