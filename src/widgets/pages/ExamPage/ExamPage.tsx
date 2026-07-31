import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import PublicDocumentsBlock from "@/shared/ui/PublicDocumentsBlock/PublicDocumentsBlock";
import type { ExamPageData } from "@/shared/content/content.types";
import type { PublicDocumentsResult } from "@/shared/api/adapters/public-documents.adapter";
import cls from "./ExamPage.module.scss";

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
  sectionId,
  publicDocuments,
}: {
  page: ExamPageData;
  sectionId: string;
  publicDocuments: PublicDocumentsResult;
}) {
  const section = page.sections.find((item) => item.id === sectionId);
  if (!section) {
    throw new Error(`EXAM_SECTION_NOT_FOUND:${page.href}:${sectionId}`);
  }
  const index = page.sections.indexOf(section);
  return (
    <Section id={section.id} muted={index % 2 === 1}>
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
}
