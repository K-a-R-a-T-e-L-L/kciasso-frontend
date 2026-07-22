export type PlacementItem = {
  key: string;
  title: string;
  publicRoute: string;
  anchor?: string;
  permissionKey: "documents";
};

export type PlacementGroup = {
  id: string;
  title: string;
  items: PlacementItem[];
};

const item = (
  key: string,
  title: string,
  publicRoute: string,
  anchor?: string,
): PlacementItem => ({
  key,
  title,
  publicRoute,
  ...(anchor ? { anchor } : {}),
  permissionKey: "documents",
});

const examItems = (group: "gia-9" | "gia-11") => [
  item(
    `${group}.normative-documents`,
    "Нормативные документы",
    `/${group}?section=normative-documents`,
    "docs",
  ),
  item(`${group}.demo`, "Демоверсии", `/${group}?section=demo`, "demo"),
  item(
    `${group}.deadlines`,
    "Сроки проведения",
    `/${group}?section=deadlines`,
    "dates",
  ),
  item(
    `${group}.results`,
    "Результаты",
    `/${group}?section=results`,
    "results",
  ),
  item(
    `${group}.reports`,
    "Отчёты комиссий",
    `/${group}?section=reports`,
    "reports",
  ),
  ...(group === "gia-11"
    ? [
        item(
          "gia-11.essay",
          "Итоговое сочинение",
          "/gia-11?section=essay",
          "essay",
        ),
        item(
          "gia-11.analytics",
          "Аналитические материалы ЕГЭ",
          "/gia-11?section=analytics",
          "analytics",
        ),
      ]
    : []),
];

const giaReference = [
  ["results", "Результаты экзаменов"],
  ["ege-appeals", "Апелляции ЕГЭ"],
  ["oge-appeals", "Апелляции ОГЭ"],
  ["final-essay", "Итоговое сочинение"],
  ["final-interview", "Итоговое собеседование"],
  ["ppe", "ППЭ"],
  ["deadlines", "Сроки проведения ГИА"],
  ["application-gia-11", "Образцы заявлений ГИА-11"],
  ["application-gia-9", "Образцы заявлений ГИА-9"],
  ["kege", "КЕГЭ-2026"],
  ["koge", "КОГЭ-2026"],
  ["speaking", "Говорение"],
  ["foreign-citizens", "Иностранным гражданам"],
  ["posters", "Информационные плакаты"],
  ["preparation", "Подготовка к ГИА"],
] as const;

const qualityPaths = [
  ["rsoko", "РСОКО"],
  ["rsoko/normativnye-dokumenty", "РСОКО · Нормативные документы"],
  [
    "rsoko/regionalnye-kontrolnye-raboty",
    "РСОКО · Региональные контрольные работы",
  ],
  ["rsoko/regionalnye-kontrolnye-raboty/demo", "РСОКО · Демоверсии"],
  ["rsoko/regionalnye-kontrolnye-raboty/sroki", "РСОКО · Сроки проведения"],
  ["rsoko/regionalnye-kontrolnye-raboty/results", "РСОКО · Результаты"],
  ["vpr", "ВПР"],
  ["vpr/normativnye-dokumenty", "ВПР · Нормативные документы"],
  ["vpr/demo", "ВПР · Демоверсии"],
  ["vpr/sroki", "ВПР · Сроки проведения"],
  ["vpr/results", "ВПР · Результаты"],
  ["niko", "НИКО"],
  ["niko/normativnye-dokumenty", "НИКО · Нормативные документы"],
  ["niko/demo", "НИКО · Демоверсии"],
  ["niko/sroki", "НИКО · Сроки проведения"],
  ["niko/results", "НИКО · Результаты"],
  ["proekt-500", "Проект 500+"],
  ["funkcionalnaya-gramotnost", "Функциональная грамотность"],
  ["iccs", "ICCS"],
  ["pirls", "PIRLS"],
  ["pisa", "PISA"],
  ["timss", "TIMSS"],
  ["ocenka-po-modeli-pisa", "Оценка по модели PISA"],
  ["mehanizmy-upravleniya", "Механизмы управления качеством образования"],
  ["issledovanie-kompetentsiy-uchiteley", "Исследование компетенций учителей"],
  [
    "issledovanie-kompetentsiy-uchiteley/normativnye-dokumenty",
    "Компетенции учителей · Нормативные документы",
  ],
  [
    "issledovanie-kompetentsiy-uchiteley/demo",
    "Компетенции учителей · Демоверсии",
  ],
  [
    "issledovanie-kompetentsiy-uchiteley/sroki",
    "Компетенции учителей · Сроки проведения",
  ],
  [
    "issledovanie-kompetentsiy-uchiteley/results",
    "Компетенции учителей · Результаты",
  ],
  ["vpr-spo", "ВПР СПО"],
  ["vpr-spo/normativnye-dokumenty", "ВПР СПО · Нормативные документы"],
] as const;

export const DOCUMENT_PLACEMENT_GROUPS: PlacementGroup[] = [
  { id: "gia-9", title: "ГИА-9", items: examItems("gia-9") },
  { id: "gia-11", title: "ГИА-11", items: examItems("gia-11") },
  {
    id: "gia",
    title: "Общий раздел ГИА",
    items: giaReference.map(([slug, title]) =>
      item(`gia.${slug}`, title, `/gia/${slug}`),
    ),
  },
  {
    id: "quality",
    title: "Качество образования",
    items: qualityPaths.map(([path, title]) =>
      item(
        `quality.${path.replaceAll("/", ".")}`,
        title,
        `/kachestvo-obrazovaniya/${path}`,
      ),
    ),
  },
  {
    id: "regional",
    title: "Региональный проект",
    items: [
      item(
        "regionalnyy-proekt.ege",
        "ЕГЭ: от выбора до зачисления",
        "/regionalnyy-proekt/ege",
        "ege",
      ),
      item(
        "regionalnyy-proekt.vuz",
        "Вузы Кузбасса",
        "/regionalnyy-proekt/vuz",
        "vuz",
      ),
      item(
        "regionalnyy-proekt.video",
        "Видеоматериалы вузов",
        "/regionalnyy-proekt/video",
        "video",
      ),
      item(
        "regionalnyy-proekt.documents",
        "Regionalnyy proekt documents",
        "/regionalnyy-proekt/documents",
      ),
      item(
        "regionalnyy-proekt",
        "Общие материалы проекта",
        "/regionalnyy-proekt/materialy",
      ),
    ],
  },
  {
    id: "about",
    title: "О центре",
    items: [
      item(
        "about.ob-uchrezhdenii",
        "Об учреждении",
        "/o-centre/ob-uchrezhdenii",
      ),
      item(
        "about.protivodeystvie-korruptsii",
        "Противодействие коррупции",
        "/o-centre/protivodeystvie-korruptsii",
      ),
      item("about.soveshchaniya", "Совещания", "/o-centre/soveshchaniya"),
      item("about.obuchenie", "Обучение", "/o-centre/obuchenie"),
    ],
  },
];

const allItems = () =>
  DOCUMENT_PLACEMENT_GROUPS.flatMap((group) => group.items);

export function placementTitle(key: string) {
  return allItems().find((item) => item.key === key)?.title ?? "Материалы и документы";
}

export function placementPageTitle(key: string) {
  return (
    DOCUMENT_PLACEMENT_GROUPS.find((group) =>
      group.items.some((item) => item.key === key),
    )?.title ?? "Материалы и документы"
  );
}

export function placementItem(key: string) {
  return allItems().find((item) => item.key === key);
}

export const DOCUMENT_GROUP_IDS = {
  GIA_9: "gia-9",
  GIA_11: "gia-11",
  GIA: "gia",
  QUALITY: "quality",
  REGIONAL: "regional",
  ABOUT: "about",
} as const;

export type DocumentsPageContext = {
  mode: "default" | "all" | "group" | "placement";
  title: string;
  eyebrow: string;
  helperText: string;
  emptyText: string;
  breadcrumbs: string[];
  queryPlacementKey: string;
  groupId?: string;
  placementKey?: string;
};

const DEFAULT_CONTEXT = {
  mode: "default" as const,
  title: "Материалы и документы",
  eyebrow: "Материалы и документы",
  helperText: "Выберите доступный раздел, чтобы открыть документы.",
  emptyText: "В доступных разделах пока нет документов.",
};

const GROUP_ALIASES: Record<string, string> = {
  GIA_9: "gia-9",
  GIA_11: "gia-11",
  GIA: "gia",
  QUALITY: "quality",
  REGIONAL: "regional",
  ABOUT: "about",
};

function normalizeGroup(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return GROUP_ALIASES[trimmed.toUpperCase()] ?? trimmed.toLowerCase();
}

function fallbackPlacement(allowedGroupIds: readonly string[], fallback?: string) {
  if (fallback) {
    const item = placementItem(fallback);
    const group = item && DOCUMENT_PLACEMENT_GROUPS.find((candidate) => candidate.items.some((entry) => entry.key === item.key));
    if (group && allowedGroupIds.includes(group.id)) return item.key;
  }
  return DOCUMENT_PLACEMENT_GROUPS.find((group) => allowedGroupIds.includes(group.id))?.items[0]?.key
    ?? DOCUMENT_PLACEMENT_GROUPS[0].items[0].key;
}

export function resolveDocumentPageContext(options: {
  scope?: string;
  group?: string;
  placement?: string;
  allowedGroupIds: readonly string[];
  canSeeAll: boolean;
}): DocumentsPageContext {
  const queryPlacementKey = fallbackPlacement(options.allowedGroupIds, options.placement);
  const normalizedGroup = normalizeGroup(options.group);
  const explicitAll = options.scope?.trim().toLowerCase() === "all" || normalizedGroup === "all";

  if (explicitAll && options.canSeeAll) {
    return {
      ...DEFAULT_CONTEXT,
      mode: "all",
      title: "Все материалы и документы",
      helperText: "Показаны документы из всех доступных разделов.",
      emptyText: "Документы пока не добавлены.",
      breadcrumbs: [DEFAULT_CONTEXT.eyebrow, "Все материалы и документы"],
      queryPlacementKey,
    };
  }

  if (normalizedGroup && DOCUMENT_PLACEMENT_GROUPS.some((group) => group.id === normalizedGroup)
      && options.allowedGroupIds.includes(normalizedGroup)) {
    const group = DOCUMENT_PLACEMENT_GROUPS.find((item) => item.id === normalizedGroup)!;
    return {
      ...DEFAULT_CONTEXT,
      mode: "group",
      title: `Документы ${group.title}`,
      helperText: `Документы группы «${group.title}».`,
      emptyText: `В группе «${group.title}» пока нет документов.`,
      breadcrumbs: [DEFAULT_CONTEXT.eyebrow, group.title],
      queryPlacementKey: group.items[0].key,
      groupId: group.id,
    };
  }

  const placement = options.placement ? placementItem(options.placement.trim()) : undefined;
  const placementGroup = placement && DOCUMENT_PLACEMENT_GROUPS.find((group) => group.items.some((item) => item.key === placement.key));
  if (placement && placementGroup && options.allowedGroupIds.includes(placementGroup.id)) {
    const title = placement.key === "quality.rsoko.regionalnye-kontrolnye-raboty"
      ? "Качество образования · Региональные исследования"
      : `${placementGroup.title} · ${placement.title}`;
    return {
      ...DEFAULT_CONTEXT,
      mode: "placement",
      title,
      helperText: `Документы раздела «${placement.title}».`,
      emptyText: `В разделе «${placement.title}» пока нет документов.`,
      breadcrumbs: [DEFAULT_CONTEXT.eyebrow, placementGroup.title, placement.title],
      queryPlacementKey: placement.key,
      groupId: placementGroup.id,
      placementKey: placement.key,
    };
  }

  return {
    ...DEFAULT_CONTEXT,
    breadcrumbs: [DEFAULT_CONTEXT.eyebrow],
    queryPlacementKey,
  };
}
