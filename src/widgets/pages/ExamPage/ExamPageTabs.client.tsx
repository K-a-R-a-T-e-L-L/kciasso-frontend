"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import ButtonTabsNav from "@/shared/ui/TabsNav/ButtonTabsNav.client";
import type { ExamPageData } from "@/shared/content/content.types";
import type { PublicDocumentsResult } from "@/shared/api/adapters/public-documents.adapter";
import PublicDocumentsBlock from "@/shared/ui/PublicDocumentsBlock/PublicDocumentsBlock";
import cls from "./ExamPage.module.scss";

function getDefaultSectionId(page: ExamPageData) {
  return page.sections[0]?.id ?? "";
}

function getSectionIdFromHash(page: ExamPageData) {
  const hash = window.location.hash.replace("#", "");
  const exists = page.sections.some((section) => section.id === hash);
  return exists ? hash : "";
}

function getSectionIdFromQuery(page: ExamPageData, value: string | null) {
  if (!value) return "";

  const queryAliases: Record<string, string> = {
    "normative-documents": "docs",
    demo: "demo",
    deadlines: "dates",
    results: "results",
    reports: "reports",
    essay: "essay",
    analytics: "analytics",
  };

  const normalized = queryAliases[value] ?? value;
  const exists = page.sections.some((section) => section.id === normalized);
  return exists ? normalized : "";
}

function getSectionSlug(id: string) {
  const slugAliases: Record<string, string> = {
    docs: "normative-documents",
    demo: "demo",
    dates: "deadlines",
    results: "results",
    reports: "reports",
    essay: "essay",
    analytics: "analytics",
  };

  return slugAliases[id] ?? id;
}

export default function ExamPageTabs({
  page,
  initialSectionId,
  pageKey,
  publicDocumentsBySection,
}: {
  page: ExamPageData;
  initialSectionId?: string;
  pageKey: "gia-9" | "gia-11";
  publicDocumentsBySection: Record<string, PublicDocumentsResult>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const normalizedInitialSectionId = getSectionIdFromQuery(
    page,
    initialSectionId ?? null,
  );
  const [activeId, setActiveId] = useState(
    () => normalizedInitialSectionId || getDefaultSectionId(page),
  );

  useEffect(() => {
    const syncWithHash = () => {
      const fromQuery = getSectionIdFromQuery(
        page,
        searchParams.get("section"),
      );
      const fromHash = getSectionIdFromHash(page);
      setActiveId(
        fromQuery ||
          fromHash ||
          normalizedInitialSectionId ||
          getDefaultSectionId(page),
      );
    };

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
    return () => window.removeEventListener("hashchange", syncWithHash);
  }, [normalizedInitialSectionId, page, searchParams]);

  const activeSection =
    page.sections.find((section) => section.id === activeId) ??
    page.sections[0];
  const activeIndex = page.sections.findIndex(
    (section) => section.id === activeSection.id,
  );
  const publicDocuments = publicDocumentsBySection[
    getSectionSlug(activeSection.id)
  ] ?? { documents: [], error: false };

  const handleTabClick = (id: string) => {
    setActiveId(id);
    const next = new URLSearchParams(searchParams.toString());
    next.set("section", getSectionSlug(id));
    window.history.replaceState(
      null,
      "",
      `${pathname}?${next.toString()}#${id}`,
    );
  };

  return (
    <>
      <Container>
        <ButtonTabsNav
          ariaLabel="Навигация по разделам"
          activeKey={activeSection.id}
          onTabClick={handleTabClick}
          items={page.sections.map((section) => ({
            key: section.id,
            title: section.title,
          }))}
        />
      </Container>

      <Section id={activeSection.id} muted={activeIndex % 2 === 1}>
        <Container>
          <div
            className={cls.sectionGrid}
            role="tabpanel"
            id={`panel-${activeSection.id}`}
            aria-labelledby={`tab-${activeSection.id}`}
          >
            <div>
              <p className={cls.kicker}>
                Раздел {String(activeIndex + 1).padStart(2, "0")}
              </p>
              <h2>{activeSection.title}</h2>
              <p>{activeSection.description}</p>
            </div>
            <PublicDocumentsBlock
              result={publicDocuments}
              title={activeSection.title}
              hideWhenEmpty={false}
              variant="examTab"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
