export type NewsFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  publishMode: string;
  publishedAt: string;
  coverMode: "upload" | "url";
  externalUrl: string;
  removeCover: boolean;
};

export type NewsFormState = {
  error: string | null;
  values?: NewsFormValues;
};

export const newsFormInitialState: NewsFormState = {
  error: null,
};
