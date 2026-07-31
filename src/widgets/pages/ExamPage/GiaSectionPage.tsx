import Link from "next/link";
import { notFound } from "next/navigation";
import { Group, Stack, Text } from "@mantine/core";
import type { ExamPageData } from "@/shared/content/content.types";
import {
  getGiaSectionBySlug,
  getGiaSections,
  type GiaExamKey,
} from "@/shared/content/gia-sections";
import { getPublicPageLayout } from "@/shared/api/adapters/page-layout.adapter";
import { getPublicDocuments } from "@/shared/api/adapters/public-documents.adapter";
import { getPublicSiteSettings } from "@/shared/api/adapters/site-settings.adapter";
import Container from "@/shared/ui/Container/Container";
import PublicContactsBoundary from "@/widgets/sections/UniversalContactsSection/PublicContactsBoundary.client";
import PageLayoutRenderer from "@/widgets/pages/PageLayoutRenderer/PageLayoutRenderer";
import type { PublicSystemSectionNodes } from "@/widgets/pages/PublicPageSections/public-system-renderers";
import { ExamPageContentSection, ExamPageHeroSection } from "./ExamPage";

export default async function GiaSectionPage({
  exam,
  page,
  sectionSlug,
}: {
  exam: GiaExamKey;
  page: ExamPageData;
  sectionSlug: string;
}) {
  const section = getGiaSectionBySlug(exam, sectionSlug);
  if (!section) notFound();

  const pageKey = exam === "gia-9" ? "gia.9" : "gia.11";
  const [layout, contacts] = await Promise.all([
    getPublicPageLayout(pageKey),
    getPublicSiteSettings(),
  ]);
  if (!layout) notFound();

  const selectedPlacement = layout.sections.find(
    (placement) => placement.systemRendererKey === section.rendererKey,
  );
  if (!selectedPlacement) notFound();

  const documents = await getPublicDocuments(section.documentSectionKey);
  const subset = layout.sections.filter(
    (placement) =>
      placement.systemRendererKey === `${exam}.hero` ||
      placement.systemRendererKey === section.rendererKey ||
      placement.systemRendererKey === "global.contacts",
  );

  const systemSections: PublicSystemSectionNodes = {
    [`${exam}.hero`]: <ExamPageHeroSection page={page} />,
    [section.rendererKey]: (
      <Stack gap="xl">
        <Container>
          <Text size="sm" c="dimmed">
            <Link href={page.href}>
              {page.title}
            </Link>
            {" / "}
            {section.title}
          </Text>
          <Group component="nav" aria-label="Разделы ГИА" mt="md" gap="xs">
            {getGiaSections(exam).map((item) => (
              <Link
                key={item.slug}
                href={`/${exam}/${item.slug}`}
                aria-current={item.slug === section.slug ? "page" : undefined}
                style={{ fontWeight: item.slug === section.slug ? 800 : 500 }}
              >
                {item.title}
              </Link>
            ))}
          </Group>
        </Container>
        <ExamPageContentSection
          page={page}
          sectionId={section.id}
          publicDocuments={documents}
        />
      </Stack>
    ),
    "global.contacts": <PublicContactsBoundary contacts={contacts} />,
  };

  return (
    <PageLayoutRenderer
      layout={{ pageKey, sections: subset }}
      systemSections={systemSections}
    />
  );
}
