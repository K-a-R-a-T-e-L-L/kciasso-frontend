import {
  userControllerCreateAdminUser,
  userControllerDeleteAdminUser,
  userControllerGetAdminUserById,
  userControllerGetAdminUsers,
  userControllerUpdateAdminUser,
} from "@/shared/api/generated/clients";
import type {
  AdminUserDto,
  CreateAdminUserDto,
  PaginatedAdminUsersDto,
  UserControllerGetAdminUsersQueryParams,
  UserControllerUpdateAdminUserMutationRequest,
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

export async function getAdminUsers(token: string, query: UserControllerGetAdminUsersQueryParams = {}): Promise<PaginatedAdminUsersDto> {
  try {
    return await userControllerGetAdminUsers(query, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function getAdminUserById(token: string, id: number): Promise<AdminUserDto> {
  try {
    return await userControllerGetAdminUserById(id, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function createAdminUser(token: string, dto: CreateAdminUserDto): Promise<AdminUserDto> {
  try {
    return await userControllerCreateAdminUser(dto, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function updateAdminUser(
  token: string,
  id: number,
  dto: UserControllerUpdateAdminUserMutationRequest,
): Promise<AdminUserDto> {
  try {
    return await userControllerUpdateAdminUser(id, dto, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function deleteAdminUser(token: string, id: number): Promise<AdminUserDto> {
  try {
    return await userControllerDeleteAdminUser(id, buildAdminConfig(token));
  } catch (error) {
    throw toAdminApiError(error);
  }
}
