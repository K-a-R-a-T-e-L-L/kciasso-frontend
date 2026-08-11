export type CarouselFormFields = {
  title: string;
  subtitle: string;
  primaryUrl: string;
  secondaryUrl: string;
};

const CAROUSEL_ERROR_FALLBACK =
  "Не удалось сохранить изменения карусели.";

function extractErrorMessages(value: unknown): string[] {
  if (typeof value === "string") {
    const message = value.trim();
    return message ? [message] : [];
  }
  if (Array.isArray(value)) return value.flatMap(extractErrorMessages);
  if (!value || typeof value !== "object") return [];

  const payload = value as Record<string, unknown>;
  for (const key of ["message", "errorMessage", "errors", "error"]) {
    const messages = extractErrorMessages(payload[key]);
    if (messages.length > 0) return messages;
  }
  return [];
}

export function getCarouselApiErrorMessage(payload: unknown): string {
  const messages = extractErrorMessages(payload);
  return messages.length > 0
    ? [...new Set(messages)].join(". ")
    : CAROUSEL_ERROR_FALLBACK;
}

export function validateCarouselForm(form: CarouselFormFields): string | null {
  const title = form.title.trim();
  const subtitle = form.subtitle.trim();
  if (
    !title ||
    !subtitle ||
    !form.primaryUrl.trim() ||
    !form.secondaryUrl.trim()
  ) {
    return "Заполните заголовок, подпись и обе ссылки.";
  }
  if (title.length < 2) return "Заголовок должен содержать не менее 2 символов.";
  if (subtitle.length < 2) return "Подпись должна содержать не менее 2 символов.";
  return null;
}

export function moveCarouselSlide<T extends { id: number; sortOrder: number }>(
  slides: T[],
  id: number,
  offset: -1 | 1,
): T[] {
  const index = slides.findIndex((slide) => slide.id === id);
  const target = index + offset;
  if (index < 0 || target < 0 || target >= slides.length) return slides;
  const next = [...slides];
  [next[index], next[target]] = [next[target], next[index]];
  return next.map((slide, sortOrder) => ({ ...slide, sortOrder }));
}
