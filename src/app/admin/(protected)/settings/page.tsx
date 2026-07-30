import { redirect } from "next/navigation";
import { Stack } from "@mantine/core";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus, isAdminApiTransportError } from "@/shared/admin/api-error";
import { getAdminSiteSettings } from "@/shared/api/adapters/admin-site-settings.adapter";
import AdminBackendUnavailable from "@/widgets/admin/AdminBackendUnavailable/AdminBackendUnavailable";
import AdminPageHeader from "@/shared/ui/admin/AdminPageHeader";
import AdminSiteSettingsForm from "@/widgets/admin/AdminSiteSettingsForm/AdminSiteSettingsForm.client";
import { updateSiteSettingsAction } from "./actions";

export default async function Page() {
  let token: string;
  try { token = (await requireAdminSectionToken("site-settings")).token; } catch (error) {
    if (isAdminApiTransportError(error)) return <AdminBackendUnavailable retryHref="/admin/settings" />;
    throw error;
  }
  let settings;
  try { settings = await getAdminSiteSettings(token); } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) { await clearAdminTokenCookie(); redirect("/admin/login"); }
    if (isAdminApiErrorStatus(error, 403)) redirect("/admin/forbidden");
    if (isAdminApiTransportError(error)) return <AdminBackendUnavailable retryHref="/admin/settings" />;
    throw error;
  }
  return <Stack gap="lg"><AdminPageHeader eyebrow="Настройки сайта" title="Контакты" description="Централизованное управление телефонами и email для публичных блоков сайта." />
    <AdminSiteSettingsForm initialData={{ giaHotlinePhone: settings.giaHotlinePhone, informationPhone: settings.informationPhone, egeTrustPhone: settings.egeTrustPhone, email: settings.email, homeSectionsOrder: settings.homeSectionsOrder }} action={updateSiteSettingsAction} />
  </Stack>;
}
