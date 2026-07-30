"use client";

import { useEffect } from "react";
import { AppShell, Box, Burger, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { CurrentUserDto } from "@/shared/api/generated/types";
import AdminNavigation from "@/widgets/admin/AdminNavigation/AdminNavigation.client";
import LogoutButton from "@/widgets/admin/LogoutButton/LogoutButton.client";

type NavigationItem = { href: string; title: string; icon?: "pages" };

export default function AdminShell({
  admin,
  navigation,
  children,
}: {
  admin: CurrentUserDto;
  navigation: NavigationItem[];
  children: React.ReactNode;
}) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const isSuperAdmin = admin.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!opened) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, opened]);

  return (
    <AppShell
      data-testid="admin-shell"
      header={{ height: { base: 64, sm: 0 } }}
      navbar={{ width: 280, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding={{ base: "sm", sm: "lg" }}
      bg="kciassoBlue.0"
      styles={{ main: { minWidth: 0 } }}
    >
      <AppShell.Header hiddenFrom="sm" px="md" bg="kciassoBlue.9" c="white">
        <Group h="100%" justify="space-between">
          <Stack gap={0}>
            <Text size="xs" fw={800} tt="uppercase" c="kciassoTeal.2">Admin</Text>
            <Text fw={800}>ГКУ «КЦИАССО»</Text>
          </Stack>
          <Burger
            opened={opened}
            onClick={toggle}
            color="white"
            aria-label={opened ? "Закрыть меню администратора" : "Открыть меню администратора"}
          />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar data-testid="admin-navbar" p="md" bg="kciassoBlue.9" c="white" aria-label="Панель администратора">
        <Stack h="100%" gap="md">
          <Stack gap={4} visibleFrom="sm">
            <Text size="xs" fw={800} tt="uppercase" c="kciassoTeal.2">Admin</Text>
            <Text fw={800}>ГКУ «КЦИАССО»</Text>
            <Text size="sm" c="kciassoBlue.1">Управление новостями, документами и публикациями.</Text>
          </Stack>
          <ScrollArea style={{ flex: 1 }} type="auto">
            <AdminNavigation items={navigation} onNavigate={close} />
          </ScrollArea>
          <Box pt="sm" style={{ borderTop: "1px solid var(--mantine-color-kciassoBlue-7)" }}>
            <Stack gap="xs">
              <Text size="sm" c="white" truncate>{admin.email}</Text>
              <Text size="xs" c="kciassoBlue.1">{isSuperAdmin ? "super-admin" : "admin"}</Text>
              <LogoutButton />
            </Stack>
          </Box>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box maw={1600} mx="auto">{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
