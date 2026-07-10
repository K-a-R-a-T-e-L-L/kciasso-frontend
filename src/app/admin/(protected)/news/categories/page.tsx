import Link from "next/link";
import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminNewsCategories } from "@/shared/api/adapters/admin-news.adapter";
import DeleteNewsButton from "@/widgets/admin/DeleteNewsButton/DeleteNewsButton.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";
import { deleteCategoryAction } from "./actions";

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
    <section className={cls.section}>
      <div className={cls.sectionHeader}>
        <div>
          <span className={cls.eyebrow}>Рубрики</span>
          <h1>Рубрики новостей</h1>
          <p>
            Пользователь {user.email} может создавать, редактировать и удалять пустые рубрики. Если к рубрике
            уже привязаны новости, сначала перенесите их в другую рубрику.
          </p>
        </div>
        <div className={cls.headerActions}>
          <Link href="/admin/news" className={cls.secondaryAction}>
            К новостям
          </Link>
          <Link href="/admin/news/categories/new" className={cls.primaryAction}>
            Создать рубрику
          </Link>
        </div>
      </div>

      <div className={cls.tableCard}>
        <div className={cls.tableWrap}>
          <table className={cls.table}>
            <thead>
              <tr>
                <th>Название</th>
                <th>Slug</th>
                <th>Порядок</th>
                <th>Новостей</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <span>{item.description ?? "Без описания"}</span>
                  </td>
                  <td>{item.slug}</td>
                  <td>{item.order}</td>
                  <td>{item.newsCount}</td>
                  <td>
                    <span className={item.isActive ? cls.statusPublished : cls.statusDraft}>
                      {item.isActive ? "Активна" : "Отключена"}
                    </span>
                  </td>
                  <td>
                    <div className={cls.tableActions}>
                      <Link href={`/admin/news/categories/${item.id}/edit`}>Редактировать</Link>
                      {item.newsCount === 0 ? (
                        <DeleteNewsButton
                          action={deleteCategoryAction.bind(null, item.id)}
                          confirmText="Удалить рубрику? Действие будет выполнено сразу."
                          idleLabel="Удалить"
                          pendingLabel="Удаление..."
                        />
                      ) : (
                        <Link href={`/admin/news?category=${item.slug}`}>Открыть новости</Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categories.length === 0 ? <p className={cls.emptyState}>Рубрики пока не созданы.</p> : null}
      </div>
    </section>
  );
}
