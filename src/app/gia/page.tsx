import SectionHubPage from "@/widgets/pages/SectionHubPage/SectionHubPage";
import { getGiaReferenceHub } from "@/shared/api/adapters/gia.adapter";

export default async function Page() {
  const page = await getGiaReferenceHub();
  return <SectionHubPage page={page} />;
}
