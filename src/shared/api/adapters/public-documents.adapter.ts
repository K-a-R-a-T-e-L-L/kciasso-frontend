export type PublicDocument = {
  id: number;
  title: string;
  description: string | null;
  documentNumber: string | null;
  documentDate: string | null;
  updatedAt: string;
  currentVersion: {
    originalFilename: string;
    extension: string;
    mimeType: string;
    sizeBytes: string;
  };
};

export type PublicDocumentsResult = {
  documents: PublicDocument[];
  error: boolean;
};

const backendUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getPublicDocuments(sectionKey: string): Promise<PublicDocumentsResult> {
  try {
    const response = await fetch(
      `${backendUrl}/api/public/documents?sectionKey=${encodeURIComponent(sectionKey)}`,
      { cache: "no-store" },
    );
    if (!response.ok) return { documents: [], error: true };
    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) return { documents: [], error: true };
    return { documents: data as PublicDocument[], error: false };
  } catch {
    return { documents: [], error: true };
  }
}

export function publicDocumentFileUrl(id: number) {
  return `/api/public-documents/${encodeURIComponent(String(id))}/file`;
}
