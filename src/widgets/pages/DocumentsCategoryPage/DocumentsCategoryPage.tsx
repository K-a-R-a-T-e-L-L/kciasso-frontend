import PageHero from "@/shared/ui/PageHero/PageHero";
import Section from "@/shared/ui/Section/Section";
import Container from "@/shared/ui/Container/Container";
import DocumentPlaceholder from "@/shared/ui/DocumentPlaceholder/DocumentPlaceholder";

export default function DocumentsCategoryPage() {
  return (
    <>
      <PageHero eyebrow="Материалы" title="Документы раздела" description="Шаблон страницы для документальных разделов. Списки файлов будут подключены отдельным этапом." />
      <Section>
        <Container>
          <DocumentPlaceholder />
        </Container>
      </Section>
    </>
  );
}
