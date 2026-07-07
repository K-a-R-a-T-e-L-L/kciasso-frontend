import { usefulResources as navigationUsefulResources } from "@/shared/config/navigation";

export const usefulResources = navigationUsefulResources;

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
