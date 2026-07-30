import { Box, Text, Title } from "@mantine/core";
import { requireSuperAdmin } from "@/shared/admin/auth";
import AdminUserForm from "@/widgets/admin/AdminUserForm/AdminUserForm.client";

import { createUserAction } from "../actions";

export default async function Page() {
  await requireSuperAdmin();

  return (
    <Box component="section" className={""}>
      <Box className={""}>
        <Box>
          <Text className={""}>Пользователи</Text>
          <Title>Новый подадмин</Title>
          <Text>Создайте нового администратора и сразу задайте ему права доступа по разделам.</Text>
        </Box>
      </Box>

      <AdminUserForm includePassword action={createUserAction} submitLabel="Создать пользователя" />
    </Box>
  );
}
