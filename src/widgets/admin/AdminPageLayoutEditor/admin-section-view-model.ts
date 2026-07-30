import type { AdminPageSection } from "@/shared/api/adapters/admin-page-layout.adapter";

export interface AdminSectionUiModel {
  kind: "PAGE_SYSTEM" | "GLOBAL_SYSTEM" | "PAGE_CUSTOM_HTML" | "GLOBAL_CUSTOM_HTML";
  badgeLabel: string;
  badgeColor: "blue" | "grape" | "teal" | "orange";
  friendlyTitle: string;
  friendlyDescription: string | null;
  immutableReason: string | null;
  settingsHref: string | null;
}

const rendererLabels: Record<string, string> = {
  "home.hero": "\u0413\u043b\u0430\u0432\u043d\u044b\u0439 \u0431\u0430\u043d\u043d\u0435\u0440",
  "home.carousel": "\u041a\u0430\u0440\u0443\u0441\u0435\u043b\u044c",
  "home.main-sections": "\u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u0440\u0430\u0437\u0434\u0435\u043b\u044b",
  "home.important-resources": "\u0412\u0430\u0436\u043d\u044b\u0435 \u0440\u0435\u0441\u0443\u0440\u0441\u044b",
  "home.gia": "\u0413\u0418\u0410",
  "home.official-resources": "\u041e\u0444\u0438\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0435 \u0440\u0435\u0441\u0443\u0440\u0441\u044b",
  "news.archive": "\u0410\u0440\u0445\u0438\u0432 \u043d\u043e\u0432\u043e\u0441\u0442\u0435\u0439",
  "news.article": "\u041d\u043e\u0432\u043e\u0441\u0442\u044c",
  "gia.root": "\u0413\u0418\u0410",
  "quality.root": "\u041a\u0430\u0447\u0435\u0441\u0442\u0432\u043e \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f",
  "quality.section": "\u0420\u0430\u0437\u0434\u0435\u043b \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0430 \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f",
  "regional-project.root": "\u0420\u0435\u0433\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442",
  "regional-project.section": "\u0420\u0430\u0437\u0434\u0435\u043b \u0440\u0435\u0433\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u043f\u0440\u043e\u0435\u043a\u0442\u0430",
  "about.root": "\u041e \u0446\u0435\u043d\u0442\u0440\u0435",
  "about.contacts": "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b",
  "resources.catalog": "\u0420\u0435\u0441\u0443\u0440\u0441\u044b",
  "global.contacts": "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b",
};

export function sectionUiModel(section: Pick<AdminPageSection, "type" | "name" | "description" | "systemRendererKey" | "key">): AdminSectionUiModel {
  const isContacts = section.key === "global.contacts" || section.systemRendererKey === "global.contacts";
  const friendlyTitle = isContacts ? rendererLabels["global.contacts"] : section.systemRendererKey ? rendererLabels[section.systemRendererKey] ?? "\u0421\u0438\u0441\u0442\u0435\u043c\u043d\u044b\u0439 \u0440\u0430\u0437\u0434\u0435\u043b" : section.name;
  if (section.type === "PAGE_SYSTEM") return { kind: section.type, badgeLabel: "\u0421\u0438\u0441\u0442\u0435\u043c\u043d\u0430\u044f", badgeColor: "blue", friendlyTitle, friendlyDescription: section.description ?? "\u0423\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435\u043c", immutableReason: "\u0421\u043e\u0434\u0435\u0440\u0436\u0438\u043c\u043e\u0435 \u0441\u0438\u0441\u0442\u0435\u043c\u043d\u043e\u0439 \u0441\u0435\u043a\u0446\u0438\u0438 \u043d\u0435\u043b\u044c\u0437\u044f \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c", settingsHref: null };
  if (section.type === "GLOBAL_SYSTEM") return { kind: section.type, badgeLabel: "\u0413\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u043d\u0430\u044f", badgeColor: "grape", friendlyTitle, friendlyDescription: section.description ?? "\u041e\u0431\u0449\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u043d\u0430\u044f \u0441\u0435\u043a\u0446\u0438\u044f", immutableReason: isContacts ? "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u0443\u044e\u0442\u0441\u044f \u0432 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430\u0445 \u0441\u0430\u0439\u0442\u0430" : "\u0421\u043e\u0434\u0435\u0440\u0436\u0438\u043c\u043e\u0435 \u043d\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u0432 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044e\u0449\u0435\u043c \u0440\u0430\u0437\u0434\u0435\u043b\u0435", settingsHref: isContacts ? "/admin/settings" : null };
  return section.type === "PAGE_CUSTOM_HTML" ? { kind: section.type, badgeLabel: "HTML \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b", badgeColor: "teal", friendlyTitle, friendlyDescription: section.description, immutableReason: null, settingsHref: null } : { kind: section.type, badgeLabel: "\u0413\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u0430\u044f HTML", badgeColor: "orange", friendlyTitle, friendlyDescription: section.description, immutableReason: null, settingsHref: null };
}
