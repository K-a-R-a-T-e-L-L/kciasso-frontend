import Link from "next/link";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";

export default function Page() {
  return (
    <main className={cls.page}>
      <section className={cls.standaloneCard}>
        <span className={cls.eyebrow}>Admin</span>
        <h1>Недостаточно прав</h1>
        <p>
          Текущая учетная запись авторизована, но не имеет прав для работы с этим разделом.
        </p>
        <div className={cls.actions}>
          <Link href="/admin/news">К новостям</Link>
          <Link href="/admin/login" className={cls.secondaryAction}>
            Сменить аккаунт
          </Link>
        </div>
      </section>
    </main>
  );
}
