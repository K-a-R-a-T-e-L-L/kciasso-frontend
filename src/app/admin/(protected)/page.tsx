import { Box, Group } from "@mantine/core";
import { IconFilePlus, IconFolders, IconLayoutDashboard } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import {
  clearAdminTokenCookie,
  requireAdminToken,
} from "@/shared/admin/auth";
import {
  isAdminApiErrorStatus,
  isAdminApiTransportError,
} from "@/shared/admin/api-error";
import { getAdminDocuments } from "@/shared/api/adapters/admin-documents.adapter";
import {
  getAdminNewsCategories,
  getAdminNewsList,
} from "@/shared/api/adapters/admin-news.adapter";
import { getAdminUsers } from "@/shared/api/adapters/admin-users.adapter";
import type { AdminNewsCategoryDto } from "@/shared/api/generated/types";
import AdminLinkButton from "@/shared/ui/admin/AdminLinkButton.client";
import AdminBackendUnavailable from "@/widgets/admin/AdminBackendUnavailable/AdminBackendUnavailable";
import AdminDashboard, {
  type DashboardDocumentsSummary,
  type DashboardNewsSummary,
  type DashboardUsersSummary,
} from "@/widgets/admin/AdminDashboard/AdminDashboard";
import NewsEditorTrigger from "@/widgets/admin/AdminNewsForm/NewsEditorTrigger.client";
import UserEditorDrawer from "@/widgets/admin/AdminUserForm/UserEditorDrawer.client";
import { createUserAction } from "./users/actions";

export default async function Page() {
  const { token, user } = await requireAdminToken();
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const canManageNews = isSuperAdmin || user.canManageNews;
  const canManageDocuments =
    isSuperAdmin ||
    user.documentsAccessMode === "ALL" ||
    user.documentGroups.length > 0;
  const canManageSiteSettings = isSuperAdmin || user.canManageSiteSettings;
  if (!canManageNews && !canManageDocuments && !canManageSiteSettings && !isSuperAdmin) {
    redirect("/admin/forbidden");
  }

  let news: DashboardNewsSummary | undefined;
  let documents: DashboardDocumentsSummary | undefined;
  let users: DashboardUsersSummary | undefined;
  let categories: AdminNewsCategoryDto[] = [];

  try {
    const [newsData, documentData, userData] = await Promise.all([
      canManageNews
        ? Promise.all([
            getAdminNewsList(token, { page: 1, limit: 5, sort: "newest" }),
            getAdminNewsList(token, { page: 1, limit: 1, status: "published" }),
            getAdminNewsList(token, { page: 1, limit: 1, status: "draft" }),
            getAdminNewsList(token, { page: 1, limit: 1, status: "scheduled" }),
            getAdminNewsCategories(token),
          ])
        : null,
      canManageDocuments
        ? Promise.all([
            getAdminDocuments(token, {
              page: 1,
              pageSize: 20,
              sortBy: "updatedAt",
              sortDirection: "desc",
            }),
            getAdminDocuments(token, {
              page: 1,
              pageSize: 20,
              status: "PUBLISHED",
            }),
            getAdminDocuments(token, {
              page: 1,
              pageSize: 20,
              status: "UNLISTED",
            }),
          ])
        : null,
      isSuperAdmin
        ? Promise.all([
            getAdminUsers(token, { page: 1, limit: 1 }),
            getAdminUsers(token, { page: 1, limit: 1, status: "active" }),
          ])
        : null,
    ]);

    if (newsData) {
      const [recent, published, draft, scheduled, loadedCategories] = newsData;
      categories = loadedCategories;
      news = {
        total: recent.meta.total,
        published: published.meta.total,
        draft: draft.meta.total,
        scheduled: scheduled.meta.total,
        recent: recent.items.map((item) => ({
          id: item.id,
          title: item.title,
          categoryTitle: item.category?.title ?? "Без рубрики",
          status: item.status,
          updatedAt: item.updatedAt,
        })),
      };
    }

    if (documentData) {
      const [recent, published, hidden] = documentData;
      documents = {
        total: recent.meta.total,
        published: published.meta.total,
        hidden: hidden.meta.total,
        recent: recent.items.slice(0, 5).map((item) => ({
          id: item.id,
          title: item.title,
          documentNumber: item.documentNumber,
          status: item.status,
          fileType: item.currentVersion?.extension.toUpperCase(),
          updatedAt: item.updatedAt,
        })),
      };
    }

    if (userData) {
      const [allUsers, activeUsers] = userData;
      users = { total: allUsers.meta.total, active: activeUsers.meta.total };
    }
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) {
      await clearAdminTokenCookie();
      redirect("/admin/login");
    }
    if (isAdminApiErrorStatus(error, 403)) redirect("/admin/forbidden");
    if (isAdminApiTransportError(error)) {
      return (
        <Box component="main">
          <AdminBackendUnavailable retryHref="/admin" />
        </Box>
      );
    }
    throw error;
  }

  return (
    <AdminDashboard
      displayName={user.name || user.email}
      email={user.email}
      roleLabel={isSuperAdmin ? "super-admin" : "admin"}
      generatedAt={new Date().toISOString()}
      news={news}
      documents={documents}
      users={users}
      canManageSiteSettings={canManageSiteSettings}
      quickActions={
        <Group gap="sm">
          {canManageNews ? (
            <>
              <NewsEditorTrigger categories={categories} />
              <AdminLinkButton href="/admin/news/categories" variant="light" leftSection={<IconFolders size={18} />}>
                Управление рубриками
              </AdminLinkButton>
            </>
          ) : null}
          {canManageDocuments ? (
            <AdminLinkButton href="/admin/documents?create=1" variant="light" leftSection={<IconFilePlus size={18} />}>
              Добавить документ
            </AdminLinkButton>
          ) : null}
          {canManageSiteSettings ? (
            <AdminLinkButton href="/admin/pages" variant="light" leftSection={<IconLayoutDashboard size={18} />}>
              Настроить страницы
            </AdminLinkButton>
          ) : null}
          {isSuperAdmin ? <UserEditorDrawer createAction={createUserAction} /> : null}
        </Group>
      }
    />
  );
}
