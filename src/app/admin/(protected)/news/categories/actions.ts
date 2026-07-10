"use server";

import { redirect } from "next/navigation";
import { getAdminApiErrorMessage, isAdminApiErrorStatus } from "@/shared/admin/api-error";
import { clearAdminTokenCookie, requireAdminSectionToken } from "@/shared/admin/auth";
import {
  createAdminNewsCategory,
  deleteAdminNewsCategory,
  updateAdminNewsCategory,
} from "@/shared/api/adapters/admin-news.adapter";
import type { AdminCategoryFormState } from "@/widgets/admin/AdminCategoryForm/AdminCategoryForm.types";

function parseCategoryFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);

  return {
    title,
    slug,
    description: description || undefined,
    order: Number.isFinite(order) ? order : 0,
    isActive: formData.get("isActive") === "on",
  };
}

async function handleCategoryError(error: unknown, fallback: string): Promise<AdminCategoryFormState> {
  if (isAdminApiErrorStatus(error, 401)) {
    await clearAdminTokenCookie();
    redirect("/admin/login");
  }

  if (isAdminApiErrorStatus(error, 403)) {
    redirect("/admin/forbidden");
  }

  if (isAdminApiErrorStatus(error, 404)) {
    return {
      error: "Категория не найдена.",
    };
  }

  return {
    error: getAdminApiErrorMessage(error, fallback),
  };
}

export async function createCategoryAction(
  _: AdminCategoryFormState,
  formData: FormData,
): Promise<AdminCategoryFormState> {
  const { token } = await requireAdminSectionToken("news");
  const payload = parseCategoryFormData(formData);

  if (!payload.title || !payload.slug) {
    return {
      error: "Заполните название и slug рубрики.",
    };
  }

  try {
    await createAdminNewsCategory(token, payload);
  } catch (error) {
    return handleCategoryError(error, "Не удалось создать рубрику.");
  }

  redirect("/admin/news/categories");
}

export async function updateCategoryAction(
  id: number,
  _: AdminCategoryFormState,
  formData: FormData,
): Promise<AdminCategoryFormState> {
  const { token } = await requireAdminSectionToken("news");
  const payload = parseCategoryFormData(formData);

  if (!payload.title || !payload.slug) {
    return {
      error: "Заполните название и slug рубрики.",
    };
  }

  try {
    await updateAdminNewsCategory(token, id, payload);
  } catch (error) {
    return handleCategoryError(error, "Не удалось сохранить рубрику.");
  }

  redirect("/admin/news/categories");
}

export async function deleteCategoryAction(id: number) {
  const { token } = await requireAdminSectionToken("news");

  try {
    await deleteAdminNewsCategory(token, id);
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

  redirect("/admin/news/categories");
}
