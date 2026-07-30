import SectionHubPage from "@/widgets/pages/SectionHubPage/SectionHubPage";
import { getGiaReferenceHub } from "@/shared/api/adapters/gia.adapter";
import OrderedPublicPage from "@/widgets/pages/PageLayoutRenderer/OrderedPublicPage";

export default async function Page() {
  const page = await getGiaReferenceHub();
  return (
    <OrderedPublicPage
      pageKey="gia"
      systemSections={{ "gia.root": <SectionHubPage page={page} /> }}
    />
  );
}
