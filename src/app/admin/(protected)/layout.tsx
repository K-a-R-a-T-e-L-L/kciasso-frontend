import Link from "next/link";
import { ReactNode } from "react";
import type { CurrentUserDto } from "@/shared/api/generated/types";
import { isAdminApiTransportError } from "@/shared/admin/api-error";
import { requireAdmin } from "@/shared/admin/auth";
import AdminBackendUnavailable from "@/widgets/admin/AdminBackendUnavailable/AdminBackendUnavailable";
import LogoutButton from "@/widgets/admin/LogoutButton/LogoutButton.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";

export default async function Layout({ children }: { children: ReactNode }) {
  let admin: CurrentUserDto;

  try {
    admin = await requireAdmin();
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

  const isSuperAdmin = admin.role === "SUPER_ADMIN";
  const canManageNews = isSuperAdmin || admin.canManageNews;
  const canManageSiteSettings = isSuperAdmin || admin.canManageSiteSettings;
  const canManageDocuments = isSuperAdmin || admin.documentsAccessMode === "ALL" || admin.documentGroups.length > 0;
  const navigation = [
    canManageNews ? { href: "/admin/news", title: "Новости" } : null,
    canManageDocuments ? { href: "/admin/documents", title: "Материалы и документы" } : null,
    canManageSiteSettings ? { href: "/admin/settings", title: "Настройки сайта" } : null,
    isSuperAdmin ? { href: "/admin/users", title: "Пользователи" } : null,
  ].filter(Boolean) as { href: string; title: string }[];

  return (
    <div className={cls.page}>
      <div className={cls.shell}>
        <aside className={cls.sidebar}>
          <div className={cls.brand}>
            <span className={cls.eyebrow}>Admin</span>
            <strong>ГКУ &quot;КЦИАССО&quot;</strong>
            <p>Управление новостями, контактами и публикациями.</p>
          </div>

          <nav className={cls.nav}>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.title}
              </Link>
            ))}
          </nav>

          <div className={cls.meta}>
            <span>{admin.email}</span>
            <small>{isSuperAdmin ? "super-admin" : "admin"}</small>
          </div>

          <LogoutButton />
        </aside>

        <div className={cls.content}>{children}</div>
      </div>
    </div>
  );
}
