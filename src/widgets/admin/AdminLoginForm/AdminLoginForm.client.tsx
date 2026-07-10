"use client";

import { useActionState } from "react";
import { loginAdminAction } from "@/app/admin/(auth)/login/actions";
import { loginFormInitialState } from "./AdminLoginForm.types";
import cls from "./AdminLoginForm.module.scss";

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdminAction, loginFormInitialState);

  return (
    <form className={cls.form} action={formAction}>
      <label>
        <span>Email</span>
        <input type="email" name="email" autoComplete="username" required />
      </label>

      <label>
        <span>Пароль</span>
        <input type="password" name="password" autoComplete="current-password" required />
      </label>

      {state.error ? <p className={cls.error}>{state.error}</p> : null}

      <button type="submit" disabled={pending}>
        {pending ? "Выполняется вход..." : "Войти"}
      </button>
    </form>
  );
}
