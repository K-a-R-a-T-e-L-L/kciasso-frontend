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
  return allItems().find((item) => item.key === key)?.title ?? key;
}

export function placementPageTitle(key: string) {
  return (
    DOCUMENT_PLACEMENT_GROUPS.find((group) =>
      group.items.some((item) => item.key === key),
    )?.title ?? key
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
