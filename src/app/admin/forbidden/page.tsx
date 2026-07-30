import { Box, Group, Paper, Stack, Text, Title } from "@mantine/core";
import AdminLinkButton from "@/shared/ui/admin/AdminLinkButton.client";

export default function Page() {
  return <Box component="main" p={{ base: "md", sm: "xl" }} mih="100vh" bg="kciassoBlue.0">
    <Paper maw={720} mx="auto" p="xl" shadow="md"><Stack gap="md">
      <Text size="xs" fw={800} tt="uppercase" c="kciassoBlue.6">Admin</Text>
      <Title order={1}>Недостаточно прав</Title>
      <Text c="dimmed">Текущая учетная запись авторизована, но не имеет прав для работы с этим разделом.</Text>
      <Group><AdminLinkButton href="/admin/news">К новостям</AdminLinkButton><AdminLinkButton href="/admin/login" variant="default">Сменить аккаунт</AdminLinkButton></Group>
    </Stack></Paper>
  </Box>;
}
