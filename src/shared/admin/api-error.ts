import type { ErrorDto } from "@/shared/api/generated/types";

type ApiErrorSource = Error & {
  status?: number;
  payload?: unknown;
  cause?: unknown;
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

const validationMessageMap: Record<string, string> = {
  "giaHotlinePhone|matches": "Проверьте формат телефона горячей линии ГИА.",
  "giaHotlinePhone|isRussianPhoneNumber": "Проверьте формат телефона горячей линии ГИА.",
  "informationPhone|matches": "Проверьте формат телефона для справок.",
  "informationPhone|isRussianPhoneNumber": "Проверьте формат телефона для справок.",
  "egeTrustPhone|matches": "Проверьте формат телефона доверия ЕГЭ.",
  "egeTrustPhone|isRussianPhoneNumber": "Проверьте формат телефона доверия ЕГЭ.",
  "email|isEmail": "Проверьте формат электронной почты.",
  "homeSectionsOrder|arrayMinSize": "Порядок секций должен содержать все четыре секции.",
  "homeSectionsOrder|arrayMaxSize": "Порядок секций содержит лишние элементы.",
  "homeSectionsOrder|arrayUnique": "Порядок секций не должен содержать дубликаты.",
  "homeSectionsOrder|isIn": "Порядок секций содержит недопустимое значение.",
};

const ADMIN_BACKEND_UNAVAILABLE_MESSAGE = "Не удалось подключиться к серверу. Проверьте, запущен ли backend.";

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

function hasTransportCause(cause: unknown): boolean {
  if (!(cause instanceof Error)) {
    return false;
  }

  return /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|socket|network/i.test(cause.message) || hasTransportCause(cause.cause);
}

export function isAdminApiTransportError(error: unknown) {
  if (error instanceof AdminApiError) {
    return error.status === 503;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  const source = error as ApiErrorSource;

  if (source.status !== undefined) {
    return false;
  }

  return /fetch failed|network|Failed to fetch/i.test(error.message) || hasTransportCause(source.cause);
}

export function toAdminApiError(error: unknown) {
  if (error instanceof AdminApiError) {
    return error;
  }

  if (isAdminApiTransportError(error)) {
    return new AdminApiError(ADMIN_BACKEND_UNAVAILABLE_MESSAGE, 503);
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

  const payloadMessage = formatApiErrorValue(payload);
  if (payloadMessage) {
    return payloadMessage;
  }

  return normalized.status >= 400 ? fallback : normalized.message || fallback;
}

function formatApiErrorValue(value: unknown, seen = new Set<unknown>()): string | null {
  if (typeof value === "string") {
    const message = value.trim();
    if (!message) return null;
    if (validationMessageMap[message]) return validationMessageMap[message];
    if (/^[A-Za-z][\w.]*\|[A-Za-z][\w]*$/.test(message)) return null;
    return message;
  }

  if (value instanceof Error) {
    return formatApiErrorValue(value.message, seen);
  }

  if (Array.isArray(value)) {
    const messages = value
      .map((item) => formatApiErrorValue(item, seen))
      .filter((item): item is string => Boolean(item));
    const uniqueMessages = [...new Set(messages)];
    return uniqueMessages.length > 0 ? uniqueMessages.join("; ") : null;
  }

  if (typeof value !== "object" || value === null || seen.has(value)) {
    return null;
  }

  seen.add(value);
  const source = value as Record<string, unknown>;

  if (typeof source.errorMessage === "string") {
    return errorMessageMap[source.errorMessage as NonNullable<ErrorDto["errorMessage"]>] ?? source.errorMessage;
  }

  for (const key of ["message", "description", "error", "errors"]) {
    const message = formatApiErrorValue(source[key], seen);
    if (message) return message;
  }

  const nestedMessages = Object.values(source)
    .map((item) => formatApiErrorValue(item, seen))
    .filter((item): item is string => Boolean(item));
  return nestedMessages.length > 0 ? [...new Set(nestedMessages)].join("; ") : null;
}

export function getAdminBackendUnavailableMessage() {
  return ADMIN_BACKEND_UNAVAILABLE_MESSAGE;
}
