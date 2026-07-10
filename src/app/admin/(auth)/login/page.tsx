import { redirect } from "next/navigation";
import { getOptionalAdmin } from "@/shared/admin/auth";
import AdminLoginForm from "@/widgets/admin/AdminLoginForm/AdminLoginForm.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";

export default async function Page() {
  const admin = await getOptionalAdmin();

  if (admin) {
    redirect("/admin/news");
  }

  return (
    <main className={cls.page}>
      <section className={cls.standaloneCard}>
        <span className={cls.eyebrow}>Admin</span>
        <h1>Вход в панель управления</h1>
        <p>Используйте учетную запись с правами super-admin или доступом к управлению новостями.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
