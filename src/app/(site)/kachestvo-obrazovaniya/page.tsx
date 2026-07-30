import { getQualityHub } from "@/shared/api/adapters/quality.adapter";
import SectionHubPage from "@/widgets/pages/SectionHubPage/SectionHubPage";
import OrderedPublicPage from "@/widgets/pages/PageLayoutRenderer/OrderedPublicPage";

export default async function Page() {
  const page = await getQualityHub();
  return (
    <OrderedPublicPage
      pageKey="quality"
      systemSections={{ "quality.root": <SectionHubPage page={page} /> }}
    />
  );
}
