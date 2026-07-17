import { getGia9Page } from "@/shared/api/adapters/gia.adapter";
import { getPublicDocuments } from "@/shared/api/adapters/public-documents.adapter";
import ExamPage from "@/widgets/pages/ExamPage/ExamPage";

type Props = {
  searchParams: Promise<{ section?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const page = await getGia9Page();
  const keys = ["normative-documents", "demo", "deadlines", "results", "reports"];
  const entries = await Promise.all(keys.map(async (key) => [key, await getPublicDocuments(`gia-9.${key}`)] as const));
  const params = await searchParams;

  return <ExamPage page={page} initialSectionId={params.section} pageKey="gia-9" publicDocumentsBySection={Object.fromEntries(entries)} />;
}
