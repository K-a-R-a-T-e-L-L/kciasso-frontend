import PageHero from "@/shared/ui/PageHero/PageHero";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import ResourceCard from "@/shared/ui/ResourceCard/ResourceCard";
import { usefulResources } from "@/shared/content/mock";

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ресурсы"
        title="Полезные ресурсы"
        description="Федеральные и региональные сервисы, официальные сайты и полезные ссылки для участников образовательного процесса."
        breadcrumbs={[{ title: "Главная", href: "/" }, { title: "Полезные ресурсы" }]}
      />
      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {usefulResources.map((item) => (
              <ResourceCard key={item.href} {...item} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
