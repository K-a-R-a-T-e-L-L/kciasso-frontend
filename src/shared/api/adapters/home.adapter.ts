import { getGiaReferenceHub } from "@/shared/api/adapters/gia.adapter";
import { getLatestNewsPreview } from "@/shared/api/adapters/news.adapter";
import { homeDirections } from "@/shared/content/home.mock";
import { officialResourceCards, services } from "@/shared/content/resources.mock";

export async function getHomePageData() {
  return {
    homeDirections,
    latestNewsPreview: await getLatestNewsPreview(),
    giaReferenceHub: await getGiaReferenceHub(),
    officialResourceCards,
    services,
  };
}
