export async function parseResponse(response: Response) {
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const messages: Record<string, string> = {
      DOCUMENT_DUPLICATE_VERSION: "Такая версия уже загружена для этого документа.",
      DOCUMENT_FILE_TOO_LARGE: "Файл превышает допустимый размер.",
      DOCUMENT_FILE_EXTENSION_NOT_ALLOWED: "Расширение файла не поддерживается.",
      DOCUMENT_FILE_MIME_NOT_ALLOWED: "Тип файла не соответствует расширению.",
      DOCUMENT_FILE_SIGNATURE_MISMATCH: "Содержимое файла не соответствует его типу.",
      DOCUMENT_REORDER_INVALID: "Передайте полный список документов раздела без повторов.",
      DOCUMENT_TITLE_REQUIRED: "Укажите название документа.",
      DOCUMENT_CURRENT_VERSION_UNAVAILABLE: "Физический файл текущей версии недоступен.",
    };
    throw new Error(messages[payload?.errorMessage] ?? payload?.description ?? "Не удалось выполнить операцию.");
  }
  return payload;
}

export function formatSize(value?: string) {
  const size = Number(value ?? 0);
  if (!Number.isFinite(size)) return "—";
  if (size < 1024) return `${size} Б`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} КБ`;
  return `${(size / 1024 / 1024).toFixed(1)} МБ`;
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("ru-RU").format(date);
}
