import type { PublicPageSectionViewModel } from "@/shared/api/adapters/page-layout.adapter";

const DEFAULT_IFRAME_HEIGHT = 320;

function escapeRawTextEndTag(value: string, tag: "script" | "style") {
  return value.replace(
    new RegExp(`</${tag}`, "gi"),
    `<\\/${tag}`,
  );
}

export function buildPublicCustomHtmlSrcDoc(
  section: PublicPageSectionViewModel,
) {
  const css = escapeRawTextEndTag(section.css ?? "", "style");
  const javascript = escapeRawTextEndTag(
    section.javascript ?? "",
    "script",
  );

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>html,body{margin:0;padding:0;}</style>
<style>${css}</style>
</head>
<body>
${section.html ?? ""}
<script>${javascript}</script>
</body>
</html>`;
}

export default function PublicCustomHtmlSection({
  section,
}: {
  section: PublicPageSectionViewModel;
}) {
  const height = Math.min(
    4000,
    Math.max(120, section.iframeHeight ?? DEFAULT_IFRAME_HEIGHT),
  );

  return (
    <iframe
      title={section.name}
      srcDoc={buildPublicCustomHtmlSrcDoc(section)}
      sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"
      referrerPolicy="no-referrer"
      width="100%"
      height={height}
      style={{ border: 0 }}
    />
  );
}
