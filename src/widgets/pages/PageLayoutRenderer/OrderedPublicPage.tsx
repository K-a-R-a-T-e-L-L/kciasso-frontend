import { getPublicPageLayout } from "@/shared/api/adapters/page-layout.adapter";
import { getPublicSiteSettings } from "@/shared/api/adapters/site-settings.adapter";
import type { PublicSystemSectionNodes } from "@/widgets/pages/PublicPageSections/public-system-renderers";
import PublicContactsBoundary from "@/widgets/sections/UniversalContactsSection/PublicContactsBoundary.client";
import PageLayoutRenderer from "./PageLayoutRenderer";

export const FRONTEND_PAGE_KEYS = [
  "home",
  "news.archive",
  "news.article",
  "gia",
  "gia.9",
  "gia.11",
  "quality",
  "quality.section",
  "regional-project",
  "regional-project.section",
  "about",
  "about.contacts",
  "resources",
] as const;

interface OrderedPublicPageProps {
  pageKey: string;
  systemSections: PublicSystemSectionNodes;
}

export default async function OrderedPublicPage({
  pageKey,
  systemSections,
}: OrderedPublicPageProps) {
  const [layout, contacts] = await Promise.all([
    getPublicPageLayout(pageKey),
    getPublicSiteSettings(),
  ]);

  if (!layout) {
    throw new Error(`PUBLIC_PAGE_LAYOUT_NOT_FOUND:${pageKey}`);
  }

  return (
    <PageLayoutRenderer
      layout={layout}
      systemSections={{
        ...systemSections,
        "global.contacts": <PublicContactsBoundary contacts={contacts} />,
      }}
    />
  );
}

export function assertFrontendPageRegistryParity(
  backendKeys: readonly string[],
) {
  return (
    backendKeys.length === FRONTEND_PAGE_KEYS.length &&
    backendKeys.every(
      (key, index) => key === FRONTEND_PAGE_KEYS[index],
    ) &&
    new Set(FRONTEND_PAGE_KEYS).size === FRONTEND_PAGE_KEYS.length
  );
}
