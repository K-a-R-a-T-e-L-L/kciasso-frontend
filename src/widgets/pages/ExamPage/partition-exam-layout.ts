import type { PublicPageSectionViewModel } from "@/shared/api/adapters/page-layout.adapter";
import {
  getGiaSectionByRendererKey,
  type GiaExamKey,
} from "@/shared/content/gia-sections";

export interface PartitionedExamLayout {
  hero: PublicPageSectionViewModel[];
  content: PublicPageSectionViewModel[];
  contacts: PublicPageSectionViewModel[];
  trailingGlobal: PublicPageSectionViewModel[];
}

export function partitionExamLayout(
  exam: GiaExamKey,
  sections: PublicPageSectionViewModel[],
): PartitionedExamLayout {
  const result: PartitionedExamLayout = {
    hero: [],
    content: [],
    contacts: [],
    trailingGlobal: [],
  };

  let contactsSeen = false;
  for (const section of sections) {
    if (section.systemRendererKey === `${exam}.hero`) {
      result.hero.push(section);
    } else if (section.type === "GLOBAL_CUSTOM_HTML") {
      (contactsSeen ? result.trailingGlobal : result.content).push(section);
    } else if (section.systemRendererKey === "global.contacts") {
      result.contacts.push(section);
      contactsSeen = true;
    } else if (section.type === "PAGE_CUSTOM_HTML") {
      result.content.push(section);
    } else if (
      section.systemRendererKey &&
      getGiaSectionByRendererKey(exam, section.systemRendererKey)
    ) {
      result.content.push(section);
    } else {
      throw new Error(
        `UNKNOWN_GIA_LAYOUT_RENDERER:${exam}:${section.systemRendererKey ?? section.type}`,
      );
    }
  }

  return result;
}

export function selectGiaSectionLayout(
  exam: GiaExamKey,
  selectedRendererKey: string,
  sections: PublicPageSectionViewModel[],
) {
  return sections.filter(
    (section) =>
      section.systemRendererKey === `${exam}.hero` ||
      section.systemRendererKey === selectedRendererKey ||
      section.systemRendererKey === "global.contacts" ||
      section.type === "GLOBAL_CUSTOM_HTML",
  );
}
