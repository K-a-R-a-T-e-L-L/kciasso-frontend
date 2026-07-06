"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { navigation } from "@/shared/config/navigation";
import cls from "./Header.module.scss";

const CLOSE_DURATION_MS = 240;
const DEFAULT_EXPANDED_SECTION = "Главная";
const mobileNavigation = navigation.map((item) => ({
  title: item.title,
  href: item.href,
  children: item.groups?.flatMap((group) => group.items) ?? item.items ?? [],
}));

function isHashLink(href: string) {
  return href.startsWith("/") && href.includes("#");
}

export default function HeaderMobileMenu() {
  const [portalReady, setPortalReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(DEFAULT_EXPANDED_SECTION);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    setPortalReady(true);
    return () => clearCloseTimer();
  }, []);

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

      {portalReady && mounted
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
                            {children.map((link) => (
                              isHashLink(link.href) ? (
                                <a key={link.href} href={link.href} onClick={closeMenu}>
                                  {link.title}
                                </a>
                              ) : (
                                <Link key={link.href} href={link.href} onClick={closeMenu}>
                                  {link.title}
                                </Link>
                              )
                            ))}
                          </div>
                        </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <Link className={cls.mobileContact} href="/o-centre/kontakty" onClick={closeMenu}>
                  Контакты
                </Link>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
