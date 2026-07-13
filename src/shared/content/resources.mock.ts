import { usefulResources as navigationUsefulResources } from "@/shared/config/navigation";
import { MEDIA } from "@/shared/lib/media";

export const usefulResources = navigationUsefulResources;

export const officialResourceCards = [
  {
    title: "МОиН Кузбасса",
    href: "https://xn--42-6kcadhwnl3cfdx.xn--p1ai/",
    description: "Региональный орган управления образованием Кемеровской области — Кузбасса.",
    logoSrc: MEDIA.images.mok,
  },
  {
    title: "Минпросвещения России",
    href: "https://edu.gov.ru/",
    description: "Официальный портал федерального министерства с документами, новостями и нормативной базой.",
    logoSrc: MEDIA.images.mprf,
  },
  {
    title: "Рособрнадзор",
    href: "https://obrnadzor.gov.ru/",
    description: "Федеральный надзор и официальные материалы по ГИА, контролю и оценочным процедурам.",
    logoSrc: MEDIA.images.fspnvsok,
  },
  {
    title: "ФИПИ",
    href: "https://fipi.ru/",
    description: "Демоверсии, кодификаторы, спецификации и методические материалы для подготовки.",
    logoSrc: MEDIA.images.fipi,
  },
  {
    title: "ФЦТ",
    href: "https://rustest.ru/",
    description: "Федеральный центр тестирования и сервисы, связанные с экзаменационной кампанией.",
    logoSrc: MEDIA.images.fct,
  },
  {
    title: "РЦОИ России",
    href: "https://rcoi.ru/",
    description: "Справочная и организационная информация региональных центров обработки информации.",
    logoSrc: MEDIA.images.fioko,
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
