import { Alert, Group, Stack, Text, Title } from "@mantine/core";
import { getAdminBackendUnavailableMessage } from "@/shared/admin/api-error";
import AdminLinkButton from "@/shared/ui/admin/AdminLinkButton.client";

export default function AdminBackendUnavailable({ retryHref = "/admin/login" }: { retryHref?: string }) {
  return <Stack maw={720} mx="auto" p="xl">
    <Text size="xs" fw={800} tt="uppercase" c="kciassoBlue.6">Admin</Text>
    <Title order={1}>Панель временно недоступна</Title>
    <Alert color="red">{getAdminBackendUnavailableMessage()}</Alert>
    <Group><AdminLinkButton href={retryHref}>Повторить попытку</AdminLinkButton><AdminLinkButton href="/" variant="default">Вернуться на сайт</AdminLinkButton></Group>
  </Stack>;
}
