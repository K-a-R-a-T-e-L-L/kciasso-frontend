"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ContactEntry } from "@/shared/content/content.types";
import { navigation, type NavItem } from "@/shared/config/navigation";
import cls from "./Header.module.scss";

type ActiveDropdown = {
  title: string;
  centerX: number;
} | null;

type Props = {
  hotline: ContactEntry;
};

function isHashLink(href: string) {
  return href.startsWith("/") && href.includes("#");
}

export default function HeaderNav({ hotline }: Props) {
  const [active, setActive] = useState<ActiveDropdown>(null);
  const activeItem = navigation.find((item) => item.title === active?.title);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setActive(null), 180);
  };

  const openItem = (title: string, target: HTMLElement) => {
    clearCloseTimer();
    const rect = target.getBoundingClientRect();
    setActive({
      title,
      centerX: rect.left + rect.width / 2,
    });
  };

  useEffect(() => () => clearCloseTimer(), []);

  return (
    <div className={cls.desktopNav} onMouseLeave={scheduleClose} onMouseEnter={clearCloseTimer}>
      <nav className={cls.nav} aria-label="Основная навигация">
        {navigation.map((item) => (
          <div key={item.title} className={cls.navItem}>
            {item.kind === "simple" ? (
              <Link className={cls.navLink} href={item.href}>
                {item.title}
              </Link>
            ) : (
              <button
                className={cls.navLink}
                onMouseEnter={(event) => openItem(item.title, event.currentTarget)}
                onFocus={(event) => openItem(item.title, event.currentTarget)}
                type="button"
              >
                <span>{item.title}</span>
                <span className={cls.chevron} aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </nav>

      <a className={cls.hotlineCta} href={hotline.href}>
        <span className={cls.hotlineIcon} aria-hidden="true">
          {"\u260E"}
        </span>
        <span className={cls.hotlineBody}>
          <span>{hotline.label}</span>
          <strong>{hotline.value}</strong>
        </span>
      </a>

      {activeItem ? (
        <NavigationPanel
          item={activeItem}
          centerX={active?.centerX}
          onPointerEnter={clearCloseTimer}
          onPointerLeave={scheduleClose}
        />
      ) : null}
    </div>
  );
}

function NavigationPanel({
  item,
  centerX,
  onPointerEnter,
  onPointerLeave,
}: {
  item: NavItem;
  centerX?: number;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  if (item.kind === "mega" && item.groups) {
    return (
      <div className={cls.megaPanel} onMouseEnter={onPointerEnter} onMouseLeave={onPointerLeave}>
        <div className={cls.panelIntro}>
          <p>Раздел сайта</p>
          <h3>{item.title}</h3>
          <Link href={item.href}>Перейти в раздел</Link>
        </div>
        <div className={cls.panelColumns}>
          {item.groups.map((group) => (
            <div key={group.title} className={cls.panelGroup}>
              <h4>{group.title}</h4>
              {group.items.map((link) =>
                isHashLink(link.href) ? (
                  <a key={link.href} href={link.href}>
                    {link.title}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href}>
                    {link.title}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cls.dropdownPanel}
      style={centerX ? { left: `${centerX}px` } : undefined}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
    >
      <div className={cls.dropdownHead}>
        <h3>{item.title}</h3>
        <Link href={item.href}>Открыть раздел</Link>
      </div>
      <div className={cls.dropdownList}>
        {item.items?.map((link) =>
          isHashLink(link.href) ? (
            <a key={link.href} href={link.href}>
              {link.title}
            </a>
          ) : (
            <Link key={link.href} href={link.href}>
              {link.title}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
