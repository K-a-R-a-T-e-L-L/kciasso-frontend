import { getGia9Page } from "@/shared/api/adapters/gia.adapter";
import ExamPage from "@/widgets/pages/ExamPage/ExamPage";

type Props = {
  searchParams: Promise<{ section?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const page = await getGia9Page();
  const params = await searchParams;

  return <ExamPage page={page} initialSectionId={params.section} />;
}
