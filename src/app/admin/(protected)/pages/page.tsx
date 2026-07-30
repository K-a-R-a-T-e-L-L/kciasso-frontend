import { redirect } from "next/navigation";
import { Anchor, Badge, Card, Group, SimpleGrid, Stack, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from "@mantine/core";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminGlobalSections, getAdminPageRegistry } from "@/shared/api/adapters/admin-page-layout.adapter";
import AdminGlobalHtmlSections from "@/widgets/admin/AdminGlobalHtmlSections/AdminGlobalHtmlSections.client";

export default async function AdminPagesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  const activeTab = params.tab === "global" ? "global" : "pages";
  const { token, user } = await requireAdminSectionToken("site-settings");
  const canManageGlobal = user.role === "SUPER_ADMIN";
  const pagesTabLink = { component: "a", href: "/admin/pages" } as const;
  const globalTabLink = { component: "a", href: "/admin/pages?tab=global" } as const;
  let pages;
  let globals = [];
  try {
    [pages, globals] = await Promise.all([
      getAdminPageRegistry(token),
      canManageGlobal ? getAdminGlobalSections(token) : Promise.resolve([]),
    ]);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) {
      await clearAdminTokenCookie();
      redirect("/admin/login");
    }
    if (isAdminApiErrorStatus(error, 403)) redirect("/admin/forbidden");
    throw error;
  }

  return (
    <Stack data-testid="admin-pages-list" gap="lg">
      <Stack gap={3}>
        <Text size="xs" fw={800} tt="uppercase" c="kciassoBlue.6">Настройки сайта</Text>
        <Title order={1}>Страницы и секции</Title>
        <Text c="dimmed">Управление системными, индивидуальными и глобальными HTML-секциями.</Text>
      </Stack>
      <Tabs value={activeTab}>
        <TabsList>
          <TabsTab value="pages" {...pagesTabLink}>Страницы</TabsTab>
          {canManageGlobal ? <TabsTab value="global" {...globalTabLink}>Глобальные секции</TabsTab> : null}
        </TabsList>
        <TabsPanel value="pages" pt="lg">
          {pages.length === 0 ? <Text c="dimmed">Страницы пока не зарегистрированы.</Text> : (
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              {pages.map((page) => (
                <Card key={page.pageKey} component="article" withBorder shadow="sm" p="lg">
                  <Stack gap="xs">
                    <Title order={2} size="h3">{page.title}</Title>
                    <Group gap="xs"><Badge variant="light">{page.pageKey}</Badge><Badge color={page.isMaterialized ? "green" : "gray"}>{page.isMaterialized ? "Layout создан" : "Fallback"}</Badge></Group>
                    <Text size="sm">Маршрут: {page.routePattern}</Text>
                    <Text size="sm">Секций: {page.totalSections}; видимых: {page.visibleSections}; HTML: {page.pageCustomHtmlSections + page.globalCustomHtmlSections}</Text>
                    <Text size="sm" c="dimmed">Ревизия: {page.revision}</Text>
                    <Anchor href={`/admin/pages/${encodeURIComponent(page.pageKey)}`}>Редактировать →</Anchor>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </TabsPanel>
        {canManageGlobal ? <TabsPanel value="global" pt="lg"><AdminGlobalHtmlSections initialSections={globals} /></TabsPanel> : null}
      </Tabs>
    </Stack>
  );
}
