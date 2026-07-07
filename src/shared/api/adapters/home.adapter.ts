import { contacts, primaryContacts } from "@/shared/content/contacts.mock";
import { homeDirections, latestNewsPreview } from "@/shared/content/home.mock";
import { services } from "@/shared/content/resources.mock";

export async function getHomePageData() {
  return {
    homeDirections,
    latestNewsPreview,
    services,
    contacts,
    primaryContacts,
  };
}
