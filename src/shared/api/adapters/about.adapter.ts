import { aboutHub } from "@/shared/content/about.mock";
import { getAboutCenterPage } from "@/shared/content/aboutCenter";
import { contacts, primaryContacts } from "@/shared/content/contacts.mock";

export async function getAboutHub() {
  return aboutHub;
}

export async function getAboutPageBySlug(slug: string) {
  return getAboutCenterPage(slug) ?? null;
}

export async function getContactsData() {
  return {
    contacts,
    primaryContacts,
  };
}
