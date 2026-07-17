import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireSuperAdminToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminUserById } from "@/shared/api/adapters/admin-users.adapter";
import AdminUserForm from "@/widgets/admin/AdminUserForm/AdminUserForm.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";
import { updateUserAction } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isFinite(userId) || userId <= 0) {
    redirect("/admin/users");
  }

  const { token } = await requireSuperAdminToken();
  let user;

  try {
    user = await getAdminUserById(token, userId);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) {
      await clearAdminTokenCookie();
      redirect("/admin/login");
    }

    if (isAdminApiErrorStatus(error, 403)) {
      redirect("/admin/forbidden");
    }

    if (isAdminApiErrorStatus(error, 404)) {
      redirect("/admin/users");
    }

    throw error;
  }

  return (
    <section className={cls.section}>
      <div className={cls.sectionHeader}>
        <div>
          <span className={cls.eyebrow}>Пользователи</span>
          <h1>Редактирование пользователя</h1>
          <p>Измените профиль администратора и обновите набор доступных ему разделов.</p>
        </div>
      </div>

      <AdminUserForm
        initialData={user}
        action={updateUserAction.bind(null, userId)}
        submitLabel="Сохранить пользователя"
      />
    </section>
  );
}
