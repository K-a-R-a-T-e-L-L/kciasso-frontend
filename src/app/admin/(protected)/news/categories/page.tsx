import { Group, Paper, Stack } from "@mantine/core";
import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminNewsCategories } from "@/shared/api/adapters/admin-news.adapter";
import { deleteCategoryAction, moveCategoryAction } from "./actions";
import AdminCategoryReorder from "@/widgets/admin/AdminCategoryReorder/AdminCategoryReorder.client";
import AdminPageHeader from "@/shared/ui/admin/AdminPageHeader";
import AdminLinkButton from "@/shared/ui/admin/AdminLinkButton.client";

export default async function Page() {
  const { token, user } = await requireAdminSectionToken("news");
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
    <Stack gap="lg">
      <AdminPageHeader
        eyebrow="Рубрики"
        title="Рубрики новостей"
        description={`Пользователь ${user.email} может создавать, редактировать и удалять пустые рубрики.`}
        actions={(
          <Group>
            <AdminLinkButton href="/admin/news" variant="light">К новостям</AdminLinkButton>
            <AdminLinkButton href="/admin/news/categories/new">Создать рубрику</AdminLinkButton>
          </Group>
        )}
      />
      <Paper p={{ base: "xs", sm: "md" }} withBorder>
        <AdminCategoryReorder
          initialCategories={categories}
          move={moveCategoryAction}
          deleteCategory={async (id) => { "use server"; await deleteCategoryAction(id); }}
        />
      </Paper>
    </Stack>
  );
}
