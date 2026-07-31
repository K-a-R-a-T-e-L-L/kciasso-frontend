import { Anchor, Box, Text, Title } from "@mantine/core";
import { notFound, redirect } from "next/navigation";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { getAdminPageLayout } from "@/shared/api/adapters/admin-page-layout.adapter";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import AdminPageLayoutEditor from "@/widgets/admin/AdminPageLayoutEditor/AdminPageLayoutEditor.client";
import { pageUiModel } from "@/widgets/admin/AdminPageLayoutEditor/admin-section-view-model";

export default async function AdminPageLayout({ params }: { params: Promise<{ pageKey: string }> }) {
  const { pageKey } = await params;
  if (!pageKey) notFound();
  const { token, user } = await requireAdminSectionToken("site-settings");
  let layout;
  try { layout = await getAdminPageLayout(token, pageKey); } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) { await clearAdminTokenCookie(); redirect("/admin/login"); }
    if (isAdminApiErrorStatus(error, 403)) redirect("/admin/forbidden");
    if (isAdminApiErrorStatus(error, 404)) notFound();
    throw error;
  }
  const presentation = pageUiModel(pageKey);
  const friendlyLayout = { ...layout, title: presentation.title };
  return <Box component="section"><Text size="xs" fw={800} tt="uppercase" c="kciassoBlue.6">Настройки сайта</Text><Title order={1}>{presentation.title}</Title><Text c="dimmed">Маршрут: {layout.routePattern}</Text><Anchor href="/admin/pages">← Ко всем страницам</Anchor><AdminPageLayoutEditor pageKey={pageKey} initialData={friendlyLayout} canManageCustomHtml={user.role === "SUPER_ADMIN"} /></Box>;
}
