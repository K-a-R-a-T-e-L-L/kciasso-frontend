"use client";

import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
} from "react";

export const KNOWN_PUBLIC_SYSTEM_RENDERER_KEYS = [
  "home.hero",
  "home.carousel",
  "home.main-sections",
  "home.important-resources",
  "home.gia",
  "home.official-resources",
  "news.archive",
  "news.article",
  "gia.root",
  "gia-9.hero",
  "gia-9.normative-documents",
  "gia-9.demo",
  "gia-9.deadlines",
  "gia-9.results",
  "gia-9.reports",
  "gia-11.hero",
  "gia-11.normative-documents",
  "gia-11.demo",
  "gia-11.deadlines",
  "gia-11.results",
  "gia-11.reports",
  "gia-11.essay",
  "gia-11.analytics",
  "quality.root",
  "quality.section",
  "regional-project.root",
  "regional-project.section",
  "about.root",
  "about.contacts",
  "resources.catalog",
  "global.contacts",
] as const;

export type KnownPublicSystemRendererKey =
  (typeof KNOWN_PUBLIC_SYSTEM_RENDERER_KEYS)[number];

export type PublicSystemSectionNodes = Partial<
  Record<KnownPublicSystemRendererKey, ReactNode>
>;

const PublicSystemSectionsContext =
  createContext<PublicSystemSectionNodes>({});

export function PublicSystemSectionsProvider({
  sections,
  children,
}: {
  sections: PublicSystemSectionNodes;
  children: ReactNode;
}) {
  return createElement(
    PublicSystemSectionsContext,
    { value: sections },
    children,
  );
}

function createSystemRenderer(rendererKey: KnownPublicSystemRendererKey) {
  function PublicRegisteredSystemSection() {
    const sections = useContext(PublicSystemSectionsContext);
    if (!Object.hasOwn(sections, rendererKey)) {
      console.error("MISSING_PUBLIC_SYSTEM_RENDERER_CONTENT", {
        systemRendererKey: rendererKey,
      });
      return createElement(
        "div",
        {
          role: "status",
          "data-unknown-system-renderer": rendererKey,
        },
        "Раздел временно недоступен",
      );
    }
    return sections[rendererKey];
  }

  PublicRegisteredSystemSection.displayName = `PublicSystemSection(${rendererKey})`;
  return PublicRegisteredSystemSection;
}

export const PUBLIC_SYSTEM_RENDERERS = Object.fromEntries(
  KNOWN_PUBLIC_SYSTEM_RENDERER_KEYS.map((key) => [
    key,
    createSystemRenderer(key),
  ]),
) as Record<KnownPublicSystemRendererKey, ReturnType<typeof createSystemRenderer>>;

export function isKnownPublicSystemRendererKey(
  value: string,
): value is KnownPublicSystemRendererKey {
  return Object.hasOwn(PUBLIC_SYSTEM_RENDERERS, value);
}
