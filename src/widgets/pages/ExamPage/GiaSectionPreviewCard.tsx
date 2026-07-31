import DirectionCard from "@/shared/ui/DirectionCard/DirectionCard";
import type { GiaSectionDefinition } from "@/shared/content/gia-sections";

export default function GiaSectionPreviewCard({
  section,
}: {
  section: GiaSectionDefinition;
}) {
  return (
    <DirectionCard
      index={section.order - 1}
      title={section.title}
      description={section.description}
      href={`/${section.exam}/${section.slug}`}
    />
  );
}
