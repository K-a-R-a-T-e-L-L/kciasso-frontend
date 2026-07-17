"use client";

import { useMemo, useState } from "react";
import type { PublicDocumentsResult } from "@/shared/api/adapters/public-documents.adapter";
import { publicDocumentFileUrl } from "@/shared/api/adapters/public-documents.adapter";
import DocumentList from "@/shared/ui/DocumentList/DocumentList";
import SearchField from "@/shared/ui/SearchField/SearchField";
import cls from "./PublicDocumentsBlock.module.scss";

function requisites(number?: string | null, date?: string | null) {
  const formattedDate = date ? new Date(date).toLocaleDateString("ru-RU") : null;
  if (number && formattedDate) return `Документ № ${number} от ${formattedDate}`;
  if (number) return `Документ № ${number}`;
  if (formattedDate) return `Документ от ${formattedDate}`;
  return null;
}

export default function PublicDocumentsBlock({
  result,
  title,
  hideWhenEmpty = true,
  variant = "fullWidth",
  searchable = false,
}: {
  result: PublicDocumentsResult;
  title?: string;
  hideWhenEmpty?: boolean;
  variant?: "fullWidth" | "sectionInline" | "examTab";
  searchable?: boolean;
}) {
  const [query, setQuery] = useState("");
  const filteredDocuments = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru-RU");
    if (!normalized) return result.documents;
    return result.documents.filter((document) =>
      [document.title, document.documentNumber, document.documentDate, document.description]
        .filter(Boolean).join(" ").toLocaleLowerCase("ru-RU").includes(normalized),
    );
  }, [query, result.documents]);

  const search = <SearchField label="Поиск по документам" value={query} onChange={setQuery} resultCount={filteredDocuments.length} placeholder="Название, номер, дата или описание" />;

  if (result.error) {
    if (hideWhenEmpty) return null;
    return <DocumentList groups={[]} compactEmpty emptyTitle="Не удалось загрузить документы. Попробуйте обновить страницу позднее." emptyDescription="" />;
  }

  if (result.documents.length === 0) {
    if (hideWhenEmpty && !searchable) return null;
    return (
      <div className={cls.block} data-document-variant={variant}>
        <h2>{title ?? "Документы и материалы"}</h2>
        {searchable ? search : null}
        <DocumentList groups={[]} compactEmpty emptyTitle="Документы пока не опубликованы." emptyDescription="" />
      </div>
    );
  }

  if (searchable && filteredDocuments.length === 0) {
    return (
      <div className={cls.block} data-document-variant={variant}>
        {search}
        <DocumentList groups={[]} compactEmpty emptyTitle="По вашему запросу документы не найдены." emptyDescription="" />
      </div>
    );
  }

  return (
    <div className={cls.block} data-document-variant={variant}>
      {searchable ? search : null}
      <DocumentList groups={[{
        id: title ?? "documents",
        title: title ?? "Документы",
        showHeading: Boolean(title),
        items: filteredDocuments.map((document) => {
          const extension = document.currentVersion.extension.toLowerCase();
          const openInNewTab = ["pdf", "jpg", "jpeg", "png"].includes(extension);
          return {
            id: String(document.id),
            title: document.title,
            description: [document.description, requisites(document.documentNumber, document.documentDate)].filter(Boolean).join(" · "),
            url: publicDocumentFileUrl(document.id),
            extension,
            mimeType: document.currentVersion.mimeType,
            sizeBytes: Number(document.currentVersion.sizeBytes),
            openInNewTab,
            actionLabel: openInNewTab ? "Открыть документ" : "Скачать документ",
          };
        }),
      }]} />
    </div>
  );
}
