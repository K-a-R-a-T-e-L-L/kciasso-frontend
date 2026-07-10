import { userControllerAuthenticate, userControllerMe } from "@/shared/api/generated/clients";
import type { CurrentUserDto, Session } from "@/shared/api/generated/types";
import { toAdminApiError } from "@/shared/admin/api-error";

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

export async function loginAdmin(input: LoginAdminInput): Promise<Session> {
  try {
    return await userControllerAuthenticate(
      {
        email: input.email,
        password: input.password,
      } as never,
      buildAuthConfig(),
    );
  } catch (error) {
    throw toAdminApiError(error);
  }
}

export async function getCurrentAdmin(token: string): Promise<CurrentUserDto> {
  try {
    return await userControllerMe(buildAuthConfig({ token }));
  } catch (error) {
    throw toAdminApiError(error);
  }
}
