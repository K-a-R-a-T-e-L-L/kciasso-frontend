"use server";

import { redirect } from "next/navigation";
import { getAdminApiErrorMessage, isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { clearAdminTokenCookie, requireSuperAdminToken } from "@/shared/admin/auth";
import {
  createAdminUser,
  deleteAdminUser,
  updateAdminUser,
  updateAdminUserPermissions,
} from "@/shared/api/adapters/admin-users.adapter";
import type { AdminUserFormState } from "@/widgets/admin/AdminUserForm/AdminUserForm.types";

function parseUserFormData(formData: FormData) {
  const rawIsSuperAdmin = String(formData.get("isSuperAdmin") ?? "").trim().toLowerCase();

  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    isSuperAdmin: rawIsSuperAdmin === "on" || rawIsSuperAdmin === "true",
    sectionIds: formData
      .getAll("sectionIds")
      .map((item) => String(item).trim())
      .filter(Boolean),
  };
}

async function handleUserError(error: unknown, fallback: string): Promise<AdminUserFormState> {
  if (isAdminApiErrorStatus(error, 401)) {
    await clearAdminTokenCookie();
    redirect("/admin/login");
  }

  if (isAdminApiErrorStatus(error, 403)) {
    redirect("/admin/forbidden");
  }

  if (isAdminApiErrorStatus(error, 404)) {
    return {
      error: "Пользователь или раздел не найден.",
    };
  }

  return {
    error: getAdminApiErrorMessage(error, fallback),
  };
}

export async function createUserAction(_: AdminUserFormState, formData: FormData): Promise<AdminUserFormState> {
  const { token } = await requireSuperAdminToken();
  const payload = parseUserFormData(formData);

  if (!payload.name || !payload.email || !payload.password) {
    return {
      error: "Заполните имя, email и пароль пользователя.",
    };
  }

  try {
    await createAdminUser(token, payload);
  } catch (error) {
    return handleUserError(error, "Не удалось создать пользователя.");
  }

  redirect("/admin/users");
}

export async function deleteUserAction(id: number) {
  const { token } = await requireSuperAdminToken();

  try {
    await deleteAdminUser(token, id);
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

  redirect("/admin/users");
}

export async function updateUserAction(
  id: number,
  _: AdminUserFormState,
  formData: FormData,
): Promise<AdminUserFormState> {
  const { token } = await requireSuperAdminToken();
  const payload = parseUserFormData(formData);

  if (!payload.name || !payload.email) {
    return {
      error: "Заполните имя и email пользователя.",
    };
  }

  try {
    await updateAdminUser(token, id, {
      name: payload.name,
      email: payload.email,
      isSuperAdmin: payload.isSuperAdmin,
    });
    await updateAdminUserPermissions(token, id, {
      sectionIds: payload.sectionIds,
    });
  } catch (error) {
    return handleUserError(error, "Не удалось сохранить пользователя.");
  }

  redirect("/admin/users");
}
