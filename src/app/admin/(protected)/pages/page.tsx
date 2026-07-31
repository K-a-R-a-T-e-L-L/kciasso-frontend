import { redirect } from "next/navigation";
import { Badge, Card, Group, SimpleGrid, Stack, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from "@mantine/core";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminGlobalSections, getAdminPageRegistry } from "@/shared/api/adapters/admin-page-layout.adapter";
import AdminGlobalHtmlSections from "@/widgets/admin/AdminGlobalHtmlSections/AdminGlobalHtmlSections.client";
import { pageUiModel } from "@/widgets/admin/AdminPageLayoutEditor/admin-section-view-model";
import AdminLinkButton from "@/shared/ui/admin/AdminLinkButton.client";

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
            <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
              {pages.map((page) => {
                const presentation = pageUiModel(page.pageKey);
                return (
                <Card key={page.pageKey} component="article" withBorder shadow="sm" p="md">
                  <Stack gap="xs">
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Title order={2} size="h4">{presentation.title}</Title>
                      <Badge color={page.isMaterialized ? "teal" : "gray"}>{page.isMaterialized ? "Активна" : "Не подготовлена"}</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">{page.routePattern}</Text>
                    <Group gap={6}>
                      <Badge variant="light" color="gray">Всего: {page.totalSections}</Badge>
                      <Badge variant="light" color="teal">Видимые: {page.visibleSections}</Badge>
                      <Badge variant="light" color="orange">Скрытые: {page.hiddenSections}</Badge>
                    </Group>
                    <Group gap={6}>
                      <Badge variant="outline">Локальные HTML: {page.pageCustomHtmlSections}</Badge>
                      <Badge variant="outline" color="grape">Глобальные HTML: {page.globalCustomHtmlSections}</Badge>
                    </Group>
                    <AdminLinkButton href={`/admin/pages/${encodeURIComponent(page.pageKey)}`} mt="xs">
                      Настроить страницу
                    </AdminLinkButton>
                  </Stack>
                </Card>
              )})}
            </SimpleGrid>
          )}
        </TabsPanel>
        {canManageGlobal ? <TabsPanel value="global" pt="lg"><AdminGlobalHtmlSections initialSections={globals} /></TabsPanel> : null}
      </Tabs>
    </Stack>
  );
}
