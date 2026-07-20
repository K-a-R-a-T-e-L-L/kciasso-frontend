"use client";

import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import cls from "./FloatingPopover.module.scss";

type Props = {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  role?: "menu" | "dialog";
  placement?: "bottom-start" | "bottom-end";
};

export default function FloatingPopover({ anchorRef, open, onClose, children, role = "dialog", placement = "bottom-start" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: "hidden" });

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const anchor = anchorRef.current;
      const popover = ref.current;
      if (!anchor || !popover) return;
      const rect = anchor.getBoundingClientRect();
      const width = popover.offsetWidth;
      const height = popover.offsetHeight;
      const margin = 12;
      let left = placement === "bottom-end" ? rect.right - width : rect.left;
      left = Math.max(margin, Math.min(left, innerWidth - width - margin));
      let top = rect.bottom + 8;
      if (top + height > innerHeight - margin && rect.top - height - 8 >= margin) top = rect.top - height - 8;
      setStyle({ left, top, visibility: "visible" });
    };
    update();
    addEventListener("resize", update);
    addEventListener("scroll", update, true);
    return () => {
      removeEventListener("resize", update);
      removeEventListener("scroll", update, true);
    };
  }, [anchorRef, open, placement]);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        const anchor = anchorRef.current;
        if (anchor && document.contains(anchor)) anchor.focus();
        wasOpen.current = false;
      }
      return;
    }
    wasOpen.current = true;
    const first = ref.current?.querySelector<HTMLElement>('button,[role="menuitem"],[tabindex]:not([tabindex="-1"])') ?? ref.current?.querySelector<HTMLElement>("strong,span");
    if (first) {
      if (!first.hasAttribute("tabindex")) first.tabIndex = -1;
      first.focus();
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node) && !anchorRef.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, [anchorRef, onClose, open]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(<div ref={ref} role={role} className={cls.popover} style={style}>{children}</div>, document.body);
}
