import { cache } from "react";
import { publicSiteSettingsControllerGetSettings } from "@/shared/api/generated/clients";
import type { PublicSiteSettingsResponseDto } from "@/shared/api/generated/types";
import { defaultSiteSettingsDto } from "@/shared/content/default-site-settings";
import type { ContactEntry, SiteContacts } from "@/shared/content/content.types";

export const HOME_SECTION_KEYS = [
  "home.quick-access",
  "home.resources",
  "home.gia-reference",
  "home.official-resources",
] as const;
export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

function normalizeHomeSectionsOrder(value: unknown): HomeSectionKey[] {
  const allowed = new Set<string>(HOME_SECTION_KEYS);
  const result: HomeSectionKey[] = [];
  for (const key of Array.isArray(value) ? value : []) {
    if (typeof key === "string" && allowed.has(key) && !result.includes(key as HomeSectionKey)) {
      result.push(key as HomeSectionKey);
    }
  }
  for (const key of HOME_SECTION_KEYS) {
    if (!result.includes(key)) result.push(key);
  }
  return result;
}

function shouldUseFallback(error: unknown) {
  if (typeof error === "object" && error !== null && "status" in error) {
    return false;
  }

  return true;
}

export function toPhoneHref(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "tel:";
  }

  if (digits.length === 11 && digits.startsWith("8")) {
    return `tel:+7${digits.slice(1)}`;
  }

  if (digits.length === 11 && digits.startsWith("7")) {
    return `tel:+${digits}`;
  }

  if (digits.length === 10) {
    return `tel:+7${digits}`;
  }

  return `tel:+${digits}`;
}

function toContactEntry(label: string, value: string, href: string): ContactEntry {
  return {
    label,
    value,
    href,
  };
}

function mapSiteContacts(dto: PublicSiteSettingsResponseDto): SiteContacts {
  return {
    giaHotline: toContactEntry("Горячая линия ГИА", dto.giaHotlinePhone, toPhoneHref(dto.giaHotlinePhone)),
    informationPhone: toContactEntry("Телефон для справок", dto.informationPhone, toPhoneHref(dto.informationPhone)),
    egeTrustPhone: toContactEntry("Телефон доверия ЕГЭ", dto.egeTrustPhone, toPhoneHref(dto.egeTrustPhone)),
    email: toContactEntry("Электронная почта", dto.email, `mailto:${dto.email}`),
  };
}

export function getPrimaryContacts(contacts: SiteContacts): ContactEntry[] {
  return [contacts.giaHotline, contacts.informationPhone, contacts.egeTrustPhone, contacts.email];
}

const getSiteSettingsFromApi = cache(async () => {
  return publicSiteSettingsControllerGetSettings();
});

export async function getPublicSiteSettingsDto() {
  try {
    return await getSiteSettingsFromApi();
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
      console.error("Failed to load public site settings. Using fallback values.", error);
    }

    return defaultSiteSettingsDto;
  }
}

export async function getHomeSectionsOrder(): Promise<HomeSectionKey[]> {
  const dto = await getPublicSiteSettingsDto();
  return normalizeHomeSectionsOrder(dto.homeSectionsOrder);
}

export async function getPublicSiteSettings() {
  const dto = await getPublicSiteSettingsDto();
  return mapSiteContacts(dto);
}

export async function getPublicSiteHotline() {
  const contacts = await getPublicSiteSettings();
  return contacts.giaHotline;
}
