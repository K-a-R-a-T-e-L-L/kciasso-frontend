"use client";

import Link from "next/link";
import {
  IconFileDescription,
  IconFileText,
  IconExternalLink,
  IconLayoutDashboard,
  IconHome,
  IconNews,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { Box, NavLink, Stack } from "@mantine/core";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_COLORS } from "@/shared/lib/theme/mantine/admin-theme";

type NavigationIcon =
  "dashboard" | "documents" | "home" | "news" | "pages" | "settings" | "users";
type NavigationItem = { href: string; title: string; icon: NavigationIcon };

const icons: Record<NavigationIcon, React.ReactNode> = {
  dashboard: <IconLayoutDashboard size={19} stroke={1.8} aria-hidden="true" />,
  documents: <IconFileText size={19} stroke={1.8} aria-hidden="true" />,
  home: <IconHome size={19} stroke={1.8} aria-hidden="true" />,
  news: <IconNews size={19} stroke={1.8} aria-hidden="true" />,
  pages: <IconFileDescription size={19} stroke={1.8} aria-hidden="true" />,
  settings: <IconSettings size={19} stroke={1.8} aria-hidden="true" />,
  users: <IconUsers size={19} stroke={1.8} aria-hidden="true" />,
};

export default function AdminNavigation({
  items,
  onNavigate,
}: {
  items: NavigationItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const publicHome = items.find((item) => item.href === "/");
  const adminItems = items.filter((item) => item.href !== "/");
  return (
    <Stack component="nav" gap={4} aria-label="Навигация администратора">
      {publicHome ? (
        <Box
          data-admin-public-link
          pb="md"
          mb="xs"
          style={{
            borderBottom: "1px solid var(--mantine-color-kciassoBlue-7)",
          }}
        >
          <NavLink
            component={Link}
            href={publicHome.href}
            target="_blank"
            rel="noopener noreferrer"
            label={publicHome.title}
            description="Публичный сайт · новая вкладка"
            leftSection={icons[publicHome.icon]}
            rightSection={<IconExternalLink size={16} aria-hidden="true" />}
            onClick={onNavigate}
            variant="filled"
            styles={{
              root: {
                border: "1px solid var(--mantine-color-kciassoTeal-4)",
                borderRadius: "var(--mantine-radius-md)",
                background: "var(--mantine-color-kciassoTeal-9)",
                color: "white",
              },
              label: { color: "white", fontWeight: 800 },
              description: { color: "var(--mantine-color-kciassoTeal-1)" },
              section: { color: "white" },
            }}
          />
        </Box>
      ) : null}
      {adminItems.map((item) => {
        const active = item.href === "/admin"
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <NavLink
            key={item.href}
            component={Link}
            href={item.href}
            active={active}
            label={item.title}
            onClick={onNavigate}
            variant="transparent"
            leftSection={icons[item.icon]}
            classNames={{ root: "admin-navigation-link" }}
            aria-current={active ? "page" : undefined}
            styles={{
              root: {
                background: active
                  ? ADMIN_NAV_COLORS.activeBackground
                  : ADMIN_NAV_COLORS.defaultBackground,
                borderRadius: "var(--mantine-radius-md)",
                fontWeight: active ? 800 : 600,
                color: ADMIN_NAV_COLORS.foreground,
                "&:hover": {
                  background: active
                    ? ADMIN_NAV_COLORS.activeHoverBackground
                    : ADMIN_NAV_COLORS.hoverBackground,
                  color: ADMIN_NAV_COLORS.foreground,
                },
              },
              label: { color: "inherit" },
              section: { color: "inherit" },
            }}
          />
        );
      })}
    </Stack>
  );
}
