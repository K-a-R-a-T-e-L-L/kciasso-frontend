export const ADMIN_ACCESS_TOKEN_COOKIE = "kciasso_admin_access_token";
export const ADMIN_REFRESH_TOKEN_COOKIE = "kciasso_admin_refresh_token";
export const ADMIN_ACCESS_TOKEN_MAX_AGE_SECONDS = 4 * 60;
export const ADMIN_REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60;

export function adminAuthEndpoint(
  backendOrigin: string,
  action: "refresh" | "logout",
) {
  return `${backendOrigin.replace(/\/$/, "")}/api/user/${action}`;
}

export function adminSessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
