import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import DirectionCard from "@/shared/ui/DirectionCard/DirectionCard";
import DocumentPlaceholder from "@/shared/ui/DocumentPlaceholder/DocumentPlaceholder";
import type { HubPageData } from "@/shared/content/mock";
import ClientWrapperCard from "../../../shared/ui/DirectionCard/ClientCardsGrid";
import ClientCardsGrid from "../../../shared/ui/DirectionCard/ClientCardsGrid";

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
          <ClientCardsGrid cards={page.cards} />
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
