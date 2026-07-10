import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { CurrentUserDto } from "@/shared/api/generated/types";
import { getCurrentAdmin } from "@/shared/api/adapters/admin-auth.adapter";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";

export const ADMIN_TOKEN_COOKIE = "kciasso_admin_token";

function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export async function getAdminTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_TOKEN_COOKIE)?.value ?? null;
}

export async function setAdminTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_COOKIE, token, getAdminCookieOptions());
}

export async function clearAdminTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_TOKEN_COOKIE);
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
  return user.isSuperAdmin || user.permissions.includes(sectionId);
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

  if (!user.isSuperAdmin) {
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
