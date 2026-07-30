import type { PublicPageLayoutViewModel } from "@/shared/api/adapters/page-layout.adapter";
import PublicPageSections from "@/widgets/pages/PublicPageSections/PublicPageSections";
import {
  PublicSystemSectionsProvider,
  type PublicSystemSectionNodes,
} from "@/widgets/pages/PublicPageSections/public-system-renderers";

interface PageLayoutRendererProps {
  layout: PublicPageLayoutViewModel;
  systemSections: PublicSystemSectionNodes;
}

export default function PageLayoutRenderer({
  layout,
  systemSections,
}: PageLayoutRendererProps) {
  return (
    <PublicSystemSectionsProvider sections={systemSections}>
      <PublicPageSections
        pageKey={layout.pageKey}
        sections={layout.sections}
      />
    </PublicSystemSectionsProvider>
  );
}
