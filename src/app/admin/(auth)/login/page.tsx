import { redirect } from "next/navigation";
import { Box, Paper, Stack, Text, Title } from "@mantine/core";
import type { CurrentUserDto } from "@/shared/api/generated/types";
import { isAdminApiTransportError } from "@/shared/admin/api-error";
import { getOptionalAdmin } from "@/shared/admin/auth";
import AdminBackendUnavailable from "@/widgets/admin/AdminBackendUnavailable/AdminBackendUnavailable";
import AdminLoginForm from "@/widgets/admin/AdminLoginForm/AdminLoginForm.client";

export default async function Page() {
  let admin: CurrentUserDto | null = null;
  try { admin = await getOptionalAdmin(); } catch (error) {
    if (isAdminApiTransportError(error)) return <Box component="main" p="xl"><AdminBackendUnavailable retryHref="/admin/login" /></Box>;
    throw error;
  }
  if (admin) redirect("/admin");
  return <Box component="main" p={{ base: "md", sm: "xl" }} mih="100vh" bg="kciassoBlue.0">
    <Paper maw={560} mx="auto" p={{ base: "lg", sm: "xl" }} shadow="md">
      <Stack gap="md"><Text size="xs" fw={800} tt="uppercase" c="kciassoBlue.6">Admin</Text>
        <Title order={1}>Вход в панель управления</Title>
        <Text c="dimmed">Используйте учетную запись с правами администратора.</Text>
        <AdminLoginForm />
      </Stack>
    </Paper>
  </Box>;
}
