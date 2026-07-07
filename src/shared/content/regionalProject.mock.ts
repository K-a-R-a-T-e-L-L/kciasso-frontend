import type { HubPageData } from "@/shared/content/content.types";

export const regionalProjectHub: HubPageData = {
  title: "Региональный проект",
  eyebrow: "Материалы для школьников и родителей",
  href: "/regionalnyy-proekt",
  description:
    "Раздел содержит информацию для выбора образовательной траектории, поступления в вузы и знакомства с возможностями высшего образования в Кузбассе.",
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
