import { getRegionalProjectHub } from "@/shared/api/adapters/regionalProject.adapter";
import RegionalProjectPage from "@/widgets/pages/RegionalProjectPage/RegionalProjectPage";
import OrderedPublicPage from "@/widgets/pages/PageLayoutRenderer/OrderedPublicPage";

export default async function Page() {
  const page = await getRegionalProjectHub();
  return (
    <OrderedPublicPage
      pageKey="regional-project"
      systemSections={{
        "regional-project.root": <RegionalProjectPage page={page} />,
      }}
    />
  );
}
