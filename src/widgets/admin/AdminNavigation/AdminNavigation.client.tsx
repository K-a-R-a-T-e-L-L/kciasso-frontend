"use client";

import Link from "next/link";
import { IconFileDescription } from "@tabler/icons-react";
import { NavLink, Stack } from "@mantine/core";
import { usePathname } from "next/navigation";
import {
  ADMIN_NAV_COLORS,
  ADMIN_NAV_FOCUS,
} from "@/shared/lib/theme/mantine/admin-theme";

type NavigationItem = { href: string; title: string; icon?: "pages" };

export default function AdminNavigation({ items, onNavigate }: { items: NavigationItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return <Stack component="nav" gap={4} aria-label="Навигация администратора">
    {items.map((item) => {
      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
      return <NavLink key={item.href} component={Link} href={item.href} active={active} label={item.title} onClick={onNavigate}
        variant="transparent"
        leftSection={item.icon === "pages" ? <IconFileDescription size={19} stroke={1.8} aria-hidden="true" /> : undefined}
        aria-current={active ? "page" : undefined}
        styles={{
          root: {
            background: active ? ADMIN_NAV_COLORS.activeBackground : ADMIN_NAV_COLORS.defaultBackground,
            borderRadius: "var(--mantine-radius-md)",
            fontWeight: active ? 800 : 600,
            color: ADMIN_NAV_COLORS.foreground,
            "&:hover": {
              background: active ? ADMIN_NAV_COLORS.activeHoverBackground : ADMIN_NAV_COLORS.hoverBackground,
              color: ADMIN_NAV_COLORS.foreground,
            },
            "&:focus-visible": {
              outline: `${ADMIN_NAV_FOCUS.outlineWidth}px solid ${ADMIN_NAV_FOCUS.outlineColor}`,
              outlineOffset: ADMIN_NAV_FOCUS.outlineOffset,
              color: ADMIN_NAV_COLORS.foreground,
            },
          },
          label: { color: "inherit" },
          section: { color: "inherit" },
        }} />;
    })}
  </Stack>;
}
