import { getAboutHub } from "@/shared/api/adapters/about.adapter";
import SectionHubPage from "@/widgets/pages/SectionHubPage/SectionHubPage";

export default async function Page() {
  const page = await getAboutHub();
  return <SectionHubPage page={page} />;
}
