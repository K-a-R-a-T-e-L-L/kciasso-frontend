"use client";

import cls from "./TabsNav.module.scss";

export type ButtonTabItem = {
  key: string;
  title: string;
};

type Props = {
  items: ButtonTabItem[];
  activeKey: string;
  ariaLabel: string;
  onTabClick: (key: string) => void;
};

export default function ButtonTabsNav({ items, activeKey, ariaLabel, onTabClick }: Props) {
  return (
    <div className={cls.tabList} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = item.key === activeKey;

        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            id={`tab-${item.key}`}
            aria-selected={isActive}
            aria-controls={`panel-${item.key}`}
            tabIndex={isActive ? 0 : -1}
            className={`${cls.tabButton} ${isActive ? cls.active : ""}`.trim()}
            onClick={() => onTabClick(item.key)}
          >
            {item.title}
          </button>
        );
      })}
    </div>
  );
}
