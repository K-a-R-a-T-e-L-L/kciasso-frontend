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
    href: "/kachestvo-obrazovaniya/issledovanie-kompetentsiy-uchiteley",
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

const giaReferenceCards: CardItem[] = [
  {
    title: "Результаты экзаменов",
    href: "/gia/results",
    description: "Сервисы и порядок ознакомления с результатами государственной итоговой аттестации.",
    badge: "Важно",
  },
  {
    title: "Апелляции ЕГЭ",
    href: "/gia/ege-appeals",
    description: "Сроки и порядок подачи апелляций участников ЕГЭ о несогласии с выставленными баллами.",
    badge: "Важно",
  },
  {
    title: "Апелляции ОГЭ",
    href: "/gia/oge-appeals",
    description: "Информация о подаче и рассмотрении апелляций по результатам ОГЭ.",
    badge: "Важно",
  },
  {
    title: "Итоговое сочинение",
    href: "/gia/final-essay",
    description: "Сроки, порядок проведения и материалы по итоговому сочинению (изложению).",
    badge: "Важно",
  },
  {
    title: "Итоговое собеседование",
    href: "/gia/final-interview",
    description: "Материалы для участников и образовательных организаций по итоговому собеседованию.",
    badge: "Важно",
  },
  {
    title: "ППЭ",
    href: "/gia/ppe",
    description: "Информация о пунктах проведения экзаменов, правилах допуска и организации работы ППЭ.",
    badge: "Важно",
  },
  {
    title: "Сроки проведения ГИА",
    href: "/gia/deadlines",
    description: "Основные, резервные и дополнительные сроки проведения государственной итоговой аттестации.",
    badge: "Важно",
  },
  {
    title: "Образцы заявлений ГИА-11",
    href: "/gia/application-gia-11",
    description: "Формы и образцы заявлений для участников ГИА-11 и ЕГЭ.",
    badge: "Важно",
  },
  {
    title: "Образцы заявлений ГИА-9",
    href: "/gia/application-gia-9",
    description: "Формы и образцы заявлений для участников ГИА-9.",
    badge: "Важно",
  },
  {
    title: "КЕГЭ-2026",
    href: "/gia/kege",
    description: "Материалы по компьютерной форме ЕГЭ, инструкции и организационные сведения.",
  },
  {
    title: "КОГЭ-2026",
    href: "/gia/koge",
    description: "Справочные материалы по компьютерной форме ОГЭ и порядку ее проведения.",
  },
  {
    title: "Говорение",
    href: "/gia/speaking",
    description: "Информация по устной части экзаменов и процедурам проведения раздела «Говорение».",
  },
  {
    title: "Иностранным гражданам",
    href: "/gia/foreign-citizens",
    description: "Памятки и порядок участия в государственной итоговой аттестации для иностранных граждан.",
  },
  {
    title: "Информационные плакаты",
    href: "/gia/posters",
    description: "Наглядные материалы, памятки и плакаты для участников экзаменационной кампании.",
  },
  {
    title: "Подготовка к ГИА",
    href: "/gia/preparation",
    description: "Рекомендации по подготовке к экзаменам, полезные ссылки и справочные материалы.",
  },
  {
    title: "Личный кабинет",
    href: "https://lk.ocmko.ru/",
    description: "Доступ к персональным сервисам, уведомлениям и материалам для участников экзаменационной кампании.",
  },
];

export const giaReferenceHub: HubPageData = {
  title: "ГИА",
  eyebrow: "Государственная итоговая аттестация",
  href: "/gia",
  description:
    "Справочный раздел с важными сервисами, заявлениями, материалами по апелляциям, итоговому сочинению, итоговому собеседованию, ППЭ и срокам проведения ГИА.",
  cards: giaReferenceCards,
};

const giaReferencePageDrafts: SlugPage[] = giaReferenceCards.map((card) =>
  toSlugPage({
    title: card.title,
    eyebrow: "Государственная итоговая аттестация",
    description: card.description,
    href: card.href,
    sectionTitle: giaReferenceHub.title,
    sectionHref: giaReferenceHub.href,
    tabs: [],
    paragraphs: [
      `В разделе «${card.title}» размещаются основные сведения, ссылки на сервисы и материалы, необходимые участникам государственной итоговой аттестации, родителям и образовательным организациям.`,
      "Здесь можно быстро перейти к связанным материалам, уточнить порядок действий, сроки и требования к участникам экзаменационной кампании.",
    ],
  }),
);

export const giaReferencePages = withRelated(giaReferencePageDrafts, "Другие справочные страницы ГИА");

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
export type NewsCategoryId =
  | "appeals"
  | "gia-11"
  | "gia-9"
  | "quality"
  | "center";

export type NewsCategory = {
  id: NewsCategoryId;
  title: string;
  description: string;
};

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  dateLabel: string;
  category: NewsCategoryId;
  content: string[];
};

export const NEWS_PAGE_SIZE = 6;

export const newsCategories: NewsCategory[] = [
  {
    id: "appeals",
    title: "Апелляции",
    description: "Информация о сроках и порядке рассмотрения апелляций участников ГИА.",
  },
  {
    id: "gia-11",
    title: "ГИА-11",
    description: "Новости ЕГЭ, итогового сочинения и материалов для выпускников 11 классов.",
  },
  {
    id: "gia-9",
    title: "ГИА-9",
    description: "Оперативная информация для участников ОГЭ и образовательных организаций.",
  },
  {
    id: "quality",
    title: "Качество образования",
    description: "Публикации по исследованиям, мониторингу и оценочным процедурам.",
  },
  {
    id: "center",
    title: "О центре",
    description: "Новости учреждения, организационные сообщения и анонсы.",
  },
];

export const newsItems: NewsItem[] = [
  {
    slug: "rassmotrenie-apellyaciy-ege-inostrannye-yazyki-2026-07-07",
    title: "7 июля 2026 года состоится рассмотрение апелляций участников ЕГЭ по иностранным языкам",
    excerpt: "Апелляции будут рассматриваться в очном и дистанционном форматах с индивидуальным временем для каждого участника.",
    publishedAt: "2026-07-02",
    dateLabel: "02.07.2026",
    category: "appeals",
    content: [
      "7 июля 2026 года состоится рассмотрение апелляций участников ЕГЭ по иностранным языкам. Очный формат организован по адресу: г. Кемерово, проспект Кузнецкий, 26.",
      "Дополнительно предусмотрен дистанционный формат из удаленных пунктов рассмотрения апелляций. Участники будут проинформированы о времени рассмотрения индивидуально.",
      "За разъяснениями можно обращаться по телефону горячей линии ГИА 8 (3842) 58-70-25.",
    ],
  },
  {
    slug: "rassmotrenie-apellyaciy-ege-biologiya-geografiya-informatika-2026-07-03",
    title: "3 июля 2026 года состоится рассмотрение апелляций участников ЕГЭ по биологии, географии и информатике",
    excerpt: "Участникам доступен очный и дистанционный формат рассмотрения апелляций по результатам экзаменов.",
    publishedAt: "2026-07-01",
    dateLabel: "01.07.2026",
    category: "appeals",
    content: [
      "Рассмотрение апелляций по биологии, географии и информатике пройдет 3 июля 2026 года на базе ГКУ «Кузбасский центр информационно-аналитического сопровождения системы образования».",
      "Для участников из территорий региона сохранена возможность подключения из удаленных пунктов рассмотрения апелляций.",
    ],
  },
  {
    slug: "utverzhdeny-rezultaty-ege-po-russkomu-yazyku-2026",
    title: "В Кузбассе утверждены результаты ЕГЭ по русскому языку",
    excerpt: "Опубликованы результаты экзамена по русскому языку, а также сроки ознакомления и подачи апелляций.",
    publishedAt: "2026-06-28",
    dateLabel: "28.06.2026",
    category: "gia-11",
    content: [
      "Государственной экзаменационной комиссией Кемеровской области — Кузбасса утверждены результаты ЕГЭ по русскому языку.",
      "Участники могут ознакомиться с результатами через официальный сервис публикации результатов и в образовательных организациях.",
      "Информация о сроках подачи апелляций о несогласии с выставленными баллами размещается дополнительно.",
    ],
  },
  {
    slug: "rassmotrenie-apellyaciy-ege-obshchestvoznanie-fizika-2026-06-25",
    title: "25 июня 2026 года состоится рассмотрение апелляций участников ЕГЭ по обществознанию и физике",
    excerpt: "Сообщаем дату, место и порядок рассмотрения апелляций по результатам экзаменов по обществознанию и физике.",
    publishedAt: "2026-06-25",
    dateLabel: "25.06.2026",
    category: "appeals",
    content: [
      "Апелляции участников ЕГЭ по обществознанию и физике будут рассмотрены 25 июня 2026 года.",
      "Информация о времени участия доводится до апеллянтов персонально по контактным данным, указанным в заявлении.",
    ],
  },
  {
    slug: "opublikovany-demoversii-oge-2027",
    title: "Опубликованы демоверсии ОГЭ на 2027 год",
    excerpt: "В разделе ГИА-9 размещены демонстрационные варианты, спецификации и кодификаторы по учебным предметам.",
    publishedAt: "2026-06-20",
    dateLabel: "20.06.2026",
    category: "gia-9",
    content: [
      "В открытом доступе размещены демонстрационные варианты ОГЭ на 2027 год, а также спецификации и кодификаторы.",
      "Материалы предназначены для обучающихся, педагогов и родителей и могут использоваться для подготовки к экзаменам.",
    ],
  },
  {
    slug: "itogovoe-sochinenie-raspisanie-2026-2027",
    title: "Опубликовано расписание итогового сочинения (изложения) на 2026/27 учебный год",
    excerpt: "Определены основные и дополнительные сроки проведения итогового сочинения (изложения) для выпускников 11 классов.",
    publishedAt: "2026-06-18",
    dateLabel: "18.06.2026",
    category: "gia-11",
    content: [
      "Для выпускников 11 классов опубликованы основные и дополнительные сроки проведения итогового сочинения (изложения) в 2026/27 учебном году.",
      "Рекомендуем образовательным организациям заранее ознакомить участников с порядком допуска и требованиями к выполнению работы.",
    ],
  },
  {
    slug: "regionalnyy-monitoring-kachestva-obrazovaniya-2026",
    title: "В регионе стартует мониторинг качества образования по основным направлениям",
    excerpt: "Образовательные организации получат график проведения мониторинга и методические материалы для подготовки.",
    publishedAt: "2026-06-12",
    dateLabel: "12.06.2026",
    category: "quality",
    content: [
      "В Кемеровской области — Кузбассе стартует очередной этап регионального мониторинга качества образования.",
      "В адрес образовательных организаций направлены графики проведения процедур, инструкции по заполнению материалов и рекомендации по сопровождению участников.",
    ],
  },
  {
    slug: "seminar-dlya-rukovoditeley-shkol-po-vpr-spo-2026",
    title: "Проведен семинар для руководителей образовательных организаций по вопросам ВПР СПО",
    excerpt: "Специалисты центра представили порядок подготовки, организационные материалы и типовые ошибки в проведении процедур.",
    publishedAt: "2026-06-09",
    dateLabel: "09.06.2026",
    category: "quality",
    content: [
      "Сотрудники центра провели рабочий семинар по вопросам организации и сопровождения ВПР СПО.",
      "Особое внимание было уделено порядку взаимодействия с площадками проведения и проверке корректности загружаемых данных.",
    ],
  },
  {
    slug: "rezultaty-oge-po-russkomu-yazyku-2026",
    title: "Стали известны результаты ОГЭ по русскому языку",
    excerpt: "Определены сроки ознакомления с результатами экзамена и подачи апелляций о несогласии с выставленными баллами.",
    publishedAt: "2026-06-07",
    dateLabel: "07.06.2026",
    category: "gia-9",
    content: [
      "Государственной экзаменационной комиссией утверждены результаты ОГЭ по русскому языку.",
      "Участники могут ознакомиться с результатами через образовательные организации и региональные сервисы публикации результатов.",
    ],
  },
  {
    slug: "obnovlen-razdel-mehanizmy-upravleniya-kachestvom-2026",
    title: "Обновлен раздел по механизмам управления качеством образования",
    excerpt: "Добавлены аналитические материалы, методические документы и обновленные показатели региональной системы оценки качества образования.",
    publishedAt: "2026-06-03",
    dateLabel: "03.06.2026",
    category: "quality",
    content: [
      "В разделе, посвященном механизмам управления качеством образования, опубликованы обновленные аналитические материалы и документы.",
      "Материалы могут использоваться муниципальными и школьными командами для планирования управленческих решений и внутренней оценки качества.",
    ],
  },
  {
    slug: "grafik-raboty-centra-v-period-provedeniya-gia-2026",
    title: "Утвержден график работы центра в период проведения государственной итоговой аттестации",
    excerpt: "Опубликован режим работы специалистов центра, телефоны консультационной поддержки и порядок обработки обращений.",
    publishedAt: "2026-05-29",
    dateLabel: "29.05.2026",
    category: "center",
    content: [
      "В период проведения государственной итоговой аттестации центр работает в расширенном режиме для сопровождения участников, родителей и образовательных организаций.",
      "Контакты для оперативных консультаций размещены на странице «Контакты» и обновляются по мере необходимости.",
    ],
  },
  {
    slug: "metodicheskie-materialy-dlya-podgotovki-k-oge-2026",
    title: "Подготовлены методические материалы для обучающихся, готовящихся к ОГЭ",
    excerpt: "В разделе ГИА-9 размещены рекомендации по подготовке, навигации по материалам и использованию демоверсий.",
    publishedAt: "2026-05-24",
    dateLabel: "24.05.2026",
    category: "gia-9",
    content: [
      "Для обучающихся 9 классов и их родителей подготовлены методические материалы по навигации в разделе ГИА-9.",
      "Собраны рекомендации по использованию демоверсий, планированию подготовки и знакомству с порядком проведения экзаменов.",
    ],
  },
  {
    slug: "soveshchanie-po-organizacii-ekzamenacionnoy-kampanii-2026",
    title: "Проведено совещание по вопросам организации экзаменационной кампании",
    excerpt: "Участники обсудили организационные сроки, взаимодействие с муниципалитетами и сопровождение апелляционной кампании.",
    publishedAt: "2026-05-18",
    dateLabel: "18.05.2026",
    category: "center",
    content: [
      "В центре состоялось рабочее совещание по вопросам организации и сопровождения экзаменационной кампании.",
      "Отдельно рассмотрены вопросы взаимодействия с муниципальными координаторами, подготовки пунктов проведения экзаменов и информирования участников.",
    ],
  },
];

const newsCategoryMap = Object.fromEntries(newsCategories.map((item) => [item.id, item])) as Record<NewsCategoryId, NewsCategory>;

export function getNewsCategory(id: NewsCategoryId) {
  return newsCategoryMap[id];
}

export function getNewsBySlug(slug: string) {
  return newsItems.find((item) => item.slug === slug);
}

export function getRelatedNews(slug: string, limit = 3) {
  const current = getNewsBySlug(slug);
  if (!current) return [];

  const sameCategory = newsItems.filter((item) => item.slug !== slug && item.category === current.category);
  const other = newsItems.filter((item) => item.slug !== slug && item.category !== current.category);

  return [...sameCategory, ...other].slice(0, limit);
}

export function getNewsArchive(options?: { page?: number; category?: string }) {
  const selectedCategory = newsCategories.find((item) => item.id === options?.category)?.id;
  const filtered = selectedCategory ? newsItems.filter((item) => item.category === selectedCategory) : newsItems;
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / NEWS_PAGE_SIZE));
  const currentPage = Math.min(Math.max(options?.page ?? 1, 1), totalPages);
  const start = (currentPage - 1) * NEWS_PAGE_SIZE;
  const items = filtered.slice(start, start + NEWS_PAGE_SIZE);

  return {
    items,
    currentPage,
    totalPages,
    totalItems,
    selectedCategory: selectedCategory ?? null,
    categories: newsCategories,
  };
}

export const latestNewsPreview = newsItems.slice(0, 3).map((item) => ({
  title: item.title,
  date: item.dateLabel,
  href: `/news/${item.slug}`,
  text: item.excerpt,
}));
