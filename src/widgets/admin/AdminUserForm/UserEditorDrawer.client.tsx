"use client";

import { Button, Drawer } from "@mantine/core";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminUserDto } from "@/shared/api/generated/types";
import type { AdminUserFormState } from "./AdminUserForm.types";
import AdminUserForm from "./AdminUserForm.client";

export default function UserEditorDrawer({ user, createAction, updateAction }: {
  user?: AdminUserDto;
  createAction?: (state: AdminUserFormState, formData: FormData) => Promise<AdminUserFormState>;
  updateAction?: (id: number, state: AdminUserFormState, formData: FormData) => Promise<AdminUserFormState>;
}) {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const close = () => setOpened(false);
  const saved = () => { close(); router.refresh(); };
  const action = user && updateAction ? updateAction.bind(null, user.id) : createAction;
  if (!action) return null;
  return <>
    <Button variant={user ? "light" : "filled"} size={user ? "xs" : "sm"}
      leftSection={user ? <IconEdit size={15} /> : <IconPlus size={18} />} onClick={() => setOpened(true)}>
      {user ? "Редактировать" : "Добавить пользователя"}
    </Button>
    <Drawer opened={opened} onClose={close} position="right" size="xl"
      title={user ? "Редактирование пользователя" : "Новый подадмин"}>
      <AdminUserForm key={user?.id ?? "new"} initialData={user} includePassword={!user} action={action}
        submitLabel={user ? "Сохранить пользователя" : "Создать пользователя"} onSaved={saved} onCancel={close} />
    </Drawer>
  </>;
}
