import { Box, Text, Title } from "@mantine/core";
import Link from "next/link";
import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminNewsCategories } from "@/shared/api/adapters/admin-news.adapter";
import DeleteNewsButton from "@/widgets/admin/DeleteNewsButton/DeleteNewsButton.client";

import { deleteCategoryAction, moveCategoryAction } from "./actions";
import AdminCategoryReorder from "@/widgets/admin/AdminCategoryReorder/AdminCategoryReorder.client";

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
    <Box component="section" className={""}>
      <Box className={""}>
        <Box>
          <Text className={""}>Рубрики</Text>
          <Title>Рубрики новостей</Title>
          <Text>
            Пользователь {user.email} может создавать, редактировать и удалять пустые рубрики. Если к рубрике
            уже привязаны новости, сначала перенесите их в другую рубрику.
          </Text>
        </Box>
        <Box className={""}>
          <Link href="/admin/news" className={""}>
            К новостям
          </Link>
          <Link href="/admin/news/categories/new" className={""}>
            Создать рубрику
          </Link>
        </Box>
      </Box>

      <Box className={""}>
        <Box className={""}><AdminCategoryReorder initialCategories={categories} move={moveCategoryAction} deleteCategory={async (id) => { "use server"; await deleteCategoryAction(id); }} /></Box>

        {categories.length === 0 ? <Text className={""}>Рубрики пока не созданы.</Text> : null}
      </Box>
    </Box>
  );
}
