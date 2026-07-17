import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import DocumentPlaceholder from "@/shared/ui/DocumentPlaceholder/DocumentPlaceholder";
import LinkTabsNav from "@/shared/ui/TabsNav/LinkTabsNav";
import type { ContentPageData } from "@/shared/content/content.types";
import type { PublicDocumentsResult } from "@/shared/api/adapters/public-documents.adapter";
import PublicDocumentsBlock from "@/shared/ui/PublicDocumentsBlock/PublicDocumentsBlock";
import cls from "./ContentPage.module.scss";

export default function ContentPage({
  page,
  publicDocuments,
}: {
  page: ContentPageData;
  publicDocuments?: PublicDocumentsResult;
}) {
  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        breadcrumbs={[
          { title: "Главная", href: "/" },
          { title: page.sectionTitle, href: page.sectionHref },
          { title: page.title },
        ]}
      />
      <Container>
        <LinkTabsNav
          ariaLabel="Навигация по разделу"
          activeKey={page.href}
          items={page.tabs.map((item) => ({
            key: item.href,
            title: item.title,
            href: item.href,
          }))}
        />
      </Container>
      <Section>
        <Container>
          <div className={cls.layout}>
            <article className="prose-content">
              {page.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </article>
          </div>
          {publicDocuments ? (
            <PublicDocumentsBlock
              result={publicDocuments}
              title="Документы и материалы"
              variant="fullWidth"
            />
          ) : (
            <DocumentPlaceholder />
          )}
        </Container>
      </Section>
    </>
  );
}
