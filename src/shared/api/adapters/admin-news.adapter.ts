import {
  adminNewsControllerCreateCategory,
  adminNewsControllerCreateNews,
  adminNewsControllerDeleteCategory,
  adminNewsControllerDeleteNews,
  adminNewsControllerGetCategories,
  adminNewsControllerGetNews,
  adminNewsControllerGetNewsById,
  adminNewsControllerUpdateCategory,
  adminNewsControllerUpdateNews,
} from "@/shared/api/generated/clients";
import type {
  AdminNewsCategoryDto,
  AdminNewsControllerCreateCategoryMutationRequest,
  AdminNewsControllerCreateNewsMutationRequest,
  AdminNewsControllerGetNewsQueryParams,
  AdminNewsControllerUpdateCategoryMutationRequest,
  AdminNewsControllerUpdateNewsMutationRequest,
  AdminNewsDto,
  PaginatedAdminNewsDto,
} from "@/shared/api/generated/types";
import { toAdminApiError } from "@/shared/admin/api-error";

function buildAdminConfig(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    skipAuthRedirect: true,
  } as const;
}

export async function getAdminNewsList(
  token: string,
  params?: AdminNewsControllerGetNewsQueryParams,
): Promise<PaginatedAdminNewsDto> {
  try {
    return await adminNewsControllerGetNews(params, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function getAdminNewsById(token: string, id: number): Promise<AdminNewsDto> {
  try {
    return await adminNewsControllerGetNewsById(id, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function createAdminNews(
  token: string,
  dto: AdminNewsControllerCreateNewsMutationRequest,
): Promise<AdminNewsDto> {
  try {
    return await adminNewsControllerCreateNews(dto, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function updateAdminNews(
  token: string,
  id: number,
  dto: AdminNewsControllerUpdateNewsMutationRequest,
): Promise<AdminNewsDto> {
  try {
    return await adminNewsControllerUpdateNews(id, dto, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function deleteAdminNews(token: string, id: number) {
  try {
    return await adminNewsControllerDeleteNews(id, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function getAdminNewsCategories(token: string): Promise<AdminNewsCategoryDto[]> {
  try {
    return await adminNewsControllerGetCategories(buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function createAdminNewsCategory(
  token: string,
  dto: AdminNewsControllerCreateCategoryMutationRequest,
): Promise<AdminNewsCategoryDto> {
  try {
    return await adminNewsControllerCreateCategory(dto, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function updateAdminNewsCategory(
  token: string,
  id: number,
  dto: AdminNewsControllerUpdateCategoryMutationRequest,
): Promise<AdminNewsCategoryDto> {
  try {
    return await adminNewsControllerUpdateCategory(id, dto, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function deleteAdminNewsCategory(token: string, id: number): Promise<AdminNewsCategoryDto> {
  try {
    return await adminNewsControllerDeleteCategory(id, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}
