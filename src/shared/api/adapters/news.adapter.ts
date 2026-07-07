import {
  getNewsArchive as getMockNewsArchive,
  getNewsBySlug as getMockNewsBySlug,
  getNewsCategory as getMockNewsCategory,
  getRelatedNews as getMockRelatedNews,
  latestNewsPreview,
} from "@/shared/content/news.mock";

export async function getNewsArchive(params?: { page?: number; category?: string }) {
  return getMockNewsArchive(params);
}

export async function getNewsBySlug(slug: string) {
  return getMockNewsBySlug(slug);
}

export async function getNewsCategory(id: Parameters<typeof getMockNewsCategory>[0]) {
  return getMockNewsCategory(id);
}

export async function getRelatedNews(slug: string, limit = 3) {
  return getMockRelatedNews(slug, limit);
}

export async function getLatestNewsPreview() {
  return latestNewsPreview;
}
