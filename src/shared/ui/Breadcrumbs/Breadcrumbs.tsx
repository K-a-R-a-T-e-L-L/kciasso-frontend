import Link from "next/link";
import cls from "./Breadcrumbs.module.scss";

export type BreadcrumbItem = {
  title: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav className={cls.breadcrumbs} aria-label="Хлебные крошки">
      {items.map((item, index) => (
        <span key={`${item.title}-${index}`}>
          {item.href ? <Link href={item.href}>{item.title}</Link> : <span>{item.title}</span>}
        </span>
      ))}
    </nav>
  );
}
