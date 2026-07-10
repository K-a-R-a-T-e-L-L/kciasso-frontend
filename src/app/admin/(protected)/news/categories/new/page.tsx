import AdminCategoryForm from "@/widgets/admin/AdminCategoryForm/AdminCategoryForm.client";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";
import { createCategoryAction } from "../actions";

export default function Page() {
  return (
    <section className={cls.section}>
      <div className={cls.sectionHeader}>
        <div>
          <span className={cls.eyebrow}>Рубрики</span>
          <h1>Новая рубрика</h1>
          <p>Создайте новую категорию, чтобы использовать её в форме публикации новостей.</p>
        </div>
      </div>

      <AdminCategoryForm action={createCategoryAction} submitLabel="Создать рубрику" />
    </section>
  );
}
