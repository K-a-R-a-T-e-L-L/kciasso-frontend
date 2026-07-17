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
                    <span className={item.role === "SUPER_ADMIN" ? cls.statusPublished : cls.statusDraft}>
                      {item.role === "SUPER_ADMIN" ? "Super-admin" : "Admin"} · {item.isActive ? "активен" : "отключён"}
                    </span>
                  </td>
                  <td>
                    <div className={cls.metaList}>
                      {item.role === "SUPER_ADMIN" ? <span className={cls.metaBadge}>Полный административный доступ</span> : null}
                      {item.canManageSiteSettings ? <span className={cls.metaBadge}>Настройки сайта</span> : null}
                      {item.canManageNews ? <span className={cls.metaBadge}>Новости</span> : null}
                      {item.documentsAccessMode === "ALL" ? <span className={cls.metaBadge}>Все документы</span> : null}
                      {item.documentsAccessMode === "SELECTED_GROUPS" && item.documentGroups.length > 0 ? <span className={cls.metaBadge}>Документы: {item.documentGroups.length} групп</span> : null}
                      {item.role === "ADMIN" && !item.canManageSiteSettings && !item.canManageNews && (item.documentsAccessMode === "NONE" || item.documentGroups.length === 0) ? <span className={cls.metaBadge}>Без доступа к контенту</span> : null}
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
