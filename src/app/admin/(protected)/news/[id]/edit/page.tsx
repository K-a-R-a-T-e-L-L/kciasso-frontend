import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminNewsById, getAdminNewsCategories } from "@/shared/api/adapters/admin-news.adapter";
import AdminNewsForm from "@/widgets/admin/AdminNewsForm/AdminNewsForm.client";
import { updateNewsAction } from "../../actions";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const newsId = Number(id);

  if (!Number.isFinite(newsId) || newsId <= 0) {
    redirect("/admin/news");
  }

  const { token } = await requireAdminSectionToken("news");
  let news;
  let categories;

  try {
    [news, categories] = await Promise.all([
      getAdminNewsById(token, newsId),
      getAdminNewsCategories(token),
    ]);
  } catch (error) {
    if (isAdminApiErrorStatus(error, 401)) {
      await clearAdminTokenCookie();
      redirect("/admin/login");
    }

    if (isAdminApiErrorStatus(error, 403)) {
      redirect("/admin/forbidden");
    }

    if (isAdminApiErrorStatus(error, 404)) {
      redirect("/admin/news");
    }

    throw error;
  }

  return (
    <section className={cls.section}>
      <div className={cls.sectionHeader}>
        <div>
          <span className={cls.eyebrow}>Новости</span>
          <h1>Редактирование новости</h1>
          <p>Здесь можно менять содержимое, рубрику и сценарий публикации новости.</p>
        </div>
      </div>

      <AdminNewsForm
        categories={categories}
        initialData={news}
        action={updateNewsAction.bind(null, newsId)}
        submitLabel="Сохранить изменения"
      />
    </section>
  );
}
