import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus, isAdminApiTransportError } from "@/shared/admin/api-error";
import { getAdminSiteSettings } from "@/shared/api/adapters/admin-site-settings.adapter";
import AdminBackendUnavailable from "@/widgets/admin/AdminBackendUnavailable/AdminBackendUnavailable";
import AdminSiteSettingsForm from "@/widgets/admin/AdminSiteSettingsForm/AdminSiteSettingsForm.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";
import { updateSiteSettingsAction } from "./actions";

export default async function Page() {
  let token: string;

  try {
    token = (await requireAdminSectionToken("site-settings")).token;
  } catch (error) {
    if (isAdminApiTransportError(error)) {
      return (
        <main className={cls.page}>
          <AdminBackendUnavailable retryHref="/admin/settings" />
        </main>
      );
    }

    throw error;
  }

  let settings;

  try {
    settings = await getAdminSiteSettings(token);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) {
      await clearAdminTokenCookie();
      redirect("/admin/login");
    }

    if (isAdminApiErrorStatus(error, 403)) {
      redirect("/admin/forbidden");
    }

    if (isAdminApiTransportError(error)) {
      return (
        <main className={cls.page}>
          <AdminBackendUnavailable retryHref="/admin/settings" />
        </main>
      );
    }

    throw error;
  }

  return (
    <section className={cls.section}>
      <div className={cls.sectionHeader}>
        <div>
          <span className={cls.eyebrow}>Настройки сайта</span>
          <h1>Контакты</h1>
          <p>Централизованное управление телефонами и email для всех публичных блоков сайта.</p>
        </div>
      </div>

      <AdminSiteSettingsForm
        initialData={{
          giaHotlinePhone: settings.giaHotlinePhone,
          informationPhone: settings.informationPhone,
          egeTrustPhone: settings.egeTrustPhone,
          email: settings.email,
          homeSectionsOrder: settings.homeSectionsOrder,
        }}
        action={updateSiteSettingsAction}
      />
    </section>
  );
}
