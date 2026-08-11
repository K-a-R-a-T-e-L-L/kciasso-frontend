import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { CurrentUserDto } from "@/shared/api/generated/types";
import { getCurrentAdmin } from "@/shared/api/adapters/admin-auth.adapter";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_ACCESS_TOKEN_MAX_AGE_SECONDS,
  ADMIN_REFRESH_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_MAX_AGE_SECONDS,
  adminSessionCookieOptions,
} from "@/shared/admin/session-config";

export { ADMIN_ACCESS_TOKEN_COOKIE, ADMIN_REFRESH_TOKEN_COOKIE };
const LEGACY_ADMIN_TOKEN_COOKIE = "kciasso_admin_token";

export async function getAdminTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getAdminRefreshTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function setAdminSessionCookies(session: { token: string; refreshToken: string }) {
  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_ACCESS_TOKEN_COOKIE,
    session.token,
    adminSessionCookieOptions(ADMIN_ACCESS_TOKEN_MAX_AGE_SECONDS),
  );
  cookieStore.set(
    ADMIN_REFRESH_TOKEN_COOKIE,
    session.refreshToken,
    adminSessionCookieOptions(ADMIN_REFRESH_TOKEN_MAX_AGE_SECONDS),
  );
  cookieStore.delete(LEGACY_ADMIN_TOKEN_COOKIE);
}

export async function clearAdminTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_ACCESS_TOKEN_COOKIE);
  cookieStore.delete(ADMIN_REFRESH_TOKEN_COOKIE);
  cookieStore.delete(LEGACY_ADMIN_TOKEN_COOKIE);
}

export async function getOptionalAdmin(): Promise<CurrentUserDto | null> {
  const token = await getAdminTokenFromCookies();

  if (!token) {
    return null;
  }

  try {
    return await getCurrentAdmin(token);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401) || isAdminApiErrorStatus(error, 403)) {
      await clearAdminTokenCookie();
      return null;
    }

    throw error;
  }
}

export async function requireAdmin() {
  const user = await getOptionalAdmin();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}

export function hasAdminSectionPermission(user: CurrentUserDto, sectionId: string) {
  if (user.role === "SUPER_ADMIN") return true;
  if (sectionId === "news") return user.canManageNews;
  if (sectionId === "site-settings") return user.canManageSiteSettings;
  if (sectionId === "documents") {
    return user.documentsAccessMode === "ALL" ||
      (user.documentsAccessMode === "SELECTED_GROUPS" && user.documentGroups.length > 0);
  }
  return false;
}

export async function requireAdminSection(sectionId: string) {
  const user = await requireAdmin();

  if (!hasAdminSectionPermission(user, sectionId)) {
    redirect("/admin/forbidden");
  }

  return user;
}

export async function requireSuperAdmin() {
  const user = await requireAdmin();

  if (user.role !== "SUPER_ADMIN") {
    redirect("/admin/forbidden");
  }

  return user;
}

export async function requireAdminToken() {
  const user = await requireAdmin();
  const token = await getAdminTokenFromCookies();

  if (!token) {
    redirect("/admin/login");
  }

  return {
    user,
    token,
  };
}

export async function requireAdminSectionToken(sectionId: string) {
  const user = await requireAdminSection(sectionId);
  const token = await getAdminTokenFromCookies();

  if (!token) {
    redirect("/admin/login");
  }

  return {
    user,
    token,
  };
}

export async function requireSuperAdminToken() {
  const user = await requireSuperAdmin();
  const token = await getAdminTokenFromCookies();

  if (!token) {
    redirect("/admin/login");
  }

  return {
    user,
    token,
  };
}
