import type { AdminSiteSettingsResponseDto } from "@/shared/api/generated/types";

export type AdminSiteSettingsFormState = {
  error: string | null;
  success: string | null;
};

export const adminSiteSettingsFormInitialState: AdminSiteSettingsFormState = {
  error: null,
  success: null,
};

export type AdminSiteSettingsFormData = Pick<
  AdminSiteSettingsResponseDto,
  "giaHotlinePhone" | "informationPhone" | "egeTrustPhone" | "email" | "homeSectionsOrder"
>;
