import {
  Alert,
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
} from "@mantine/core";

import type { AdminUserDto } from "@/shared/api/generated/types";
import AdminLinkButton from "@/shared/ui/admin/AdminLinkButton.client";
import DeleteNewsButton from "@/widgets/admin/DeleteNewsButton/DeleteNewsButton.client";

function Permissions({ user }: { user: AdminUserDto }) {
  return (
    <Group gap={6} wrap="wrap">
      {user.role === "SUPER_ADMIN" ? <Badge variant="light">Полный доступ</Badge> : null}
      {user.canManageSiteSettings ? <Badge variant="light">Настройки</Badge> : null}
      {user.canManageNews ? <Badge variant="light">Новости</Badge> : null}
      {user.documentsAccessMode === "ALL" ? <Badge variant="light">Все документы</Badge> : null}
      {user.documentsAccessMode === "SELECTED_GROUPS" && user.documentGroups.length > 0
        ? <Badge variant="light">Документы: {user.documentGroups.length}</Badge>
        : null}
      {user.role !== "SUPER_ADMIN" && !user.canManageSiteSettings && !user.canManageNews && user.documentsAccessMode === "NONE"
        ? <Text size="sm" c="dimmed">Права не назначены</Text>
        : null}
    </Group>
  );
}

function Actions({ user, currentUserId, deleteAction }: { user: AdminUserDto; currentUserId: number; deleteAction: (id: number) => Promise<void> }) {
  return (
    <Group gap="xs" wrap="nowrap">
      <AdminLinkButton href={`/admin/users/${user.id}/edit`} variant="light" size="xs">Редактировать</AdminLinkButton>
      {user.id !== currentUserId ? (
        <DeleteNewsButton
          action={deleteAction.bind(null, user.id)}
          confirmText="Удалить пользователя? Его сессии и права будут отключены сразу."
        />
      ) : <Text size="xs" c="dimmed">Текущий аккаунт</Text>}
    </Group>
  );
}

export default function AdminUsersRegistry({
  users,
  currentUserId,
  deleteAction,
}: {
  users: AdminUserDto[];
  currentUserId: number;
  deleteAction: (id: number) => Promise<void>;
}) {
  if (users.length === 0) return <Alert color="blue" title="Пользователи не найдены">Измените параметры поиска или создайте нового администратора.</Alert>;

  return (
    <>
      <TableScrollContainer minWidth={880} visibleFrom="sm" data-testid="users-desktop-table">
        <Table striped highlightOnHover withTableBorder verticalSpacing="sm">
          <TableThead>
            <TableTr>
              <TableTh>Пользователь</TableTh>
              <TableTh>Роль и статус</TableTh>
              <TableTh>Права</TableTh>
              <TableTh w={180}>Действия</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {users.map((item) => (
              <TableTr key={item.id}>
                <TableTd><Stack gap={2}><Text fw={700}>{item.name}</Text><Text size="sm" c="dimmed">{item.email}</Text></Stack></TableTd>
                <TableTd><Stack gap={6} align="flex-start"><Badge color={item.role === "SUPER_ADMIN" ? "blue" : "gray"}>{item.role === "SUPER_ADMIN" ? "Super-admin" : "Admin"}</Badge><Badge color={item.isActive ? "teal" : "red"} variant="light">{item.isActive ? "Активен" : "Отключён"}</Badge></Stack></TableTd>
                <TableTd><Permissions user={item} /></TableTd>
                <TableTd><Actions user={item} currentUserId={currentUserId} deleteAction={deleteAction} /></TableTd>
              </TableTr>
            ))}
          </TableTbody>
        </Table>
      </TableScrollContainer>

      <SimpleGrid cols={1} hiddenFrom="sm" data-testid="users-mobile-cards">
        {users.map((item) => (
          <Card key={item.id} p="md">
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Stack gap={2} miw={0}>
                  <Text fw={800}>{item.name}</Text>
                  <Text size="sm" c="dimmed" truncate>{item.email}</Text>
                </Stack>
                <Badge color={item.isActive ? "teal" : "red"} variant="light">{item.isActive ? "Активен" : "Отключён"}</Badge>
              </Group>
              <Badge color={item.role === "SUPER_ADMIN" ? "blue" : "gray"} w="fit-content">{item.role === "SUPER_ADMIN" ? "Super-admin" : "Admin"}</Badge>
              <Permissions user={item} />
              <Actions user={item} currentUserId={currentUserId} deleteAction={deleteAction} />
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}
