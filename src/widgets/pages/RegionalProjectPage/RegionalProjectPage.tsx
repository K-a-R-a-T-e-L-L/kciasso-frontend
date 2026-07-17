import type { HubPageData } from "@/shared/content/content.types";
import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import ClientCardsGrid from "@/shared/ui/DirectionCard/ClientCardsGrid";
import RegionalProjectHashRedirect from "@/widgets/public/RegionalProjectHashRedirect/RegionalProjectHashRedirect.client";

export default function RegionalProjectPage({ page }: { page: HubPageData }) {
  return (
    <>
      <RegionalProjectHashRedirect />
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
    </>
  );
}
