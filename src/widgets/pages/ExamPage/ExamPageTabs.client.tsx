"use client";

import { useEffect, useState } from "react";
import Container from "@/shared/ui/Container/Container";
import Section from "@/shared/ui/Section/Section";
import DocumentPlaceholder from "@/shared/ui/DocumentPlaceholder/DocumentPlaceholder";
import type { ExamPageData } from "@/shared/content/mock";
import cls from "./ExamPage.module.scss";

function getInitialSectionId(page: ExamPageData) {
  return page.sections[0]?.id ?? "";
}

function getSectionIdFromHash(page: ExamPageData) {
  const hash = window.location.hash.replace("#", "");
  const exists = page.sections.some((section) => section.id === hash);
  return exists ? hash : page.sections[0]?.id ?? "";
}

export default function ExamPageTabs({ page }: { page: ExamPageData }) {
  const [activeId, setActiveId] = useState(() => getInitialSectionId(page));

  useEffect(() => {
    const syncWithHash = () => {
      const nextId = getSectionIdFromHash(page);
      setActiveId(nextId);
    };

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
    return () => window.removeEventListener("hashchange", syncWithHash);
  }, [page]);

  const activeSection = page.sections.find((section) => section.id === activeId) ?? page.sections[0];
  const activeIndex = page.sections.findIndex((section) => section.id === activeSection.id);

  const handleTabClick = (id: string) => {
    setActiveId(id);
    window.history.replaceState(null, "", `${page.href}#${id}`);
  };

  return (
    <>
      <Container>
        <div className={cls.tabNav} role="tablist" aria-label="Навигация по разделам">
          {page.sections.map((section) => {
            const isActive = section.id === activeSection.id;

            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                id={`tab-${section.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${section.id}`}
                tabIndex={isActive ? 0 : -1}
                className={isActive ? cls.activeTab : undefined}
                onClick={() => handleTabClick(section.id)}
              >
                {section.title}
              </button>
            );
          })}
        </div>
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
              <p className={cls.kicker}>Раздел {String(activeIndex + 1).padStart(2, "0")}</p>
              <h2>{activeSection.title}</h2>
              <p>{activeSection.description}</p>
            </div>
            <DocumentPlaceholder oldUrl={activeSection.oldUrl} />
          </div>
        </Container>
      </Section>
    </>
  );
}
