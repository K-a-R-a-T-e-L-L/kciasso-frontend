import { getQualityHub } from "@/shared/api/adapters/quality.adapter";
import SectionHubPage from "@/widgets/pages/SectionHubPage/SectionHubPage";

export default async function Page() {
  const page = await getQualityHub();
  return <SectionHubPage page={page} />;
}
