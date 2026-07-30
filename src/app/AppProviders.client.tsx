"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

import { kciassoTheme } from "@/shared/lib/theme/mantine/admin-theme";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={kciassoTheme} defaultColorScheme="light">
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
