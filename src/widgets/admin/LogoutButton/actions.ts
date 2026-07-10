"use server";

import { redirect } from "next/navigation";
import { clearAdminTokenCookie } from "@/shared/admin/auth";

export async function logoutAdminAction() {
  await clearAdminTokenCookie();
  redirect("/admin/login");
}
