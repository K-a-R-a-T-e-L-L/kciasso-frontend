import { pagesControllerGlobals, pagesControllerLayout, pagesControllerRegistry } from "@/shared/api/generated/clients";
import type {
  GlobalHtmlSectionResponseDto,
  PageRegistrySummaryDto,
  PageSectionDescriptorDto,
  PagesControllerLayout200,
} from "@/shared/api/generated/types";
import { toAdminApiError } from "@/shared/admin/api-error";

export type AdminPageRegistryItem = {
  pageKey: string;
  title: string;
  routePattern: string;
  revision: number;
  totalSections: number;
  visibleSections: number;
  hiddenSections: number;
  pageCustomHtmlSections: number;
  globalCustomHtmlSections: number;
  isMaterialized: boolean;
};

export type AdminPageSection = {
  placementId: number;
  definitionId: number;
  type: PageSectionDescriptorDto["type"];
  key: string | null;
  name: string;
  description: string | null;
  systemRendererKey: string | null;
  sortOrder: number;
  isVisible: boolean;
  isGlobal: boolean;
  ownerPageKey: string | null;
  iframeHeight: number | null;
  canEditContent: boolean;
  canDelete: boolean;
  canToggle: boolean;
  canReorder: boolean;
  editHref: string | null;
  definitionRevision: number;
  html?: string;
  css?: string;
  javascript?: string;
};

export type AdminPageLayout = {
  pageKey: string;
  title: string;
  routePattern: string;
  revision: number;
  sections: AdminPageSection[];
};

export type AdminGlobalHtmlSection = {
  definitionId: number;
  key: string | null;
  name: string;
  revision: number;
  iframeHeight: number | null;
  visiblePlacements: number;
  hiddenPlacements: number;
  totalPlacements: number;
  html?: string;
  css?: string;
  javascript?: string;
};

function buildAdminConfig(token: string) {
  return {
    headers: { Authorization: `Bearer ${token}` },
    skipAuthRedirect: true,
  } as const;
}

function mapRegistryItem(item: PageRegistrySummaryDto): AdminPageRegistryItem {
  return { ...item };
}

function mapPageSection(section: PageSectionDescriptorDto): AdminPageSection {
  return { ...section };
}

export function mapAdminLayout(layout: PagesControllerLayout200): AdminPageLayout {
  return {
    pageKey: layout.pageKey,
    title: layout.title,
    routePattern: layout.routePattern,
    revision: layout.revision,
    sections: layout.sections.map(mapPageSection),
  };
}

function mapGlobalSection(section: GlobalHtmlSectionResponseDto): AdminGlobalHtmlSection {
  return { ...section };
}

export async function getAdminPageRegistry(token: string): Promise<AdminPageRegistryItem[]> {
  try {
    return (await pagesControllerRegistry(buildAdminConfig(token))).map(mapRegistryItem);
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function getAdminPageLayout(token: string, pageKey: string): Promise<AdminPageLayout> {
  try {
    return mapAdminLayout(await pagesControllerLayout(pageKey, buildAdminConfig(token)));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function getAdminGlobalSections(token: string): Promise<AdminGlobalHtmlSection[]> {
  try {
    return (await pagesControllerGlobals(buildAdminConfig(token))).map(mapGlobalSection);
  } catch (error) {
    throw toAdminApiError(error);
  }
}
