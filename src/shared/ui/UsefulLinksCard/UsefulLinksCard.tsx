import Link from "next/link";
import { IconArrowUpRight, IconChevronRight } from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";
import cls from "./UsefulLinksCard.module.scss";

export type UsefulLinkItem = {
  id: string;
  title: string;
  href: string;
  external?: boolean;
  icon?: TablerIcon;
  description?: string;
};

export type UsefulLinksCardProps = {
  title: string;
  eyebrow?: string;
  items: UsefulLinkItem[];
  icon?: TablerIcon;
  variant?: "default" | "compact";
};

export default function UsefulLinksCard({
  title,
  eyebrow,
  items,
  icon: HeaderIcon,
  variant = "default",
}: UsefulLinksCardProps) {
  if (items.length === 0) return null;

  return (
    <section className={`${cls.card} ${variant === "compact" ? cls.compact : ""}`.trim()} aria-label={title}>
      <header className={cls.header}>
        {HeaderIcon ? <span className={cls.headerIcon} aria-hidden="true"><HeaderIcon size={26} stroke={1.8} /></span> : null}
        <div>
          {eyebrow ? <p className={cls.eyebrow}>{eyebrow}</p> : null}
          <h2>{title}</h2>
        </div>
      </header>
      <div className={cls.list}>
        {items.map((item) => {
          const ItemIcon = item.icon;
          const content = (
            <>
              <span className={cls.itemIcon} aria-hidden="true">
                {ItemIcon ? <ItemIcon size={20} stroke={1.8} /> : <IconChevronRight size={20} stroke={1.8} />}
              </span>
              <span className={cls.itemContent}>
                <span className={cls.itemTitle}>{item.title}</span>
                {item.description ? <span className={cls.description}>{item.description}</span> : null}
              </span>
              <span className={cls.arrow} aria-hidden="true">
                {item.external ? <IconArrowUpRight size={20} stroke={1.8} /> : <IconChevronRight size={20} stroke={1.8} />}
              </span>
            </>
          );

          return item.external ? (
            <a key={item.id} className={cls.row} href={item.href} target="_blank" rel="noreferrer noopener">
              {content}
            </a>
          ) : (
            <Link key={item.id} className={cls.row} href={item.href}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
