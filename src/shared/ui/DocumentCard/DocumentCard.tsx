import Link from "next/link";
import type { DocumentFile } from "@/shared/content/documents.types";
import cls from "./DocumentCard.module.scss";

type Props = {
  item: DocumentFile;
};

function formatSize(sizeBytes?: number) {
  if (!sizeBytes) return null;

  if (sizeBytes >= 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} МБ`;
  }

  if (sizeBytes >= 1024) {
    return `${Math.round(sizeBytes / 1024)} КБ`;
  }

  return `${sizeBytes} Б`;
}

export default function DocumentCard({ item }: Props) {
  const meta = [item.extension.toUpperCase(), item.publishedAt, formatSize(item.sizeBytes)].filter(Boolean);
  const actionLabel = item.actionLabel ?? (item.isExternal ? "Открыть" : "Скачать");

  return (
    <article className={cls.card}>
      <div className={cls.icon} aria-hidden="true">
        {item.extension.toUpperCase()}
      </div>
      <div className={cls.content}>
        <div className={cls.meta}>
          {item.category ? <span>{item.category}</span> : null}
          {meta.length ? <small>{meta.join(" • ")}</small> : null}
        </div>
        <h3>{item.title}</h3>
        {item.description ? <p>{item.description}</p> : null}
        {item.isExternal ? (
          <Link href={item.url} target="_blank" rel="noreferrer">
            {actionLabel}
          </Link>
        ) : item.openInNewTab ? (
          <a href={item.url} target="_blank" rel="noreferrer">
            {actionLabel}
          </a>
        ) : (
          <a href={item.url} download={!item.isExternal}>
            {actionLabel}
          </a>
        )}
      </div>
    </article>
  );
}
