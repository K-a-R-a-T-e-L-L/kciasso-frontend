import type { HubPageData } from "@/shared/content/content.types";

export const aboutHub: HubPageData = {
  title: "О центре",
  eyebrow: 'ГКУ "КЦИАССО"',
  href: "/o-centre",
  description:
    "Сведения об учреждении, контактная информация, материалы совещаний, обучение и разделы, связанные с деятельностью центра.",
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
