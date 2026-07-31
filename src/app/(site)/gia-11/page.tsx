import { getGia11Page } from "@/shared/api/adapters/gia.adapter";
import GiaRootPage from "@/widgets/pages/ExamPage/GiaRootPage";

export default async function Page() {
  const page = await getGia11Page();
  return <GiaRootPage exam="gia-11" page={page} />;
}
