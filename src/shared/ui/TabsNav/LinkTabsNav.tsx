import Link from "next/link";
import type { TablerIcon } from "@tabler/icons-react";
import cls from "./TabsNav.module.scss";

export type LinkTabItem = {
  key: string;
  title: string;
  href: string;
  icon?: TablerIcon;
  count?: number;
  disabled?: boolean;
};

type Props = {
  items: LinkTabItem[];
  activeKey: string;
  ariaLabel: string;
  compact?: boolean;
};

export default function LinkTabsNav({ items, activeKey, ariaLabel, compact = false }: Props) {
  return (
    <nav className={`${cls.tabList} ${compact ? cls.compact : ""}`.trim()} aria-label={ariaLabel}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.key === activeKey;
        return (
        <Link
          key={item.key}
          href={item.href}
          aria-current={isActive ? "page" : undefined}
          aria-disabled={item.disabled || undefined}
          tabIndex={item.disabled ? -1 : undefined}
          className={`${cls.tabLink} ${isActive ? cls.active : ""} ${item.disabled ? cls.disabled : ""}`.trim()}
        >
          {Icon ? <Icon size={16} stroke={1.8} aria-hidden="true" /> : null}
          <span>{item.title}</span>
          {item.count !== undefined ? <span className={cls.count}>{item.count}</span> : null}
        </Link>
        );
      })}
    </nav>
  );
}
