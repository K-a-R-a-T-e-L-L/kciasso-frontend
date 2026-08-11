"use client";

import { Drawer } from "@mantine/core";
import { useRouter } from "next/navigation";
import type { AdminNewsCategoryDto } from "@/shared/api/generated/types";
import AdminCategoryForm from "./AdminCategoryForm.client";
import type { AdminCategoryFormState } from "./AdminCategoryForm.types";

type Props = {
  opened: boolean;
  onClose: () => void;
  initialData?: AdminNewsCategoryDto;
  action: (state: AdminCategoryFormState, formData: FormData) => Promise<AdminCategoryFormState>;
};

export default function CategoryEditorDrawer({ opened, onClose, initialData, action }: Props) {
  const router = useRouter();
  const saved = () => { onClose(); router.refresh(); };
  return <Drawer opened={opened} onClose={onClose} position="right" size="lg"
    title={initialData ? "Редактирование рубрики" : "Новая рубрика"}>
    <AdminCategoryForm key={initialData?.id ?? "new"} initialData={initialData} action={action}
      submitLabel={initialData ? "Сохранить рубрику" : "Создать рубрику"} onCancel={onClose} onSaved={saved} />
  </Drawer>;
}
