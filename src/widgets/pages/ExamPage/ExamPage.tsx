import PageHero from "@/shared/ui/PageHero/PageHero";
import type { ExamPageData } from "@/shared/content/content.types";
import type { PublicDocumentsResult } from "@/shared/api/adapters/public-documents.adapter";
import ExamPageTabs from "./ExamPageTabs.client";

export default function ExamPage({
  page,
  initialSectionId,
  pageKey,
  publicDocumentsBySection,
}: {
  page: ExamPageData;
  initialSectionId?: string;
  pageKey: "gia-9" | "gia-11";
  publicDocumentsBySection: Record<string, PublicDocumentsResult>;
}) {
  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        breadcrumbs={[{ title: "Главная", href: "/" }, { title: page.title }]}
      />
      <ExamPageTabs page={page} initialSectionId={initialSectionId} pageKey={pageKey} publicDocumentsBySection={publicDocumentsBySection} />
    </>
  );
}
