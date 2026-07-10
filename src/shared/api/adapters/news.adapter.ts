import { cache } from "react";
import {
  publicNewsControllerGetCategories,
  publicNewsControllerGetNews,
  publicNewsControllerGetNewsBySlug,
} from "@/shared/api/generated/clients";
import type {
  NewsArticleDto,
  NewsCategoryDto,
  NewsListItemDto,
  PublicNewsControllerGetNewsQueryParams,
} from "@/shared/api/generated/types";
import type { NewsCategory, NewsItem } from "@/shared/content/content.types";
import {
  getNewsArchive as getMockNewsArchive,
  getNewsBySlug as getMockNewsBySlug,
  getNewsCategory as getMockNewsCategory,
  getRelatedNews as getMockRelatedNews,
  latestNewsPreview,
} from "@/shared/content/news.mock";

type NewsArchiveParams = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
};

type NewsArchiveResult = {
  items: NewsItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  selectedCategory: string | null;
  categories: NewsCategory[];
};

type NewsPreviewItem = {
  title: string;
  date: string;
  href: string;
  text: string;
};

const DEFAULT_CATEGORY: NewsCategory = {
  id: "news",
  title: "Новости",
  description: "Новости и объявления учреждения.",
};

function isStatusError(error: unknown, status: number) {
  return typeof error === "object" && error !== null && "status" in error && error.status === status;
}

function shouldUseMockFallback(error: unknown) {
  if (isStatusError(error, 404)) {
    return false;
  }

  if (typeof error === "object" && error !== null && "status" in error) {
    return false;
  }

  return true;
}

function toDateLabel(value?: string | null) {
  if (!value) {
    return "Без даты";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Без даты";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function toParagraphs(content: string, excerpt: string) {
  const paragraphs = content
    .split(/\r?\n\s*\r?\n/g)
    .map((part) => part.trim())
    .filter(Boolean);

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  const fallback = content.trim() || excerpt.trim();
  return fallback ? [fallback] : [];
}

function mapCategory(dto?: NewsCategoryDto | null): NewsCategory {
  if (!dto) {
    return DEFAULT_CATEGORY;
  }

  return {
    id: dto.slug,
    title: dto.title,
    description: dto.description ?? DEFAULT_CATEGORY.description,
  };
}

function mapListItem(dto: NewsListItemDto): NewsItem {
  return {
    slug: dto.slug,
    title: dto.title,
    excerpt: dto.excerpt,
    publishedAt: dto.publishedAt ?? "",
    dateLabel: toDateLabel(dto.publishedAt),
    category: mapCategory(dto.category).id,
    content: [],
  };
}

function mapPreviewItem(dto: NewsListItemDto): NewsPreviewItem {
  return {
    title: dto.title,
    date: toDateLabel(dto.publishedAt),
    href: `/news/${dto.slug}`,
    text: dto.excerpt,
  };
}

function mapArticle(dto: NewsArticleDto): NewsItem {
  return {
    slug: dto.slug,
    title: dto.title,
    excerpt: dto.excerpt,
    publishedAt: dto.publishedAt ?? "",
    dateLabel: toDateLabel(dto.publishedAt),
    category: mapCategory(dto.category).id,
    content: toParagraphs(dto.content, dto.excerpt),
  };
}

const getCategoriesFromApi = cache(async () => {
  return publicNewsControllerGetCategories();
});

async function getBackendCategories() {
  const categories = await getCategoriesFromApi();
  return categories.map(mapCategory);
}

export async function getNewsArchive(params?: NewsArchiveParams): Promise<NewsArchiveResult> {
  const query: PublicNewsControllerGetNewsQueryParams = {
    page: params?.page,
    limit: params?.limit,
    category: params?.category,
    search: params?.search,
  };

  try {
    const [archive, categories] = await Promise.all([
      publicNewsControllerGetNews(query),
      getBackendCategories(),
    ]);

    const selectedCategory = categories.some((item) => item.id === params?.category)
      ? params?.category ?? null
      : null;

    return {
      items: archive.items.map(mapListItem),
      currentPage: archive.meta.page,
      totalPages: archive.meta.totalPages,
      totalItems: archive.meta.total,
      selectedCategory,
      categories,
    };
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    const fallback = getMockNewsArchive({
      page: params?.page,
      category: params?.category,
    });

    return fallback;
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    const item = await publicNewsControllerGetNewsBySlug(slug);
    return mapArticle(item);
  } catch (error) {
    if (isStatusError(error, 404)) {
      return null;
    }

    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    return getMockNewsBySlug(slug) ?? null;
  }
}

export async function getNewsCategory(id: string) {
  try {
    const categories = await getBackendCategories();
    return categories.find((item) => item.id === id) ?? getMockNewsCategory(id as never) ?? DEFAULT_CATEGORY;
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    return getMockNewsCategory(id as never) ?? DEFAULT_CATEGORY;
  }
}

export async function getRelatedNews(slug: string, limit = 3) {
  try {
    const current = await getNewsBySlug(slug);

    if (!current) {
      return [];
    }

    const primaryArchive = await getNewsArchive({
      page: 1,
      limit: limit + 1,
      category: current.category !== DEFAULT_CATEGORY.id ? current.category : undefined,
    });

    const related = primaryArchive.items.filter((item) => item.slug !== slug);

    if (related.length >= limit) {
      return related.slice(0, limit);
    }

    const latestArchive = await getNewsArchive({
      page: 1,
      limit: limit + 3,
    });

    const seen = new Set([slug, ...related.map((item) => item.slug)]);
    const merged = [...related];

    latestArchive.items.forEach((item) => {
      if (!seen.has(item.slug) && merged.length < limit) {
        seen.add(item.slug);
        merged.push(item);
      }
    });

    return merged.slice(0, limit);
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    return getMockRelatedNews(slug, limit);
  }
}

export async function getLatestNewsPreview() {
  try {
    const archive = await publicNewsControllerGetNews({
      page: 1,
      limit: latestNewsPreview.length || 3,
    });

    return archive.items.map(mapPreviewItem);
  } catch (error) {
    if (!shouldUseMockFallback(error)) {
      throw error;
    }

    return latestNewsPreview;
  }
}
