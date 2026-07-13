import Link from "next/link";
import { getAdminBackendUnavailableMessage } from "@/shared/admin/api-error";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";

type Props = {
  retryHref?: string;
};

export default function AdminBackendUnavailable({ retryHref = "/admin/login" }: Props) {
  return (
    <section className={cls.standaloneCard}>
      <span className={cls.eyebrow}>Admin</span>
      <h1>Панель временно недоступна</h1>
      <p>{getAdminBackendUnavailableMessage()}</p>
      <div className={cls.actions}>
        <Link href={retryHref} className={cls.primaryAction}>
          Повторить попытку
        </Link>
        <Link href="/" className={cls.secondaryAction}>
          Вернуться на сайт
        </Link>
      </div>
    </section>
  );
}
