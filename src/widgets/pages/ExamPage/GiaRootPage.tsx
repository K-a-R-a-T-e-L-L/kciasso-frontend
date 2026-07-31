import type { ExamPageData } from "@/shared/content/content.types";
import {
  getGiaSectionByRendererKey,
  type GiaExamKey,
} from "@/shared/content/gia-sections";
import { getPublicPageLayout } from "@/shared/api/adapters/page-layout.adapter";
import { getPublicSiteSettings } from "@/shared/api/adapters/site-settings.adapter";
import PublicContactsBoundary from "@/widgets/sections/UniversalContactsSection/PublicContactsBoundary.client";
import PublicPageSections from "@/widgets/pages/PublicPageSections/PublicPageSections";
import {
  PublicSystemSectionsProvider,
  type PublicSystemSectionNodes,
} from "@/widgets/pages/PublicPageSections/public-system-renderers";
import { ExamPageHeroSection } from "./ExamPage";
import GiaSectionPreviewCard from "./GiaSectionPreviewCard";
import GiaSectionsPreviewGrid from "./GiaSectionsPreviewGrid";
import { partitionExamLayout } from "./partition-exam-layout";

export default async function GiaRootPage({
  exam,
  page,
}: {
  exam: GiaExamKey;
  page: ExamPageData;
}) {
  const pageKey = exam === "gia-9" ? "gia.9" : "gia.11";
  const [layout, contacts] = await Promise.all([
    getPublicPageLayout(pageKey),
    getPublicSiteSettings(),
  ]);

  if (!layout) {
    throw new Error(`PUBLIC_PAGE_LAYOUT_NOT_FOUND:${pageKey}`);
  }

  const partitions = partitionExamLayout(exam, layout.sections);
  const systemSections: PublicSystemSectionNodes = {
    [`${exam}.hero`]: <ExamPageHeroSection page={page} />,
    "global.contacts": <PublicContactsBoundary contacts={contacts} />,
  };

  for (const placement of partitions.content) {
    if (!placement.systemRendererKey) continue;
    const section = getGiaSectionByRendererKey(
      exam,
      placement.systemRendererKey,
    );
    if (section) {
      systemSections[section.rendererKey as keyof PublicSystemSectionNodes] = (
        <GiaSectionPreviewCard section={section} />
      );
    }
  }

  return (
    <PublicSystemSectionsProvider sections={systemSections}>
      <PublicPageSections pageKey={pageKey} sections={partitions.hero} />
      <GiaSectionsPreviewGrid
        pageKey={pageKey}
        sections={partitions.content}
      />
      <PublicPageSections pageKey={pageKey} sections={partitions.contacts} />
    </PublicSystemSectionsProvider>
  );
}
