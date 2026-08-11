import { redirect } from "next/navigation";
import { Button, Grid, GridCol, Group, Paper, Select, Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { clearAdminTokenCookie, requireSuperAdminToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminUsers } from "@/shared/api/adapters/admin-users.adapter";
import AdminPageHeader from "@/shared/ui/admin/AdminPageHeader";
import AdminLinkButton from "@/shared/ui/admin/AdminLinkButton.client";
import AdminUsersRegistry from "@/widgets/admin/AdminUsersRegistry/AdminUsersRegistry";
import UserEditorDrawer from "@/widgets/admin/AdminUserForm/UserEditorDrawer.client";
import { createUserAction, deleteUserAction, updateUserAction } from "./actions";

type SearchParams = { search?: string; role?: string; status?: string; page?: string };

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const { token, user } = await requireSuperAdminToken();
  let users;
  try {
    users = await getAdminUsers(token, {
      page: Math.max(Number(params.page) || 1, 1),
      limit: 20,
      search: params.search?.trim() || undefined,
      role: params.role === "SUPER_ADMIN" || params.role === "ADMIN" ? params.role : undefined,
      status: params.status === "active" || params.status === "inactive" ? params.status : undefined,
    });
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) { await clearAdminTokenCookie(); redirect("/admin/login"); }
    if (isAdminApiErrorStatus(error, 403)) redirect("/admin/forbidden");
    throw error;
  }

  const search = params.search?.trim().toLocaleLowerCase("ru-RU") ?? "";
  const role = params.role === "SUPER_ADMIN" || params.role === "ADMIN" ? params.role : "";
  const status = params.status === "active" || params.status === "inactive" ? params.status : "";
  const pageSize = 20;
  const totalPages = users.meta.totalPages;
  const currentPage = users.meta.page;
  const pageHref = (page: number) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (role) query.set("role", role);
    if (status) query.set("status", status);
    query.set("page", String(page));
    return `/admin/users?${query}`;
  };

  return (
    <Stack gap="lg">
      <AdminPageHeader
        eyebrow="Пользователи"
        title="Подадмины и права"
        description={`Как super-admin (${user.email}) вы можете создавать пользователей и назначать доступ.`}
        actions={<UserEditorDrawer createAction={createUserAction} />}
      />
      <Paper p="md" shadow="sm">
        <Stack component="form" {...({ action: "/admin/users", method: "get" } as { action: string; method: string })}>
          <Grid align="flex-end">
            <GridCol span={{ base: 12, md: 5 }}><TextInput name="search" label="Поиск" placeholder="Имя или email" defaultValue={params.search ?? ""} /></GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 2 }}><Select name="role" label="Роль" defaultValue={role || null} clearable data={[{ value: "SUPER_ADMIN", label: "Super-admin" }, { value: "ADMIN", label: "Admin" }]} /></GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 2 }}><Select name="status" label="Статус" defaultValue={status || null} clearable data={[{ value: "active", label: "Активен" }, { value: "inactive", label: "Отключён" }]} /></GridCol>
            <GridCol span={{ base: 12, md: 3 }}><Group gap="xs" wrap="nowrap"><Button type="submit" w={38} px={0} aria-label="Найти"><IconSearch size={19} /></Button><AdminLinkButton href="/admin/users" color="red" flex={1}>Сбросить</AdminLinkButton></Group></GridCol>
          </Grid>
        </Stack>
      </Paper>
      <Paper p={{ base: "xs", sm: "md" }} shadow="sm">
        <AdminUsersRegistry users={users.items} currentUserId={user.id} deleteAction={deleteUserAction} updateAction={updateUserAction} />
      </Paper>
      <Paper p="md" shadow="sm"><Group justify="space-between"><Text size="sm" c="dimmed">Показано {users.meta.total ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, users.meta.total)} из {users.meta.total}</Text><Group gap="xs"><AdminLinkButton href={pageHref(currentPage - 1)} variant="default" size="xs" disabled={currentPage === 1}>Назад</AdminLinkButton><Text fw={700}>{currentPage} / {totalPages}</Text><AdminLinkButton href={pageHref(currentPage + 1)} variant="default" size="xs" disabled={currentPage === totalPages}>Вперёд</AdminLinkButton></Group></Group></Paper>
    </Stack>
  );
}
