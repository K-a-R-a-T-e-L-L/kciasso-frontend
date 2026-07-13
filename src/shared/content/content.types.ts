import type { DocumentGroup } from "@/shared/content/documents.types";

export type CardItem = {
  title: string;
  href: string;
  description: string;
  badge?: string;
  logoSrc?: string;
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
  documentGroups?: DocumentGroup[];
};

export type ExamSection = {
  id: string;
  title: string;
  description: string;
  oldUrl?: string;
  documentGroups?: DocumentGroup[];
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
  href: string;
};

export type SiteContacts = {
  giaHotline: ContactEntry;
  informationPhone: ContactEntry;
  egeTrustPhone: ContactEntry;
  email: ContactEntry;
};

export type NewsCategoryId = string;

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
  categoryTitle?: string;
  coverImageUrl?: string | null;
  content: string[];
};

export type NewsPreviewItem = {
  title: string;
  date: string;
  href: string;
  text: string;
  categoryTitle: string;
  coverImageUrl?: string | null;
};
