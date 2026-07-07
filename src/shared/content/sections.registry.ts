export type ContentKind =
  | "news"
  | "page"
  | "documents"
  | "links"
  | "contacts"
  | "media"
  | "mixed";

export type EditableSection = {
  id: string;
  title: string;
  route: string;
  kind: ContentKind;
  parentId?: string;
  order?: number;
  isEditable: boolean;
};

export const editableSections: EditableSection[] = [
  { id: "home.hero", title: "Hero главной страницы", route: "/", kind: "mixed", order: 1, isEditable: true },
  { id: "home.quick-access", title: "Основные разделы", route: "/", kind: "links", parentId: "home.hero", order: 2, isEditable: true },
  { id: "home.resources", title: "Важные ресурсы", route: "/", kind: "links", parentId: "home.hero", order: 3, isEditable: true },
  { id: "home.news-preview", title: "Превью новостей", route: "/", kind: "news", parentId: "home.hero", order: 4, isEditable: true },
  { id: "home.contacts", title: "Контакты на главной", route: "/", kind: "contacts", parentId: "home.hero", order: 5, isEditable: true },

  { id: "news", title: "Архив новостей", route: "/news", kind: "news", order: 10, isEditable: true },
  { id: "news.article", title: "Страница новости", route: "/news/[slug]", kind: "news", parentId: "news", order: 11, isEditable: true },

  { id: "gia", title: "Справочный раздел ГИА", route: "/gia", kind: "mixed", order: 20, isEditable: true },
  { id: "gia-9", title: "ГИА-9", route: "/gia-9", kind: "mixed", order: 21, isEditable: true },
  { id: "gia-9.normative-documents", title: "ГИА-9: нормативные документы", route: "/gia-9", kind: "documents", parentId: "gia-9", order: 22, isEditable: true },
  { id: "gia-9.demo", title: "ГИА-9: демоверсии", route: "/gia-9", kind: "documents", parentId: "gia-9", order: 23, isEditable: true },
  { id: "gia-9.deadlines", title: "ГИА-9: сроки проведения", route: "/gia-9", kind: "documents", parentId: "gia-9", order: 24, isEditable: true },
  { id: "gia-9.results", title: "ГИА-9: результаты", route: "/gia-9", kind: "links", parentId: "gia-9", order: 25, isEditable: true },
  { id: "gia-9.reports", title: "ГИА-9: отчеты комиссий", route: "/gia-9", kind: "documents", parentId: "gia-9", order: 26, isEditable: true },
  { id: "gia-11", title: "ГИА-11", route: "/gia-11", kind: "mixed", order: 27, isEditable: true },
  { id: "gia-11.normative-documents", title: "ГИА-11: нормативные документы", route: "/gia-11", kind: "documents", parentId: "gia-11", order: 28, isEditable: true },
  { id: "gia-11.demo", title: "ГИА-11: демоверсии", route: "/gia-11", kind: "documents", parentId: "gia-11", order: 29, isEditable: true },
  { id: "gia-11.deadlines", title: "ГИА-11: сроки проведения", route: "/gia-11", kind: "documents", parentId: "gia-11", order: 30, isEditable: true },
  { id: "gia-11.results", title: "ГИА-11: результаты", route: "/gia-11", kind: "links", parentId: "gia-11", order: 31, isEditable: true },
  { id: "gia-11.reports", title: "ГИА-11: отчеты комиссий", route: "/gia-11", kind: "documents", parentId: "gia-11", order: 32, isEditable: true },
  { id: "gia-11.essay", title: "ГИА-11: итоговое сочинение", route: "/gia-11", kind: "documents", parentId: "gia-11", order: 33, isEditable: true },
  { id: "gia-11.analytics", title: "ГИА-11: аналитические материалы ЕГЭ", route: "/gia-11", kind: "documents", parentId: "gia-11", order: 34, isEditable: true },

  { id: "regional-project.ege", title: "Региональный проект: ЕГЭ", route: "/regionalnyy-proekt", kind: "page", order: 40, isEditable: true },
  { id: "regional-project.vuz", title: "Региональный проект: вузы Кузбасса", route: "/regionalnyy-proekt", kind: "links", order: 41, isEditable: true },
  { id: "regional-project.video", title: "Региональный проект: видеоматериалы вузов", route: "/regionalnyy-proekt", kind: "media", order: 42, isEditable: true },

  { id: "kachestvo.root", title: "Качество образования", route: "/kachestvo-obrazovaniya", kind: "mixed", order: 50, isEditable: true },
  { id: "about.contacts", title: "Контакты центра", route: "/o-centre/kontakty", kind: "contacts", order: 60, isEditable: true },
  { id: "resources.catalog", title: "Каталог ресурсов", route: "/resources", kind: "links", order: 70, isEditable: true },
];

const editableSectionsMap = new Map(editableSections.map((section) => [section.id, section]));

export function getEditableSectionById(id: string) {
  return editableSectionsMap.get(id);
}
