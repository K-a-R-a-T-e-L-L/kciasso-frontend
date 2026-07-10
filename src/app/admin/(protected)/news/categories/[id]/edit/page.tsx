import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminNewsCategories } from "@/shared/api/adapters/admin-news.adapter";
import AdminCategoryForm from "@/widgets/admin/AdminCategoryForm/AdminCategoryForm.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";
import { updateCategoryAction } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isFinite(categoryId) || categoryId <= 0) {
    redirect("/admin/news/categories");
  }

  const { token } = await requireAdminSectionToken("news");
  let category;

  try {
    const categories = await getAdminNewsCategories(token);
    category = categories.find((item) => item.id === categoryId);
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

  if (!category) {
    redirect("/admin/news/categories");
  }

  return (
    <section className={cls.section}>
      <div className={cls.sectionHeader}>
        <div>
          <span className={cls.eyebrow}>Рубрики</span>
          <h1>Редактирование рубрики</h1>
          <p>Изменения сразу повлияют на список категорий в форме новостей.</p>
        </div>
      </div>

      <AdminCategoryForm
        initialData={category}
        action={updateCategoryAction.bind(null, categoryId)}
        submitLabel="Сохранить рубрику"
      />
    </section>
  );
}
