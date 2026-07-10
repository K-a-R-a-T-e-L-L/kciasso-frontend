"use server";

import { redirect } from "next/navigation";
import { getAdminApiErrorMessage } from "@/shared/admin/api-error";
import { loginAdmin } from "@/shared/api/adapters/admin-auth.adapter";
import { setAdminTokenCookie } from "@/shared/admin/auth";
import type { LoginFormState } from "@/widgets/admin/AdminLoginForm/AdminLoginForm.types";

export async function loginAdminAction(_: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Укажите email и пароль.",
    };
  }

  try {
    const session = await loginAdmin({ email, password });

    if (!session.token) {
      return {
        error: "Сервер не вернул токен авторизации.",
      };
    }

    await setAdminTokenCookie(session.token);
  } catch (error) {
    return {
      error: getAdminApiErrorMessage(error, "Не удалось выполнить вход."),
    };
  }

  redirect("/admin/news");
}
