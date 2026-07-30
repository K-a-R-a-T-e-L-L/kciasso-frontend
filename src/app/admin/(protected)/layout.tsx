import { ReactNode } from "react";
import { Box } from "@mantine/core";
import type { CurrentUserDto } from "@/shared/api/generated/types";
import { isAdminApiTransportError } from "@/shared/admin/api-error";
import { requireAdmin } from "@/shared/admin/auth";
import AdminBackendUnavailable from "@/widgets/admin/AdminBackendUnavailable/AdminBackendUnavailable";
import AdminShell from "@/shared/ui/admin/AdminShell.client";

export default async function Layout({ children }: { children: ReactNode }) {
  let admin: CurrentUserDto;
  try {
    admin = await requireAdmin();
  } catch (error) {
    if (isAdminApiTransportError(error)) return <Box component="main" p="xl"><AdminBackendUnavailable retryHref="/admin" /></Box>;
    throw error;
  }

  const isSuperAdmin = admin.role === "SUPER_ADMIN";
  const canManageNews = isSuperAdmin || admin.canManageNews;
  const canManageSiteSettings = isSuperAdmin || admin.canManageSiteSettings;
  const canManageDocuments = isSuperAdmin || admin.documentsAccessMode === "ALL" || admin.documentGroups.length > 0;
  const navigation = [
    canManageNews ? { href: "/admin/news", title: "Новости" } : null,
    canManageDocuments ? { href: "/admin/documents", title: "Материалы и документы" } : null,
    canManageSiteSettings ? { href: "/admin/pages", title: "Страницы", icon: "pages" as const } : null,
    canManageSiteSettings ? { href: "/admin/settings", title: "Настройки сайта" } : null,
    isSuperAdmin ? { href: "/admin/users", title: "Пользователи" } : null,
  ].filter(Boolean) as { href: string; title: string; icon?: "pages" }[];

  return <AdminShell admin={admin} navigation={navigation}>{children}</AdminShell>;
}
