import {
  adminSiteSettingsControllerGetSettings,
  adminSiteSettingsControllerUpdateSettings,
} from "@/shared/api/generated/clients";
import type {
  AdminSiteSettingsControllerUpdateSettingsMutationRequest,
  AdminSiteSettingsResponseDto,
} from "@/shared/api/generated/types";
import { toAdminApiError } from "@/shared/admin/api-error";

function buildAdminConfig(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    skipAuthRedirect: true,
  } as const;
}

export async function getAdminSiteSettings(token: string): Promise<AdminSiteSettingsResponseDto> {
  try {
    return await adminSiteSettingsControllerGetSettings(buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function updateAdminSiteSettings(
  token: string,
  dto: AdminSiteSettingsControllerUpdateSettingsMutationRequest,
): Promise<AdminSiteSettingsResponseDto> {
  try {
    return await adminSiteSettingsControllerUpdateSettings(dto, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}
