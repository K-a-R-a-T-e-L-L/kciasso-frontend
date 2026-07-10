import Link from "next/link";
import { ReactNode } from "react";
import { requireAdmin } from "@/shared/admin/auth";
import LogoutButton from "@/widgets/admin/LogoutButton/LogoutButton.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";

export default async function Layout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  const canManageNews = admin.isSuperAdmin || admin.permissions.includes("news");
  const navigation = [
    canManageNews ? { href: "/admin/news", title: "Новости" } : null,
    admin.isSuperAdmin ? { href: "/admin/users", title: "Пользователи" } : null,
  ].filter(Boolean) as { href: string; title: string }[];

  return (
    <div className={cls.page}>
      <div className={cls.shell}>
        <aside className={cls.sidebar}>
          <div className={cls.brand}>
            <span className={cls.eyebrow}>Admin</span>
            <strong>ГКУ &quot;КЦИАССО&quot;</strong>
            <p>Управление новостями и публикациями.</p>
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
            <small>{admin.isSuperAdmin ? "super-admin" : "admin"}</small>
          </div>

          <LogoutButton />
        </aside>

        <div className={cls.content}>{children}</div>
      </div>
    </div>
  );
}
