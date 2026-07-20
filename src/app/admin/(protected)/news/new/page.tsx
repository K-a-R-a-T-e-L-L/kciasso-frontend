import { redirect } from "next/navigation";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import { isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { getAdminNewsCategories } from "@/shared/api/adapters/admin-news.adapter";
import AdminNewsForm from "@/widgets/admin/AdminNewsForm/AdminNewsForm.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";

export default async function Page() {
  const { token } = await requireAdminSectionToken("news");
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
          <span className={cls.eyebrow}>Новости</span>
          <h1>Новая новость</h1>
          <p>Выберите режим публикации: черновик, публикация сразу или публикация по расписанию.</p>
        </div>
      </div>

      <AdminNewsForm categories={categories} mutation={{ method: "create" }} submitLabel="Создать новость" />
    </section>
  );
}
