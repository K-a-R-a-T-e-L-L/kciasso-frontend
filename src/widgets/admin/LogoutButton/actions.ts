"use server";

import { redirect } from "next/navigation";
import {
  clearAdminTokenCookie,
  getAdminRefreshTokenFromCookies,
} from "@/shared/admin/auth";
import { adminAuthEndpoint } from "@/shared/admin/session-config";

export async function logoutAdminAction() {
  const refreshToken = await getAdminRefreshTokenFromCookies();
  if (refreshToken) {
    const backendUrl =
      process.env.API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:4000";
    await fetch(adminAuthEndpoint(backendUrl, "logout"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    }).catch(() => undefined);
  }
  await clearAdminTokenCookie();
  redirect("/admin/login");
}
