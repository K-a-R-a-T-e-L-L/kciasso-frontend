import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import PublicPageSections from "@/widgets/pages/PublicPageSections/PublicPageSections";
import type { PublicPageSectionViewModel } from "@/shared/api/adapters/page-layout.adapter";

export default function GiaSectionsPreviewGrid({
  pageKey,
  sections,
}: {
  pageKey: string;
  sections: PublicPageSectionViewModel[];
}) {
  return (
    <Section>
      <Container>
        <div
          data-testid="gia-preview-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
            alignItems: "stretch",
          }}
        >
          <PublicPageSections pageKey={pageKey} sections={sections} />
        </div>
      </Container>
    </Section>
  );
}
