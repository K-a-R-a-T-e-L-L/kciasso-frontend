import Link from "next/link";
import cls from "./DocumentPlaceholder.module.scss";

type Props = {
  oldUrl?: string;
  title?: string;
};

export default function DocumentPlaceholder({
  oldUrl = "https://www.ocmko.ru/",
  title = "Документы и материалы раздела",
}: Props) {
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
          В этом разделе размещаются документы, справочные материалы и полезные ссылки. При необходимости можно
          открыть соответствующий раздел на официальном сайте учреждения.
        </p>
        <Link href={oldUrl} target="_blank" rel="noreferrer">
          Открыть официальный сайт
        </Link>
      </div>
    </div>
  );
}
