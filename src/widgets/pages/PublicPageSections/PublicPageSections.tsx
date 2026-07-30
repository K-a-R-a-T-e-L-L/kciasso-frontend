import type { PublicPageSectionViewModel } from "@/shared/api/adapters/page-layout.adapter";
import PublicCustomHtmlSection from "./PublicCustomHtmlSection";
import PublicSystemSectionRenderer from "./PublicSystemSectionRenderer";

interface PublicPageSectionsProps {
  pageKey: string;
  sections: PublicPageSectionViewModel[];
}

function unknownSectionType(type: never, pageKey: string) {
  const code = "UNKNOWN_PUBLIC_SECTION_TYPE";
  if (process.env.NODE_ENV !== "production") {
    throw new Error(`${code}:${pageKey}:${String(type)}`);
  }

  return (
    <div role="status" data-unknown-public-section-type={String(type)}>
      Раздел временно недоступен
    </div>
  );
}

export default function PublicPageSections({
  pageKey,
  sections,
}: PublicPageSectionsProps) {
  return (
    <>
      {sections.map((section, index) => {
        let content;
        switch (section.type) {
          case "PAGE_SYSTEM":
          case "GLOBAL_SYSTEM":
            content = (
              <PublicSystemSectionRenderer
                pageKey={pageKey}
                systemRendererKey={section.systemRendererKey}
              />
            );
            break;
          case "PAGE_CUSTOM_HTML":
          case "GLOBAL_CUSTOM_HTML":
            content = <PublicCustomHtmlSection section={section} />;
            break;
          default:
            content = unknownSectionType(section.type, pageKey);
        }

        return (
          <div
            key={`${section.key ?? section.systemRendererKey ?? section.type}-${section.sortOrder}-${index}`}
            data-testid="public-page-section"
            data-page-section
            data-page-key={pageKey}
            data-section-key={section.key ?? ""}
            data-system-renderer-key={section.systemRendererKey ?? ""}
            data-section-type={section.type}
            data-section-index={index}
          >
            {content}
          </div>
        );
      })}
    </>
  );
}
