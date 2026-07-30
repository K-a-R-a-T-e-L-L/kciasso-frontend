import ResourcesPage from "@/widgets/pages/ResourcesPage/ResourcesPage";
import OrderedPublicPage from "@/widgets/pages/PageLayoutRenderer/OrderedPublicPage";

export default function Page() {
  return (
    <OrderedPublicPage
      pageKey="resources"
      systemSections={{ "resources.catalog": <ResourcesPage /> }}
    />
  );
}
