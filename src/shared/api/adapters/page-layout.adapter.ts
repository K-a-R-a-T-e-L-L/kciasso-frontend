import type { PublicPageLayoutResponseDto } from "@/shared/api/generated/types";

export type PublicPageSectionType =
  | "PAGE_SYSTEM"
  | "GLOBAL_SYSTEM"
  | "PAGE_CUSTOM_HTML"
  | "GLOBAL_CUSTOM_HTML";

export interface PublicPageSectionViewModel {
  type: PublicPageSectionType;
  key: string | null;
  name: string;
  systemRendererKey: string | null;
  html: string | null;
  css: string | null;
  javascript: string | null;
  iframeHeight: number | null;
  isGlobal: boolean;
  sortOrder: number;
}

export interface PublicPageLayoutViewModel {
  pageKey: string;
  sections: PublicPageSectionViewModel[];
}

const backendUrl =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

export function mapPublicPageLayout(
  dto: PublicPageLayoutResponseDto,
): PublicPageLayoutViewModel {
  return {
    pageKey: dto.pageKey,
    sections: dto.sections.map((section) => ({
      type: section.type,
      key: section.key,
      name: section.name,
      systemRendererKey: section.systemRendererKey,
      html: section.html,
      css: section.css,
      javascript: section.javascript,
      iframeHeight: section.iframeHeight,
      isGlobal: section.isGlobal,
      sortOrder: section.sortOrder,
    })),
  };
}

export async function getPublicPageLayout(
  pageKey: string,
): Promise<PublicPageLayoutViewModel | null> {
  const response = await fetch(
    `${backendUrl}/api/public/pages/${encodeURIComponent(pageKey)}/layout`,
    { cache: "no-store" },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Page layout request failed: ${response.status}`);
  }

  const dto = (await response.json()) as PublicPageLayoutResponseDto;
  return mapPublicPageLayout(dto);
}
