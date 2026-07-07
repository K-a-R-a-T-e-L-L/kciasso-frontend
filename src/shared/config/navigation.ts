export type NavLink = {
  title: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  title: string;
  items: NavLink[];
};

export type NavItem = NavLink & {
  kind?: "simple" | "dropdown" | "mega";
  groups?: NavGroup[];
  items?: NavLink[];
};

export const topLinks: NavLink[] = [
  { title: "МОК", href: "https://xn--42-6kcadhwnl3cfdx.xn--p1ai/" },
  { title: "Минпросвещения", href: "https://edu.gov.ru/" },
  { title: "Рособрнадзор", href: "http://www.obrnadzor.gov.ru/" },
  { title: "ФИПИ", href: "http://fipi.ru/" },
  { title: "ФЦТ", href: "http://www.rustest.ru/" },
];

export const navigation: NavItem[] = [
  {
    title: "Главная",
    href: "/",
    kind: "dropdown",
    items: [
      {
        title: "Основные разделы",
        href: "#quick-access",
      },
      { title: "Важные ресурсы", href: "#important-resources" },
      { title: "Актуальная информация", href: "#current-information" },
      { title: "Контакты", href: "#contacts" },
    ],
  },
  {
    title: "Региональный проект",
    href: "/regionalnyy-proekt",
    kind: "dropdown",
    items: [
      {
        title: "ЕГЭ: от выбора до зачисления",
        href: "/regionalnyy-proekt#ege",
      },
      { title: "Вузы Кузбасса", href: "/regionalnyy-proekt#vuz" },
      { title: "Видеоматериалы вузов", href: "/regionalnyy-proekt#video" },
    ],
  },
  {
    title: "Качество образования",
    href: "/kachestvo-obrazovaniya",
    kind: "mega",
    groups: [
      {
        title: "Основные направления",
        items: [
          { title: "РСОКО", href: "/kachestvo-obrazovaniya/rsoko" },
          { title: "ВПР", href: "/kachestvo-obrazovaniya/vpr" },
          { title: "НИКО", href: "/kachestvo-obrazovaniya/niko" },
          { title: "Проект 500+", href: "/kachestvo-obrazovaniya/proekt-500" },
          {
            title: "Функциональная грамотность",
            href: "/kachestvo-obrazovaniya/funkcionalnaya-gramotnost",
          },
        ],
      },
      {
        title: "Международные исследования",
        items: [
          { title: "ICCS", href: "/kachestvo-obrazovaniya/iccs" },
          { title: "PIRLS", href: "/kachestvo-obrazovaniya/pirls" },
          { title: "PISA", href: "/kachestvo-obrazovaniya/pisa" },
          { title: "TIMSS", href: "/kachestvo-obrazovaniya/timss" },
          {
            title: "Оценка по модели PISA",
            href: "/kachestvo-obrazovaniya/ocenka-po-modeli-pisa",
          },
        ],
      },
      {
        title: "Дополнительно",
        items: [
          {
            title: "Механизмы управления качеством",
            href: "/kachestvo-obrazovaniya/mehanizmy-upravleniya",
          },
          {
            title: "Компетенции учителей",
            href: "/kachestvo-obrazovaniya/issledovanie-kompetentsiy-uchiteley",
          },
          { title: "ВПР СПО", href: "/kachestvo-obrazovaniya/vpr-spo" },
        ],
      },
    ],
  },
  {
    title: "ГИА-9",
    href: "/gia-9",
    kind: "dropdown",
    items: [
      { title: "Нормативные документы", href: "/gia-9?section=normative-documents" },
      { title: "Демоверсии", href: "/gia-9?section=demo" },
      { title: "Сроки проведения", href: "/gia-9?section=deadlines" },
      { title: "Результаты", href: "/gia-9?section=results" },
      { title: "Отчеты комиссий", href: "/gia-9?section=reports" },
    ],
  },
  {
    title: "ГИА-11",
    href: "/gia-11",
    kind: "dropdown",
    items: [
      { title: "Нормативные документы", href: "/gia-11?section=normative-documents" },
      { title: "Демоверсии", href: "/gia-11?section=demo" },
      { title: "Сроки проведения", href: "/gia-11?section=deadlines" },
      { title: "Результаты", href: "/gia-11?section=results" },
      { title: "Отчеты комиссий", href: "/gia-11?section=reports" },
      { title: "Итоговое сочинение", href: "/gia-11?section=essay" },
      { title: "Аналитические материалы ЕГЭ", href: "/gia-11?section=analytics" },
    ],
  },
  {
    title: "О центре",
    href: "/o-centre",
    kind: "dropdown",
    items: [
      { title: "Контакты", href: "/o-centre/kontakty" },
      { title: "Об учреждении", href: "/o-centre/ob-uchrezhdenii" },
      {
        title: "Противодействие коррупции",
        href: "/o-centre/protivodeystvie-korruptsii",
      },
      { title: "Совещания", href: "/o-centre/soveshchaniya" },
      { title: "Обучение", href: "/o-centre/obuchenie" },
    ],
  },
];

export const usefulResources: NavLink[] = [
  {
    title: "РЦОИ России",
    href: "https://rcoi.ru",
    description: "Региональные центры обработки информации",
  },
  {
    title: "ФИПИ",
    href: "https://fipi.ru",
    description: "Федеральный институт педагогических измерений",
  },
  {
    title: "Рособрнадзор",
    href: "https://obrnadzor.gov.ru",
    description: "Федеральная служба по надзору в сфере образования и науки",
  },
  {
    title: "Минпросвещения",
    href: "https://edu.gov.ru",
    description: "Министерство просвещения Российской Федерации",
  },
  {
    title: "ФЦТ",
    href: "https://rustest.ru",
    description: "Федеральный центр тестирования",
  },
  {
    title: "Вузы Кузбасса",
    href: "/regionalnyy-proekt#vuz",
    description: "Список образовательных организаций региона",
  },
];
