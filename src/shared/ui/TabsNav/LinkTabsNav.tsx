import Link from "next/link";
import cls from "./TabsNav.module.scss";

export type LinkTabItem = {
  key: string;
  title: string;
  href: string;
};

type Props = {
  items: LinkTabItem[];
  activeKey: string;
  ariaLabel: string;
};

export default function LinkTabsNav({ items, activeKey, ariaLabel }: Props) {
  return (
    <nav className={cls.tabList} aria-label={ariaLabel}>
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`${cls.tabLink} ${item.key === activeKey ? cls.active : ""}`.trim()}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
