import { aboutHub } from "@/shared/content/about.mock";
import { getAboutCenterPage } from "@/shared/content/aboutCenter";
import { getPrimaryContacts, getPublicSiteSettings } from "@/shared/api/adapters/site-settings.adapter";
import { organizationProfile } from "@/shared/content/default-site-settings";

export async function getAboutHub() {
  return aboutHub;
}

export async function getAboutPageBySlug(slug: string) {
  return getAboutCenterPage(slug) ?? null;
}

export async function getContactsData() {
  const contacts = await getPublicSiteSettings();

  return {
    contacts,
    primaryContacts: getPrimaryContacts(contacts),
    organizationProfile,
  };
}
