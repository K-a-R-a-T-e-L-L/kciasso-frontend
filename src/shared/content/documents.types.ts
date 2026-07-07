export type DocumentFile = {
  id: string;
  title: string;
  description?: string;
  url: string;
  extension: string;
  mimeType: string;
  sizeBytes?: number;
  publishedAt?: string;
  category?: string;
  isExternal?: boolean;
};

export type DocumentGroup = {
  id: string;
  title: string;
  description?: string;
  items: DocumentFile[];
};
