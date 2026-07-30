"use client";

import {
  isKnownPublicSystemRendererKey,
  PUBLIC_SYSTEM_RENDERERS,
} from "./public-system-renderers";

interface PublicSystemSectionRendererProps {
  pageKey: string;
  systemRendererKey: string | null;
}

function UnknownSystemRenderer({
  pageKey,
  systemRendererKey,
}: PublicSystemSectionRendererProps) {
  const key = systemRendererKey ?? "";
  console.error("UNKNOWN_PUBLIC_SYSTEM_RENDERER", {
    pageKey,
    systemRendererKey: key,
  });

  return (
    <div role="status" data-unknown-system-renderer={key}>
      Раздел временно недоступен
    </div>
  );
}

export default function PublicSystemSectionRenderer({
  pageKey,
  systemRendererKey,
}: PublicSystemSectionRendererProps) {
  if (
    !systemRendererKey ||
    !isKnownPublicSystemRendererKey(systemRendererKey)
  ) {
    return (
      <UnknownSystemRenderer
        pageKey={pageKey}
        systemRendererKey={systemRendererKey}
      />
    );
  }

  const Renderer = PUBLIC_SYSTEM_RENDERERS[systemRendererKey];
  return <Renderer />;
}
