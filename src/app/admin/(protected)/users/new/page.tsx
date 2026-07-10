import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireSuperAdminToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminSections } from "@/shared/api/adapters/admin-users.adapter";
import AdminUserForm from "@/widgets/admin/AdminUserForm/AdminUserForm.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";
import { createUserAction } from "../actions";

export default async function Page() {
  const { token } = await requireSuperAdminToken();
  let sections;

  try {
    sections = await getAdminSections(token);
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
    <section className={cls.section}>
      <div className={cls.sectionHeader}>
        <div>
          <span className={cls.eyebrow}>Пользователи</span>
          <h1>Новый подадмин</h1>
          <p>Создайте нового администратора и сразу задайте ему права доступа по разделам.</p>
        </div>
      </div>

      <AdminUserForm sections={sections} includePassword action={createUserAction} submitLabel="Создать пользователя" />
    </section>
  );
}
