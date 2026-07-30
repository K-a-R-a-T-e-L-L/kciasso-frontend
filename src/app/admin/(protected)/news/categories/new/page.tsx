import { Box, Text, Title } from "@mantine/core";
import AdminCategoryForm from "@/widgets/admin/AdminCategoryForm/AdminCategoryForm.client";

import { createCategoryAction } from "../actions";

export default function Page() {
  return (
    <Box component="section" className={""}>
      <Box className={""}>
        <Box>
          <Text className={""}>Рубрики</Text>
          <Title>Новая рубрика</Title>
          <Text>Создайте новую категорию, чтобы использовать её в форме публикации новостей.</Text>
        </Box>
      </Box>

      <AdminCategoryForm action={createCategoryAction} submitLabel="Создать рубрику" />
    </Box>
  );
}
