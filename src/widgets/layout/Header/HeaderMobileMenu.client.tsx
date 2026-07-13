"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ContactEntry } from "@/shared/content/content.types";
import { navigation } from "@/shared/config/navigation";
import cls from "./Header.module.scss";

const CLOSE_DURATION_MS = 240;
const DEFAULT_EXPANDED_SECTION = "Главная";

const mobileNavigation = navigation.map((item) => ({
  title: item.title,
  href: item.href,
  children: item.groups?.flatMap((group) => group.items) ?? item.items ?? [],
}));

type Props = {
  hotline: ContactEntry;
};

function isHashLink(href: string) {
  return href.startsWith("/") && href.includes("#");
}

export default function HeaderMobileMenu({ hotline }: Props) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(DEFAULT_EXPANDED_SECTION);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const portalTarget = typeof document === "undefined" ? null : document.body;

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setExpanded(DEFAULT_EXPANDED_SECTION);
    setMounted(true);
    requestAnimationFrame(() => setVisible(true));
  };

  const closeMenu = () => {
    setVisible(false);
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setMounted(false);
    }, CLOSE_DURATION_MS);
  };

  const toggleMenu = () => {
    if (mounted && visible) {
      closeMenu();
      return;
    }

    openMenu();
  };

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    document.body.style.overflow = mounted ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  return (
    <div className={cls.mobileOnly}>
      <button
        className={`${cls.menuButton} ${mounted && visible ? cls.menuButtonActive : ""}`.trim()}
        type="button"
        aria-label={mounted && visible ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={mounted && visible}
        aria-controls="mobile-site-menu"
        onClick={toggleMenu}
      >
        <span />
        <span />
        <span />
      </button>

      {portalTarget && mounted
        ? createPortal(
            <div className={cls.mobileOverlay} data-state={visible ? "open" : "closed"} onClick={closeMenu}>
              <div
                id="mobile-site-menu"
                className={cls.mobilePanel}
                data-state={visible ? "open" : "closed"}
                onClick={(event) => event.stopPropagation()}
              >
                <div className={cls.mobileTop}>
                  <strong>Разделы сайта</strong>
                </div>

                <a className={cls.mobileHotline} href={hotline.href}>
                  <span className={cls.mobileHotlineLabel}>{hotline.label}</span>
                  <span className={cls.mobileHotlineValue}>{hotline.value}</span>
                </a>

                <div className={cls.mobileLinks}>
                  {mobileNavigation.map((item) => {
                    const children = item.children;
                    const hasChildren = children.length > 0;
                    const isExpanded = expanded === item.title;

                    return (
                      <div key={item.title} className={cls.mobileItem}>
                        <div className={cls.mobileRow}>
                          {isHashLink(item.href) ? (
                            <a href={item.href} onClick={closeMenu}>
                              {item.title}
                            </a>
                          ) : (
                            <Link href={item.href} onClick={closeMenu}>
                              {item.title}
                            </Link>
                          )}
                          {hasChildren ? (
                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              aria-label={isExpanded ? `Свернуть раздел ${item.title}` : `Развернуть раздел ${item.title}`}
                              onClick={() => setExpanded(isExpanded ? null : item.title)}
                            >
                              <span className={cls.mobileChevron} aria-hidden="true" />
                            </button>
                          ) : null}
                        </div>
                        {hasChildren ? (
                          <div className={cls.mobileSubLinksWrap} data-open={isExpanded ? "true" : "false"}>
                            <div className={cls.mobileSubLinks}>
                              {children.map((link) =>
                                isHashLink(link.href) ? (
                                  <a key={link.href} href={link.href} onClick={closeMenu}>
                                    {link.title}
                                  </a>
                                ) : (
                                  <Link key={link.href} href={link.href} onClick={closeMenu}>
                                    {link.title}
                                  </Link>
                                ),
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>,
            portalTarget,
          )
        : null}
    </div>
  );
}
