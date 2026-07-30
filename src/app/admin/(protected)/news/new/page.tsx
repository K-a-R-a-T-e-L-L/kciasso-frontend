import { Box, Text, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminNewsCategories } from "@/shared/api/adapters/admin-news.adapter";
import AdminNewsForm from "@/widgets/admin/AdminNewsForm/AdminNewsForm.client";

export default async function Page() {
  const { token } = await requireAdminSectionToken("news");
  let categories;

  try {
    categories = await getAdminNewsCategories(token);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) {
      await clearAdminTokenCookie();
      redirect("/admin/login");
    }

    if (isAdminApiErrorStatus(error, 403)) {
      redirect("/admin/forbidden");
    }

    throw error;
  }

  return (
    <Box component="section" className={""}>
      <Box className={""}>
        <Box>
          <Text className={""}>Новости</Text>
          <Title>Новая новость</Title>
          <Text>Выберите режим публикации: черновик, публикация сразу или публикация по расписанию.</Text>
        </Box>
      </Box>

      <AdminNewsForm categories={categories} mutation={{ method: "create" }} submitLabel="Создать новость" />
    </Box>
  );
}
