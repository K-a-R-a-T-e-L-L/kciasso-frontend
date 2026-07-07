import type { ContactEntry } from "@/shared/content/content.types";

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
