import { userControllerAuthenticate, userControllerMe } from "@/shared/api/generated/clients";
import type { CurrentUserDto } from "@/shared/api/generated/types";
import { toAdminApiError } from "@/shared/admin/api-error";
import { adminAuthEndpoint } from "@/shared/admin/session-config";

type LoginAdminInput = {
  email: string;
  password: string;
};

type AuthRequestConfig = {
  token?: string;
};

function buildAuthConfig(config?: AuthRequestConfig) {
  const headers = new Headers();

  if (config?.token) {
    headers.set("Authorization", `Bearer ${config.token}`);
  }

  return {
    headers,
    skipAuthRedirect: true,
  } as const;
}

export type AdminAuthSession = { token: string; refreshToken: string };

export async function loginAdmin(input: LoginAdminInput): Promise<AdminAuthSession> {
  try {
    return await userControllerAuthenticate(
      {
        email: input.email,
        password: input.password,
      } as never,
      buildAuthConfig(),
    ) as unknown as AdminAuthSession;
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function refreshAdmin(refreshToken: string): Promise<AdminAuthSession> {
  const response = await fetch(adminAuthEndpoint(
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
    "refresh",
  ), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
  if (!response.ok) throw toAdminApiError(response);
  return response.json() as Promise<AdminAuthSession>;
}

export async function getCurrentAdmin(token: string): Promise<CurrentUserDto> {
  try {
    return await userControllerMe(buildAuthConfig({ token }));
  } catch (error) {
    throw toAdminApiError(error);
  }
}
