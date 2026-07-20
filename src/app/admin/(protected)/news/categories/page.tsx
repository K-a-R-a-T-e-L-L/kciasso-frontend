import Link from "next/link";
import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminNewsCategories } from "@/shared/api/adapters/admin-news.adapter";
import DeleteNewsButton from "@/widgets/admin/DeleteNewsButton/DeleteNewsButton.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";
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
        <div className={cls.tableWrap}><AdminCategoryReorder initialCategories={categories} move={moveCategoryAction} deleteCategory={async (id) => { "use server"; await deleteCategoryAction(id); }} /></div>

        {categories.length === 0 ? <p className={cls.emptyState}>Рубрики пока не созданы.</p> : null}
      </div>
    </section>
  );
}
