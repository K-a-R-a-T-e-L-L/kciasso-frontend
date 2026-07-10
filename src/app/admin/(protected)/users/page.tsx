import Link from "next/link";
import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireSuperAdminToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminUsers } from "@/shared/api/adapters/admin-users.adapter";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";
import DeleteNewsButton from "@/widgets/admin/DeleteNewsButton/DeleteNewsButton.client";
import { deleteUserAction } from "./actions";

export default async function Page() {
  const { token, user } = await requireSuperAdminToken();
  let users;

  try {
    users = await getAdminUsers(token);
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
          <h1>Подадмины и права</h1>
          <p>Как super-admin ({user.email}) вы можете создавать подадминов и назначать им доступ к разделам.</p>
        </div>
        <Link href="/admin/users/new" className={cls.primaryAction}>
          Создать пользователя
        </Link>
      </div>

      <div className={cls.tableCard}>
        <div className={cls.tableWrap}>
          <table className={cls.table}>
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Роль</th>
                <th>Права</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                    <span>{item.email}</span>
                  </td>
                  <td>
                    <span className={item.isSuperAdmin ? cls.statusPublished : cls.statusDraft}>
                      {item.isSuperAdmin ? "Super-admin" : "Admin"}
                    </span>
                  </td>
                  <td>
                    <div className={cls.metaList}>
                      {item.permissions.length > 0 ? (
                        item.permissions.map((permission) => (
                          <span key={permission} className={cls.metaBadge}>
                            {permission}
                          </span>
                        ))
                      ) : (
                        <span className={cls.metaBadge}>Без прав</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={cls.tableActions}>
                      <Link href={`/admin/users/${item.id}/edit`}>Редактировать</Link>
                      {item.id === user.id ? (
                        <span>Текущий аккаунт</span>
                      ) : (
                        <DeleteNewsButton
                          action={deleteUserAction.bind(null, item.id)}
                          confirmText="Удалить пользователя? Его сессии и права будут отключены сразу."
                          idleLabel="Удалить"
                          pendingLabel="Удаление..."
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
