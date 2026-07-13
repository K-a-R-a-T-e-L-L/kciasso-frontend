import type { PublicSiteSettingsResponseDto } from "@/shared/api/generated/types";

export const organizationProfile = {
  legalForm: "Государственное казенное учреждение",
  fullName: "«Кузбасский центр информационно-аналитического сопровождения системы образования»",
  shortName: 'ГКУ "КЦИАССО"',
  address: "650000, г. Кемерово, пр-т Кузнецкий, 26",
  worktime: "Пн - Пт с 8:30 до 17:30",
} as const;

export const defaultSiteSettingsDto: PublicSiteSettingsResponseDto = {
  giaHotlinePhone: "8 (3842) 587025",
  informationPhone: "8 (495) 198-92-38",
  egeTrustPhone: "8 (495) 198-93-38",
  email: "info@kcias.ru",
  homeSectionsOrder: [
    "home.quick-access",
    "home.resources",
    "home.gia-reference",
    "home.official-resources",
  ],
};
