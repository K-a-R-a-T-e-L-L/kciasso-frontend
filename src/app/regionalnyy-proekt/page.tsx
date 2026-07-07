import { getRegionalProjectHub } from "@/shared/api/adapters/regionalProject.adapter";
import SectionHubPage from "@/widgets/pages/SectionHubPage/SectionHubPage";

export default async function Page() {
  const page = await getRegionalProjectHub();
  return <SectionHubPage page={page} />;
}
