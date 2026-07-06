import { usefulResources } from "@/shared/config/navigation";

export type CardItem = {
  title: string;
  href: string;
  description: string;
  badge?: string;
};

export type HubPageData = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  cards: CardItem[];
};

export type ContentPageData = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  paragraphs: string[];
  sectionTitle: string;
  sectionHref: string;
  tabs: CardItem[];
  relatedTitle?: string;
  related?: CardItem[];
};

export type ExamSection = {
  id: string;
  title: string;
  description: string;
  oldUrl?: string;
};

export type ExamPageData = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  sections: ExamSection[];
};

export type ContactEntry = {
  label: string;
  value: string;
  href?: string;
};

type SlugPage = ContentPageData & { slug: string };

function toSlugPage(page: Omit<SlugPage, "slug">): SlugPage {
  return {
    ...page,
    slug: page.href.split("/").pop() ?? "",
  };
}

function withRelated(pages: SlugPage[], relatedTitle: string): SlugPage[] {
  return pages.map((page) => ({
    ...page,
    tabs: pages.map((item) => ({
      title: item.title,
      href: item.href,
      description: item.description,
    })),
    relatedTitle,
    related: pages
      .filter((item) => item.href !== page.href)
      .slice(0, 4)
      .map((item) => ({
        title: item.title,
        href: item.href,
        description: item.description,
      })),
  }));
}

export const homeDirections: CardItem[] = [
  {
    title: "ГИА-9",
    href: "/gia-9",
    description: "Нормативные документы, демоверсии, сроки проведения и материалы предметных комиссий.",
    badge: "Экзамены",
  },
  {
    title: "ГИА-11",
    href: "/gia-11",
    description: "Информация о ЕГЭ, итоговом сочинении, сроках проведения и результатах экзаменационной кампании.",
    badge: "Экзамены",
  },
  {
    title: "ВПР",
    href: "/kachestvo-obrazovaniya/vpr-spo",
    description: "Информация о сроках проведения ВПР, а также порядке ознакомления с результатами.",
    badge: "Экзамены",
  },
  {
    title: "Качество образования",
    href: "/kachestvo-obrazovaniya",
    description: "Региональные и федеральные оценочные процедуры, исследования и аналитические материалы.",
    badge: "Оценка",
  },
  {
    title: "Региональный проект",
    href: "/regionalnyy-proekt",
    description: "Материалы для школьников, родителей и абитуриентов по выбору образовательной траектории.",
    badge: "Проект",
  },
  {
    title: "О центре",
    href: "/o-centre",
    description: "Сведения об учреждении, контактная информация и материалы, связанные с деятельностью центра.",
    badge: "Учреждение",
  },
];

export const newsPreview = [
  {
    title: "Рассмотрение апелляций участников ЕГЭ по иностранным языкам",
    date: "02.07.2026",
    href: "/gia-11#results",
    text: "Опубликована актуальная информация для участников ЕГЭ по процедуре рассмотрения апелляций.",
  },
  {
    title: "Рассмотрение апелляций участников ЕГЭ по биологии, географии, информатике",
    date: "01.07.2026",
    href: "/gia-11#results",
    text: "Размещены сведения о сроках и порядке рассмотрения апелляций по отдельным предметам ЕГЭ.",
  },
  {
    title: "Рассмотрение апелляций участников ЕГЭ по обществознанию и физике",
    date: "25.06.2026",
    href: "/gia-11#results",
    text: "Уточнены даты и порядок подачи материалов по итогам экзаменов по обществознанию и физике.",
  },
];

export const services = [
  {
    title: "Результаты экзаменов",
    href: "https://results.ocmko.ru",
    description: "Сервис просмотра результатов государственной итоговой аттестации.",
  },
  {
    title: "Личный кабинет",
    href: "https://lk.ocmko.ru",
    description: "Доступ к персональным сервисам для участников и организаций.",
  },
  ...usefulResources.slice(0, 4),
];

export const regionalProjectHub: HubPageData = {
  title: "Региональный проект",
  eyebrow: "Материалы для школьников и родителей",
  href: "/regionalnyy-proekt",
  description: "Раздел содержит информацию для выбора образовательной траектории, поступления в вузы и знакомства с возможностями высшего образования в Кузбассе.",
  cards: [
    {
      title: "ЕГЭ: от выбора до зачисления",
      href: "/regionalnyy-proekt#ege",
      description: "Материалы о выборе предметов ЕГЭ, подаче документов и поступлении в образовательные организации.",
    },
    {
      title: "Вузы Кузбасса",
      href: "/regionalnyy-proekt#vuz",
      description: "Информация об образовательных организациях высшего образования Кемеровской области — Кузбасса.",
    },
    {
      title: "Видеоматериалы вузов",
      href: "/regionalnyy-proekt#video",
      description: "Подборка презентационных и информационных видеоматериалов образовательных организаций.",
    },
  ],
};

const qualityCards: CardItem[] = [
  {
    title: "РСОКО",
    href: "/kachestvo-obrazovaniya/rsoko",
    description: "Региональная система оценки качества образования Кемеровской области — Кузбасса.",
  },
  {
    title: "ВПР",
    href: "/kachestvo-obrazovaniya/vpr",
    description: "Всероссийские проверочные работы и материалы по их организации.",
  },
  {
    title: "НИКО",
    href: "/kachestvo-obrazovaniya/niko",
    description: "Национальные сопоставительные исследования качества образования.",
  },
  {
    title: "Проект 500+",
    href: "/kachestvo-obrazovaniya/proekt-500",
    description: "Материалы по адресной поддержке школ и повышению качества образовательных результатов.",
  },
  {
    title: "Функциональная грамотность",
    href: "/kachestvo-obrazovaniya/funkcionalnaya-gramotnost",
    description: "Материалы по оценке и развитию функциональной грамотности обучающихся.",
  },
  {
    title: "ICCS",
    href: "/kachestvo-obrazovaniya/iccs",
    description: "Международное исследование граждановедческого образования.",
  },
  {
    title: "PIRLS",
    href: "/kachestvo-obrazovaniya/pirls",
    description: "Международное исследование качества чтения и понимания текста.",
  },
  {
    title: "PISA",
    href: "/kachestvo-obrazovaniya/pisa",
    description: "Международная программа по оценке образовательных достижений обучающихся.",
  },
  {
    title: "TIMSS",
    href: "/kachestvo-obrazovaniya/timss",
    description: "Исследование качества математического и естественно-научного образования.",
  },
  {
    title: "Оценка по модели PISA",
    href: "/kachestvo-obrazovaniya/ocenka-po-modeli-pisa",
    description: "Материалы по использованию инструментария и подходов исследования PISA.",
  },
  {
    title: "Механизмы управления качеством образования",
    href: "/kachestvo-obrazovaniya/mehanizmy-upravleniya",
    description: "Подходы и инструменты управления качеством образования в регионе.",
  },
  {
    title: "Исследование компетенций учителей",
    href: "/kachestvo-obrazovaniya/kompetencii-uchiteley",
    description: "Материалы по оценке и анализу профессиональных компетенций педагогических работников.",
  },
  {
    title: "ВПР СПО",
    href: "/kachestvo-obrazovaniya/vpr-spo",
    description: "Материалы по всероссийским проверочным работам в системе среднего профессионального образования.",
  },
];

export const qualityHub: HubPageData = {
  title: "Качество образования",
  eyebrow: "Оценочные процедуры и исследования",
  href: "/kachestvo-obrazovaniya",
  description: "Раздел объединяет региональные и федеральные процедуры оценки качества образования, международные исследования и материалы по управлению качеством.",
  cards: qualityCards,
};

export const aboutHub: HubPageData = {
  title: "О центре",
  eyebrow: "ГКУ «КЦИАССО»",
  href: "/o-centre",
  description: "Сведения об учреждении, контактная информация, материалы совещаний, обучение и разделы, связанные с деятельностью центра.",
  cards: [
    {
      title: "Контакты",
      href: "/o-centre/kontakty",
      description: "Телефоны, электронная почта, адрес и режим работы.",
    },
    {
      title: "Об учреждении",
      href: "/o-centre/ob-uchrezhdenii",
      description: "Основные сведения о центре и направлениях его деятельности.",
    },
    {
      title: "Противодействие коррупции",
      href: "/o-centre/protivodeystvie-korruptsii",
      description: "Информационные материалы и нормативные сведения.",
    },
    {
      title: "Совещания",
      href: "/o-centre/soveshchaniya",
      description: "Материалы рабочих встреч, совещаний и обсуждений.",
    },
    {
      title: "Обучение",
      href: "/o-centre/obuchenie",
      description: "Информация об образовательных и методических мероприятиях.",
    },
  ],
};

const qualityPageDrafts: SlugPage[] = qualityCards.map((card) =>
  toSlugPage({
    title: card.title,
    eyebrow: "Качество образования",
    description: card.description,
    href: card.href,
    sectionTitle: qualityHub.title,
    sectionHref: qualityHub.href,
    tabs: [],
    paragraphs: [
      "В разделе собраны основные сведения, нормативные материалы и информационные ресурсы по выбранному направлению оценки качества образования.",
      "Здесь можно ознакомиться с действующими подходами, ключевыми документами и связанными материалами по теме.",
    ],
  }),
);

export const qualityPages = withRelated(qualityPageDrafts, "Другие направления");

const aboutPageDrafts: SlugPage[] = aboutHub.cards
  .filter((card) => card.href !== "/o-centre/kontakty")
  .map((card) =>
    toSlugPage({
      title: card.title,
      eyebrow: "О центре",
      description: card.description,
      href: card.href,
      sectionTitle: aboutHub.title,
      sectionHref: aboutHub.href,
      tabs: [],
      paragraphs: [
        "Раздел содержит информацию по выбранной теме и помогает быстро перейти к связанным материалам о деятельности центра.",
        "Здесь размещаются сведения, документы и справочные материалы, необходимые для работы с разделом.",
      ],
    }),
  );

export const aboutPages = withRelated(aboutPageDrafts, "Другие страницы раздела");

const commonExamSections: ExamSection[] = [
  {
    id: "docs",
    title: "Нормативные документы",
    description: "Приказы, положения и методические материалы по проведению государственной итоговой аттестации.",
  },
  {
    id: "demo",
    title: "Демоверсии",
    description: "Демонстрационные варианты, спецификации и кодификаторы экзаменационных материалов.",
  },
  {
    id: "dates",
    title: "Сроки проведения",
    description: "Расписание экзаменов, резервные дни и важные даты для участников государственной итоговой аттестации.",
  },
  {
    id: "results",
    title: "Результаты",
    description: "Информация о публикации результатов, сроках обработки экзаменационных работ и рассмотрении апелляций.",
  },
  {
    id: "reports",
    title: "Отчеты председателей предметных комиссий",
    description: "Аналитические материалы и отчеты председателей предметных комиссий по итогам экзаменационной кампании.",
  },
];

export const gia9Page: ExamPageData = {
  title: "ГИА-9",
  eyebrow: "Государственная итоговая аттестация",
  href: "/gia-9",
  description: "Информация для участников ГИА-9, родителей и образовательных организаций: документы, сроки проведения, демоверсии и результаты.",
  sections: commonExamSections,
};

export const gia11Page: ExamPageData = {
  title: "ГИА-11",
  eyebrow: "Государственная итоговая аттестация",
  href: "/gia-11",
  description: "Информация по ЕГЭ и ГИА-11: нормативные документы, сроки проведения, результаты, итоговое сочинение и аналитические материалы.",
  sections: [
    ...commonExamSections,
    {
      id: "essay",
      title: "Итоговое сочинение",
      description: "Материалы, порядок проведения и результаты итогового сочинения и изложения.",
    },
    {
      id: "analytics",
      title: "Аналитические материалы ЕГЭ",
      description: "Сводные аналитические материалы по результатам проведения единого государственного экзамена.",
    },
  ],
};

export const contacts = {
  legalForm: "Государственное казенное учреждение",
  fullName: "«Кузбасский центр информационно-аналитического сопровождения системы образования»",
  shortName: 'ГКУ "КЦИАССО"',
  phone: "8 (3842) 587025",
  email: "info@kcias.ru",
  address: "Кемеровская область — Кузбасс",
  worktime: "Пн — Пт, 8:30–17:30",
  giaHotline: "8 (3842) 587025",
  supportPhone: "8 (495) 198-92-38",
  trustPhone: "8 (495) 198-93-38",
};

export const primaryContacts: ContactEntry[] = [
  { label: '"Горячая" линия ГИА', value: contacts.giaHotline, href: "tel:+73842587025" },
  { label: "Телефон для справок", value: contacts.supportPhone, href: "tel:+74951989238" },
  { label: "Телефон доверия ЕГЭ", value: contacts.trustPhone, href: "tel:+74951989338" },
  { label: "Электронная почта", value: contacts.email, href: `mailto:${contacts.email}` },
];

export { usefulResources };
