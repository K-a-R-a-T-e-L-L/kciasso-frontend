import { getGia11Page } from "@/shared/api/adapters/gia.adapter";
import ExamPage from "@/widgets/pages/ExamPage/ExamPage";

type Props = {
  searchParams: Promise<{ section?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const page = await getGia11Page();
  const params = await searchParams;

  return <ExamPage page={page} initialSectionId={params.section} />;
}
