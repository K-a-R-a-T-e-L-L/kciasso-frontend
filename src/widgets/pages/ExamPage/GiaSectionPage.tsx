import { notFound } from "next/navigation";
import { Stack, Text } from "@mantine/core";
import type { ExamPageData } from "@/shared/content/content.types";
import { getGiaSectionBySlug, getGiaSections, type GiaExamKey } from "@/shared/content/gia-sections";
import { getPublicPageLayout } from "@/shared/api/adapters/page-layout.adapter";
import { getPublicDocuments } from "@/shared/api/adapters/public-documents.adapter";
import { getPublicSiteSettings } from "@/shared/api/adapters/site-settings.adapter";
import Container from "@/shared/ui/Container/Container";
import LinkTabsNav from "@/shared/ui/TabsNav/LinkTabsNav";
import PublicContactsBoundary from "@/widgets/sections/UniversalContactsSection/PublicContactsBoundary.client";
import PageLayoutRenderer from "@/widgets/pages/PageLayoutRenderer/PageLayoutRenderer";
import type { PublicSystemSectionNodes } from "@/widgets/pages/PublicPageSections/public-system-renderers";
import { ExamPageContentSection, ExamPageHeroSection } from "./ExamPage";
import { selectGiaSectionLayout } from "./partition-exam-layout";

export default async function GiaSectionPage({ exam, page, sectionSlug }: { exam: GiaExamKey; page: ExamPageData; sectionSlug: string }) {
  const section = getGiaSectionBySlug(exam, sectionSlug);
  if (!section) notFound();
  const pageKey = exam === "gia-9" ? "gia.9" : "gia.11";
  const [layout, contacts] = await Promise.all([getPublicPageLayout(pageKey), getPublicSiteSettings()]);
  if (!layout) notFound();
  const selectedPlacement = layout.sections.find((placement) => placement.systemRendererKey === section.rendererKey);
  if (!selectedPlacement) notFound();
  const documents = await getPublicDocuments(section.documentSectionKey);
  const subset = selectGiaSectionLayout(exam, section.rendererKey, layout.sections);
  const systemSections: PublicSystemSectionNodes = {
    [`${exam}.hero`]: <ExamPageHeroSection page={page} />,
    [section.rendererKey]: <Stack gap="xl"><Container><Text size="sm" c="dimmed">{page.title} / {section.title}</Text><LinkTabsNav ariaLabel="Разделы ГИА" activeKey={section.slug} items={getGiaSections(exam).map((item) => ({ key: item.slug, title: item.title, href: `/${exam}/${item.slug}` }))} /></Container><ExamPageContentSection page={page} sectionId={section.id} publicDocuments={documents} /></Stack>,
    "global.contacts": <PublicContactsBoundary contacts={contacts} />,
  };
  return <PageLayoutRenderer layout={{ pageKey, sections: subset }} systemSections={systemSections} />;
}
