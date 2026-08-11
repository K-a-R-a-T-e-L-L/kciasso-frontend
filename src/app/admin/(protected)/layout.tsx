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
    { href: "/", title: "На главную", icon: "home" as const },
    { href: "/admin", title: "Обзор", icon: "dashboard" as const },
    canManageNews ? { href: "/admin/news", title: "Новости", icon: "news" as const } : null,
    canManageDocuments ? { href: "/admin/documents", title: "Материалы и документы", icon: "documents" as const } : null,
    canManageSiteSettings ? { href: "/admin/pages", title: "Страницы", icon: "pages" as const } : null,
    canManageSiteSettings ? { href: "/admin/settings", title: "Настройки сайта", icon: "settings" as const } : null,
    isSuperAdmin ? { href: "/admin/users", title: "Пользователи", icon: "users" as const } : null,
  ].filter(Boolean) as { href: string; title: string; icon: "dashboard" | "documents" | "home" | "news" | "pages" | "settings" | "users" }[];

  return <AdminShell admin={admin} navigation={navigation}>{children}</AdminShell>;
}
