import type { HubPageData } from "@/shared/content/content.types";
import { buildQualitySectionHref, qualitySectionRoots } from "@/shared/content/qualitySections";

export const qualityHub: HubPageData = {
  title: "Качество образования",
  eyebrow: "Оценочные процедуры и исследования",
  href: "/kachestvo-obrazovaniya",
  description:
    "Раздел объединяет региональные и федеральные процедуры оценки качества образования, международные исследования и материалы по управлению качеством.",
  cards: qualitySectionRoots.map((item) => ({
    title: item.title,
    href: buildQualitySectionHref([item.slug]),
    description: item.description,
  })),
};
