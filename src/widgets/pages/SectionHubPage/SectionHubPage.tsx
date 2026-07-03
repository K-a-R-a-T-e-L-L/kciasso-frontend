import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import DirectionCard from "@/shared/ui/DirectionCard/DirectionCard";
import DocumentPlaceholder from "@/shared/ui/DocumentPlaceholder/DocumentPlaceholder";
import type { HubPageData } from "@/shared/content/mock";

export default function SectionHubPage({ page }: { page: HubPageData }) {
  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        breadcrumbs={[{ title: "Главная", href: "/" }, { title: page.title }]}
      />
      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {page.cards.map((item, index) => (
              <DirectionCard key={item.href} {...item} index={index} />
            ))}
          </div>
        </Container>
      </Section>
      <Section muted>
        <Container>
          <DocumentPlaceholder title="Документы и справочные материалы" />
        </Container>
      </Section>
    </>
  );
}
