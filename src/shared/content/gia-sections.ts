export type GiaExamKey = "gia-9" | "gia-11";

export interface GiaSectionDefinition {
  exam: GiaExamKey;
  id: string;
  rendererKey: string;
  slug: string;
  title: string;
  description: string;
  documentSectionKey: string;
  order: number;
}

const SHARED_SECTIONS = [
  {
    id: "docs",
    slug: "normative-documents",
    title: "Нормативные документы",
    description:
      "Приказы, положения и методические материалы по проведению государственной итоговой аттестации.",
  },
  {
    id: "demo",
    slug: "demo",
    title: "Демоверсии",
    description:
      "Демонстрационные варианты, спецификации и кодификаторы экзаменационных материалов.",
  },
  {
    id: "dates",
    slug: "deadlines",
    title: "Сроки проведения",
    description:
      "Расписание экзаменов, резервные дни и важные даты для участников государственной итоговой аттестации.",
  },
  {
    id: "results",
    slug: "results",
    title: "Результаты",
    description:
      "Информация о публикации результатов, сроках обработки экзаменационных работ и рассмотрении апелляций.",
  },
  {
    id: "reports",
    slug: "reports",
    title: "Отчеты председателей предметных комиссий",
    description:
      "Аналитические материалы и отчеты председателей предметных комиссий по итогам экзаменационной кампании.",
  },
] as const;

function makeSection(
  exam: GiaExamKey,
  section: (typeof SHARED_SECTIONS)[number],
  order: number,
): GiaSectionDefinition {
  const rendererKey = `${exam}.${section.slug}`;
  return {
    exam,
    id: section.id,
    rendererKey,
    slug: section.slug,
    title: section.title,
    description: section.description,
    documentSectionKey: rendererKey,
    order,
  };
}

const GIA_9_SECTIONS = SHARED_SECTIONS.map((section, index) =>
  makeSection("gia-9", section, index + 1),
);

const GIA_11_SECTIONS: readonly GiaSectionDefinition[] = [
  ...SHARED_SECTIONS.map((section, index) =>
    makeSection("gia-11", section, index + 1),
  ),
  {
    exam: "gia-11",
    id: "essay",
    rendererKey: "gia-11.essay",
    slug: "essay",
    title: "Итоговое сочинение",
    description:
      "Материалы, порядок проведения и результаты итогового сочинения и изложения.",
    documentSectionKey: "gia-11.essay",
    order: 6,
  },
  {
    exam: "gia-11",
    id: "analytics",
    rendererKey: "gia-11.analytics",
    slug: "analytics",
    title: "Аналитические материалы ЕГЭ",
    description:
      "Сводные аналитические материалы по результатам проведения единого государственного экзамена.",
    documentSectionKey: "gia-11.analytics",
    order: 7,
  },
];

const REGISTRY: Record<GiaExamKey, readonly GiaSectionDefinition[]> = {
  "gia-9": GIA_9_SECTIONS,
  "gia-11": GIA_11_SECTIONS,
};

export function getGiaSections(
  exam: GiaExamKey,
): readonly GiaSectionDefinition[] {
  return REGISTRY[exam];
}

export function getGiaSectionBySlug(
  exam: GiaExamKey,
  slug: string,
): GiaSectionDefinition | null {
  return getGiaSections(exam).find((section) => section.slug === slug) ?? null;
}

export function getGiaSectionByRendererKey(
  exam: GiaExamKey,
  rendererKey: string,
): GiaSectionDefinition | null {
  return (
    getGiaSections(exam).find(
      (section) => section.rendererKey === rendererKey,
    ) ?? null
  );
}
