"use client";

import { useTransition } from "react";
import { logoutAdminAction } from "./actions";
import cls from "@/widgets/admin/AdminShell/AdminShell.module.scss";

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={cls.secondaryAction}
      onClick={() =>
        startTransition(async () => {
          await logoutAdminAction();
        })
      }
      disabled={pending}
    >
      {pending ? "Выход..." : "Выйти"}
    </button>
  );
}
