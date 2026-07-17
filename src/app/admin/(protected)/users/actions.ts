"use server";

import { redirect } from "next/navigation";
import { getAdminApiErrorMessage, isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { clearAdminTokenCookie, requireSuperAdminToken } from "@/shared/admin/auth";
import {
  createAdminUser,
  deleteAdminUser,
  updateAdminUser,
} from "@/shared/api/adapters/admin-users.adapter";
import type { CreateAdminUserDto } from "@/shared/api/generated/types";
import type { AdminUserFormState } from "@/widgets/admin/AdminUserForm/AdminUserForm.types";

function parseUserFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "ADMIN") as "SUPER_ADMIN" | "ADMIN",
    isActive: formData.get("isActive") === "on",
    canManageSiteSettings: formData.get("canManageSiteSettings") === "on",
    canManageNews: formData.get("canManageNews") === "on",
    documentsAccessMode: String(formData.get("documentsAccessMode") ?? "NONE") as "NONE" | "ALL" | "SELECTED_GROUPS",
    documentGroups: formData
      .getAll("documentGroups")
      .map((item) => String(item).trim())
      .filter(Boolean) as CreateAdminUserDto["documentGroups"],
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
      role: payload.role,
      isActive: payload.isActive,
      canManageSiteSettings: payload.canManageSiteSettings,
      canManageNews: payload.canManageNews,
      documentsAccessMode: payload.documentsAccessMode,
      documentGroups: payload.documentGroups,
      ...(payload.password ? { password: payload.password } : {}),
    });
  } catch (error) {
    return handleUserError(error, "Не удалось сохранить пользователя.");
  }

  redirect("/admin/users");
}
