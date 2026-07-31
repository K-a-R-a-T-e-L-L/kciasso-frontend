import { getGia9Page } from "@/shared/api/adapters/gia.adapter";
import GiaRootPage from "@/widgets/pages/ExamPage/GiaRootPage";

export default async function Page() {
  const page = await getGia9Page();
  return <GiaRootPage exam="gia-9" page={page} />;
}
