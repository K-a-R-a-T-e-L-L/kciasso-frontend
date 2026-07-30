import { getGia9Page } from "@/shared/api/adapters/gia.adapter";
import { getPublicDocuments } from "@/shared/api/adapters/public-documents.adapter";
import {
  ExamPageContentSection,
  ExamPageHeroSection,
} from "@/widgets/pages/ExamPage/ExamPage";
import OrderedPublicPage from "@/widgets/pages/PageLayoutRenderer/OrderedPublicPage";

export default async function Page() {
  const page = await getGia9Page();
  const keys = ["normative-documents", "demo", "deadlines", "results", "reports"];
  const entries = await Promise.all(keys.map(async (key) => [key, await getPublicDocuments(`gia-9.${key}`)] as const));
  const documents = Object.fromEntries(entries);

  return (
    <OrderedPublicPage
      pageKey="gia.9"
      systemSections={{
        "gia-9.hero": <ExamPageHeroSection page={page} />,
        "gia-9.normative-documents": <ExamPageContentSection page={page} sectionIds={["docs"]} publicDocumentsBySection={documents} />,
        "gia-9.demo": <ExamPageContentSection page={page} sectionIds={["demo"]} publicDocumentsBySection={documents} />,
        "gia-9.deadlines": <ExamPageContentSection page={page} sectionIds={["dates"]} publicDocumentsBySection={documents} />,
        "gia-9.results": <ExamPageContentSection page={page} sectionIds={["results"]} publicDocumentsBySection={documents} />,
        "gia-9.reports": <ExamPageContentSection page={page} sectionIds={["reports"]} publicDocumentsBySection={documents} />,
      }}
    />
  );
}
