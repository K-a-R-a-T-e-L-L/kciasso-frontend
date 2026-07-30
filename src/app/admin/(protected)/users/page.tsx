import { redirect } from "next/navigation";
import { Anchor, Box, Button, Grid, GridCol, Group, Paper, Select, Stack, TextInput } from "@mantine/core";

import { clearAdminTokenCookie, requireSuperAdminToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminUsers } from "@/shared/api/adapters/admin-users.adapter";
import AdminPageHeader from "@/shared/ui/admin/AdminPageHeader";
import AdminLinkButton from "@/shared/ui/admin/AdminLinkButton.client";
import AdminUsersRegistry from "@/widgets/admin/AdminUsersRegistry/AdminUsersRegistry";
import { deleteUserAction } from "./actions";

type SearchParams = { search?: string; role?: string; status?: string };

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const { token, user } = await requireSuperAdminToken();
  let users;
  try {
    users = await getAdminUsers(token);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) { await clearAdminTokenCookie(); redirect("/admin/login"); }
    if (isAdminApiErrorStatus(error, 403)) redirect("/admin/forbidden");
    throw error;
  }

  const search = params.search?.trim().toLocaleLowerCase("ru-RU") ?? "";
  const role = params.role === "SUPER_ADMIN" || params.role === "ADMIN" ? params.role : "";
  const status = params.status === "active" || params.status === "inactive" ? params.status : "";
  const filtered = users.filter((item) => {
    const matchesSearch = !search || `${item.name} ${item.email}`.toLocaleLowerCase("ru-RU").includes(search);
    const matchesRole = !role || item.role === role;
    const matchesStatus = !status || item.isActive === (status === "active");
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Stack gap="lg">
      <AdminPageHeader
        eyebrow="Пользователи"
        title="Подадмины и права"
        description={`Как super-admin (${user.email}) вы можете создавать пользователей и назначать доступ.`}
        actions={<AdminLinkButton href="/admin/users/new">Добавить пользователя</AdminLinkButton>}
      />
      <Paper p="md" shadow="sm">
        <Box component="form" action="/admin/users" method="get">
          <Grid align="flex-end">
            <GridCol span={{ base: 12, md: 5 }}><TextInput name="search" label="Поиск" placeholder="Имя или email" defaultValue={params.search ?? ""} /></GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 2 }}><Select name="role" label="Роль" defaultValue={role || null} clearable data={[{ value: "SUPER_ADMIN", label: "Super-admin" }, { value: "ADMIN", label: "Admin" }]} /></GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 2 }}><Select name="status" label="Статус" defaultValue={status || null} clearable data={[{ value: "active", label: "Активен" }, { value: "inactive", label: "Отключён" }]} /></GridCol>
            <GridCol span={{ base: 12, md: 3 }}><Group gap="xs" wrap="nowrap"><Button type="submit" flex={1}>Применить</Button><Anchor href="/admin/users" size="sm">Сбросить</Anchor></Group></GridCol>
          </Grid>
        </Box>
      </Paper>
      <Paper p={{ base: "xs", sm: "md" }} shadow="sm">
        <AdminUsersRegistry users={filtered} currentUserId={user.id} deleteAction={deleteUserAction} />
      </Paper>
    </Stack>
  );
}
