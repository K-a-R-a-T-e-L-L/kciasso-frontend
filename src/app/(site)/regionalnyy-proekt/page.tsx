import { getRegionalProjectHub } from "@/shared/api/adapters/regionalProject.adapter";
import RegionalProjectPage from "@/widgets/pages/RegionalProjectPage/RegionalProjectPage";

export default async function Page() {
  const page = await getRegionalProjectHub();
  return <RegionalProjectPage page={page} />;
}
