import type { ErrorDto } from "@/shared/api/generated/types";

type ApiErrorSource = Error & {
  status?: number;
  payload?: unknown;
};

const errorMessageMap: Partial<Record<NonNullable<ErrorDto["errorMessage"]>, string>> = {
  AUTH_FAIL: "Неверный email или пароль.",
  INVALID_QUERY_STRING: "Переданы некорректные параметры запроса.",
  ENTITY_NOT_FOUND: "Запрашиваемая запись не найдена.",
  ENTITY_CREATION_FAIL: "Не удалось создать запись.",
  NOT_ENOUGH_RIGHTS: "Недостаточно прав для выполнения действия.",
  NOT_AUTH: "Требуется авторизация.",
  EMAIL_ALREADY_IN_USE: "Пользователь с таким email уже существует.",
  SLUG_ALREADY_IN_USE: "Указанный slug уже используется.",
};

export class AdminApiError extends Error {
  status: number;
  payload?: ErrorDto | unknown;

  constructor(message: string, status: number, payload?: ErrorDto | unknown) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function toAdminApiError(error: unknown) {
  if (error instanceof AdminApiError) {
    return error;
  }

  if (error instanceof Error) {
    const source = error as ApiErrorSource;
    const status = source.status ?? 500;
    const payload = source.payload;
    const payloadMessage =
      typeof payload === "object" &&
      payload !== null &&
      "description" in payload &&
      typeof payload.description === "string"
        ? payload.description
        : undefined;

    return new AdminApiError(payloadMessage ?? error.message, status, payload);
  }

  return new AdminApiError("Unexpected admin API error", 500);
}

export function isAdminApiErrorStatus(error: unknown, status: number) {
  return toAdminApiError(error).status === status;
}

export function getAdminApiErrorMessage(error: unknown, fallback: string) {
  const normalized = toAdminApiError(error);
  const payload = normalized.payload;

  if (typeof payload === "object" && payload !== null) {
    if ("errorMessage" in payload && typeof payload.errorMessage === "string") {
      return errorMessageMap[payload.errorMessage as NonNullable<ErrorDto["errorMessage"]>] ?? payload.errorMessage;
    }

    if ("message" in payload && Array.isArray(payload.message) && payload.message.length > 0) {
      return payload.message.join(", ");
    }

    if ("description" in payload && typeof payload.description === "string" && payload.description.trim()) {
      return payload.description;
    }

    if ("error" in payload && typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  }

  return normalized.message || fallback;
}
