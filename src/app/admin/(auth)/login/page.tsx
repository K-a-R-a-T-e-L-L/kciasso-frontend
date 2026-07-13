import { redirect } from "next/navigation";
import type { CurrentUserDto } from "@/shared/api/generated/types";
import { isAdminApiTransportError } from "@/shared/admin/api-error";
import { getOptionalAdmin } from "@/shared/admin/auth";
import AdminBackendUnavailable from "@/widgets/admin/AdminBackendUnavailable/AdminBackendUnavailable";
import AdminLoginForm from "@/widgets/admin/AdminLoginForm/AdminLoginForm.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";

export default async function Page() {
  let admin: CurrentUserDto | null = null;

  try {
    admin = await getOptionalAdmin();
  } catch (error) {
    if (isAdminApiTransportError(error)) {
      return (
        <main className={cls.page}>
          <AdminBackendUnavailable retryHref="/admin/login" />
        </main>
      );
    }

    throw error;
  }

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className={cls.page}>
      <section className={cls.standaloneCard}>
        <span className={cls.eyebrow}>Admin</span>
        <h1>Вход в панель управления</h1>
        <p>Используйте учетную запись с правами super-admin или назначенным доступом к разделам админ-панели.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
