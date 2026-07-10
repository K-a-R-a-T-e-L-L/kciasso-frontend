import { redirect } from "next/navigation";
import { getOptionalAdmin } from "@/shared/admin/auth";

export default async function Page() {
  const admin = await getOptionalAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  if (admin.isSuperAdmin || admin.permissions.includes("news")) {
    redirect("/admin/news");
  }

  redirect("/admin/forbidden");
}
