import { getAboutHub } from "@/shared/api/adapters/about.adapter";
import SectionHubPage from "@/widgets/pages/SectionHubPage/SectionHubPage";
import OrderedPublicPage from "@/widgets/pages/PageLayoutRenderer/OrderedPublicPage";

export default async function Page() {
  const page = await getAboutHub();
  return (
    <OrderedPublicPage
      pageKey="about"
      systemSections={{ "about.root": <SectionHubPage page={page} /> }}
    />
  );
}
