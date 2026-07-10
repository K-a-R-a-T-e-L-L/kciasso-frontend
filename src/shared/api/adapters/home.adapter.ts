import { contacts, primaryContacts } from "@/shared/content/contacts.mock";
import { homeDirections } from "@/shared/content/home.mock";
import { services } from "@/shared/content/resources.mock";
import { getLatestNewsPreview } from "@/shared/api/adapters/news.adapter";

export async function getHomePageData() {
  return {
    homeDirections,
    latestNewsPreview: await getLatestNewsPreview(),
    services,
    contacts,
    primaryContacts,
  };
}
