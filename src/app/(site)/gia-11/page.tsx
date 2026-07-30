import { getGia11Page } from "@/shared/api/adapters/gia.adapter";
import { getPublicDocuments } from "@/shared/api/adapters/public-documents.adapter";
import {
  ExamPageContentSection,
  ExamPageHeroSection,
} from "@/widgets/pages/ExamPage/ExamPage";
import OrderedPublicPage from "@/widgets/pages/PageLayoutRenderer/OrderedPublicPage";

export default async function Page() {
  const page = await getGia11Page();
  const keys = ["normative-documents", "demo", "deadlines", "results", "reports", "essay", "analytics"];
  const entries = await Promise.all(keys.map(async (key) => [key, await getPublicDocuments(`gia-11.${key}`)] as const));
  const documents = Object.fromEntries(entries);

  return (
    <OrderedPublicPage
      pageKey="gia.11"
      systemSections={{
        "gia-11.hero": <ExamPageHeroSection page={page} />,
        "gia-11.normative-documents": <ExamPageContentSection page={page} sectionIds={["docs"]} publicDocumentsBySection={documents} />,
        "gia-11.demo": <ExamPageContentSection page={page} sectionIds={["demo"]} publicDocumentsBySection={documents} />,
        "gia-11.deadlines": <ExamPageContentSection page={page} sectionIds={["dates"]} publicDocumentsBySection={documents} />,
        "gia-11.results": <ExamPageContentSection page={page} sectionIds={["results"]} publicDocumentsBySection={documents} />,
        "gia-11.reports": <ExamPageContentSection page={page} sectionIds={["reports"]} publicDocumentsBySection={documents} />,
        "gia-11.additional": <ExamPageContentSection page={page} sectionIds={["essay", "analytics"]} publicDocumentsBySection={documents} />,
      }}
    />
  );
}
