"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminApiErrorMessage, isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { updateAdminSiteSettings } from "@/shared/api/adapters/admin-site-settings.adapter";
import { HOME_SECTION_KEYS } from "@/shared/api/adapters/site-settings.adapter";
import type { UpdateSiteSettingsDtoHomeSectionsOrderEnumKey } from "@/shared/api/generated/types/UpdateSiteSettingsDto";
import type { AdminSiteSettingsFormState } from "@/widgets/admin/AdminSiteSettingsForm/AdminSiteSettingsForm.types";

function parseSettingsFormData(formData: FormData) {
  return {
    giaHotlinePhone: String(formData.get("giaHotlinePhone") ?? "").trim(),
    informationPhone: String(formData.get("informationPhone") ?? "").trim(),
    egeTrustPhone: String(formData.get("egeTrustPhone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    homeSectionsOrder: formData.getAll("homeSectionsOrder").map(String) as UpdateSiteSettingsDtoHomeSectionsOrderEnumKey[],
  };
}

export async function updateSiteSettingsAction(
  _: AdminSiteSettingsFormState,
  formData: FormData,
): Promise<AdminSiteSettingsFormState> {
  const { token } = await requireAdminSectionToken("site-settings");
  const payload = parseSettingsFormData(formData);

  if (
    !payload.giaHotlinePhone ||
    !payload.informationPhone ||
    !payload.egeTrustPhone ||
    !payload.email ||
    payload.homeSectionsOrder.length !== 4 ||
    new Set(payload.homeSectionsOrder).size !== 4 ||
    payload.homeSectionsOrder.some((key) => !HOME_SECTION_KEYS.includes(key))
  ) {
    return {
      error: "Порядок секций содержит недопустимое значение или заполнены не все поля контактов.",
      success: null,
    };
  }

  try {
    await updateAdminSiteSettings(token, payload);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) {
      await clearAdminTokenCookie();
      redirect("/admin/login");
    }

    if (isAdminApiErrorStatus(error, 403)) {
      redirect("/admin/forbidden");
    }

    return {
      error: getAdminApiErrorMessage(error, "Не удалось сохранить настройки сайта."),
      success: null,
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/o-centre/kontakty");
  revalidatePath("/admin/settings");

  return {
    error: null,
    success: "Настройки сайта сохранены",
  };
}
