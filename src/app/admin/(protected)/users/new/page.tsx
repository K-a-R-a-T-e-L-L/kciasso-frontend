import { requireSuperAdmin } from "@/shared/admin/auth";
import AdminUserForm from "@/widgets/admin/AdminUserForm/AdminUserForm.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";
import { createUserAction } from "../actions";

export default async function Page() {
  await requireSuperAdmin();

  return (
    <section className={cls.section}>
      <div className={cls.sectionHeader}>
        <div>
          <span className={cls.eyebrow}>Пользователи</span>
          <h1>Новый подадмин</h1>
          <p>Создайте нового администратора и сразу задайте ему права доступа по разделам.</p>
        </div>
      </div>

      <AdminUserForm includePassword action={createUserAction} submitLabel="Создать пользователя" />
    </section>
  );
}
