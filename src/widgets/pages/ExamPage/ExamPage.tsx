import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import PublicDocumentsBlock from "@/shared/ui/PublicDocumentsBlock/PublicDocumentsBlock";
import type { ExamPageData } from "@/shared/content/content.types";
import type { PublicDocumentsResult } from "@/shared/api/adapters/public-documents.adapter";
import cls from "./ExamPage.module.scss";

function getSectionSlug(id: string) {
  const aliases: Record<string, string> = {
    docs: "normative-documents",
    dates: "deadlines",
  };
  return aliases[id] ?? id;
}

export function ExamPageHeroSection({ page }: { page: ExamPageData }) {
  return (
    <PageHero
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      breadcrumbs={[
        { title: "Главная", href: "/" },
        { title: page.title },
      ]}
    />
  );
}

export function ExamPageContentSection({
  page,
  sectionIds,
  publicDocumentsBySection,
}: {
  page: ExamPageData;
  sectionIds: string[];
  publicDocumentsBySection: Record<string, PublicDocumentsResult>;
}) {
  return (
    <>
      {sectionIds.map((sectionId) => {
        const section = page.sections.find((item) => item.id === sectionId);
        if (!section) {
          throw new Error(`EXAM_SECTION_NOT_FOUND:${page.href}:${sectionId}`);
        }
        const index = page.sections.indexOf(section);
        const publicDocuments = publicDocumentsBySection[
          getSectionSlug(section.id)
        ] ?? { documents: [], error: false };

        return (
          <Section
            key={section.id}
            id={section.id}
            muted={index % 2 === 1}
          >
            <Container>
              <div className={cls.sectionGrid}>
                <div>
                  <p className={cls.kicker}>
                    Раздел {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>
                <PublicDocumentsBlock
                  result={publicDocuments}
                  title={section.title}
                  hideWhenEmpty={false}
                  variant="examTab"
                />
              </div>
            </Container>
          </Section>
        );
      })}
    </>
  );
}

export default function ExamPage({
  page,
  publicDocumentsBySection,
}: {
  page: ExamPageData;
  publicDocumentsBySection: Record<string, PublicDocumentsResult>;
}) {
  return (
    <>
      <ExamPageHeroSection page={page} />
      <ExamPageContentSection
        page={page}
        sectionIds={page.sections.map((section) => section.id)}
        publicDocumentsBySection={publicDocumentsBySection}
      />
    </>
  );
}
