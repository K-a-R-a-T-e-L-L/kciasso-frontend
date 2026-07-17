import type { DocumentGroup } from "@/shared/content/documents.types";
import DocumentList from "@/shared/ui/DocumentList/DocumentList";
import cls from "./DocumentPlaceholder.module.scss";

type Props = {
  oldUrl?: string;
  title?: string;
  groups?: DocumentGroup[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function DocumentPlaceholder({
  oldUrl = "https://www.ocmko.ru/",
  title = "Документы и материалы раздела",
  groups,
  emptyTitle,
  emptyDescription,
}: Props) {
  const fallbackGroups: DocumentGroup[] =
    groups !== undefined
      ? groups
      : [
          {
            id: "official-site",
            title: "Материалы раздела",
            description: "Временный источник до подключения backend и локального файлового хранилища.",
            items: [
              {
                id: "official-site-link",
                title,
                description:
                  "Документы, справочные материалы и полезные ссылки пока доступны через официальный сайт учреждения.",
                url: oldUrl,
                extension: "html",
                mimeType: "text/html",
                isExternal: true,
                category: "Внешний ресурс",
              },
            ],
          },
        ];

  return (
    <div className={cls.placeholder}>
      <div className={cls.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9.5 13h5M9.5 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className={cls.kicker}>Материалы раздела</p>
        <h3>{title}</h3>
        <p>
          В этом разделе отображаются документы, внешние ссылки и архивные материалы. Компонент уже подготовлен к
          работе с backend и локальным файловым хранилищем.
        </p>
        <DocumentList groups={fallbackGroups} emptyTitle={emptyTitle} emptyDescription={emptyDescription} />
      </div>
    </div>
  );
}
