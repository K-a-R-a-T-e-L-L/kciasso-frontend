"use client";

import Link from "next/link";
import { IconFileDescription } from "@tabler/icons-react";
import { NavLink, Stack } from "@mantine/core";
import { usePathname } from "next/navigation";

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
            background: active ? "var(--mantine-color-kciassoBlue-6)" : "transparent",
            borderRadius: "var(--mantine-radius-md)",
            fontWeight: active ? 800 : 600,
            color: "rgba(255,255,255,0.92)",
            "&:hover": { background: active ? "var(--mantine-color-kciassoBlue-5)" : "rgba(255,255,255,0.12)", color: "#fff" },
            "&:focus-visible": { outline: "2px solid rgba(255,255,255,0.95)", outlineOffset: 2, color: "#fff" },
          },
          label: { color: "inherit" },
          section: { color: "inherit" },
        }} />;
    })}
  </Stack>;
}
