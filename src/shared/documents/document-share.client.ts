export type ResolvedDocumentFile = {
  blob: Blob;
  filename: string;
  mimeType: string;
  disposition: string;
  size: number;
};

export class DocumentShareUnavailableError extends Error {
  constructor() {
    super("Ссылка недействительна, истекла или была отозвана.");
    this.name = "DocumentShareUnavailableError";
  }
}

export class DocumentShareNetworkError extends Error {
  constructor() {
    super("Не удалось открыть файл. Попробуйте ещё раз позднее.");
    this.name = "DocumentShareNetworkError";
  }
}

function parseFilename(disposition: string | null) {
  if (!disposition) return "document";
  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) {
    try {
      return (
        decodeURIComponent(encoded).replace(
          /[\r\n"\\/\u0000-\u001F\u007F]/g,
          "_",
        ) || "document"
      );
    } catch {
      return "document";
    }
  }
  return (
    disposition
      .match(/filename="([^"]*)"/i)?.[1]
      ?.replace(/[\r\n"\\/\u0000-\u001F\u007F]/g, "_") || "document"
  );
}

export async function resolveDocumentShare(
  token: string,
  signal?: AbortSignal,
): Promise<ResolvedDocumentFile> {
  let response: Response;
  try {
    response = await fetch("/api/document-share/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      credentials: "same-origin",
      cache: "no-store",
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new DocumentShareNetworkError();
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    if (
      response.status === 404 ||
      payload?.errorMessage === "DOCUMENT_SHARE_LINK_UNAVAILABLE"
    ) {
      throw new DocumentShareUnavailableError();
    }
    if (response.status >= 500) throw new DocumentShareNetworkError();
    throw new DocumentShareUnavailableError();
  }

  const blob = await response.blob();
  return {
    blob,
    filename: parseFilename(response.headers.get("content-disposition")),
    mimeType:
      response.headers.get("content-type")?.split(";", 1)[0] ||
      blob.type ||
      "application/octet-stream",
    disposition: response.headers.get("content-disposition") || "attachment",
    size: Number(response.headers.get("content-length") || blob.size),
  };
}
