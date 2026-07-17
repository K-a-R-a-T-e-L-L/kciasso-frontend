import { redirect } from "next/navigation";
import type { CurrentUserDto } from "@/shared/api/generated/types";
import { isAdminApiTransportError } from "@/shared/admin/api-error";
import { getOptionalAdmin } from "@/shared/admin/auth";
import AdminBackendUnavailable from "@/widgets/admin/AdminBackendUnavailable/AdminBackendUnavailable";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";

export default async function Page() {
  let admin: CurrentUserDto | null = null;

  try {
    admin = await getOptionalAdmin();
  } catch (error) {
    if (isAdminApiTransportError(error)) {
      return (
        <main className={cls.page}>
          <AdminBackendUnavailable retryHref="/admin" />
        </main>
      );
    }

    throw error;
  }

  if (!admin) {
    redirect("/admin/login");
  }

  if (admin.role === "SUPER_ADMIN" || admin.canManageNews) {
    redirect("/admin/news");
  }

  if (admin.documentsAccessMode === "ALL" || admin.documentGroups.length > 0) {
    redirect("/admin/documents");
  }

  if (admin.canManageSiteSettings) {
    redirect("/admin/settings");
  }

  redirect("/admin/forbidden");
}
