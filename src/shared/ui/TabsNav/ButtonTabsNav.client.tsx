"use client";

import type { TablerIcon } from "@tabler/icons-react";
import cls from "./TabsNav.module.scss";

export type ButtonTabItem = {
  key: string;
  title: string;
  icon?: TablerIcon;
  count?: number;
  disabled?: boolean;
};

type Props = {
  items: ButtonTabItem[];
  activeKey: string;
  ariaLabel: string;
  onTabClick: (key: string) => void;
  compact?: boolean;
};

export default function ButtonTabsNav({ items, activeKey, ariaLabel, onTabClick, compact = false }: Props) {
  return (
    <div className={`${cls.tabList} ${compact ? cls.compact : ""}`.trim()} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = item.key === activeKey;
        const Icon = item.icon;

        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            id={`tab-${item.key}`}
            aria-selected={isActive}
            aria-controls={`panel-${item.key}`}
            disabled={item.disabled}
            tabIndex={isActive ? 0 : -1}
            className={`${cls.tabButton} ${isActive ? cls.active : ""} ${item.disabled ? cls.disabled : ""}`.trim()}
            onClick={() => onTabClick(item.key)}
          >
            {Icon ? <Icon size={16} stroke={1.8} aria-hidden="true" /> : null}
            <span>{item.title}</span>
            {item.count !== undefined ? <span className={cls.count}>{item.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
