import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdminDocumentsPanel from "./AdminDocumentsPanel.client";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function adminDocument(id: number, title: string, sortOrder: number) {
  return { id, title, description: "Описание", documentNumber: String(id), documentDate: "1999-12-31T12:00:00.000Z", status: "PUBLISHED" as const, placements: [{ id, sectionKey: "gia9-results", sortOrder, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" }], currentVersion: { id, versionNumber: 1, originalFilename: "file.pdf", extension: "pdf", mimeType: "application/pdf", sizeBytes: "10", sha256: "x".repeat(64), createdAt: "2026-01-01T00:00:00.000Z", isCurrent: true }, versionsCount: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
}

describe("AdminDocumentsPanel orchestration", () => {
  it("never renders the raw placement key in the page header", () => {
    render(
      <AdminDocumentsPanel
        initialDocuments={[]}
        sectionKey="gia-9.normative-documents"
      />,
    );
    expect(screen.getByRole("heading", { name: "Документы ГИА-9" })).toBeInTheDocument();
    expect(screen.queryByText("gia-9.normative-documents")).not.toBeInTheDocument();
  });

  it("sends complete reorder payload and rolls back on failure", async () => {
    const docs = [adminDocument(1, "Первый", 0), adminDocument(2, "Второй", 1)];
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ errorMessage: "DOCUMENT_REORDER_INVALID" }), { status: 400 }));
    vi.stubGlobal("fetch", fetchMock); render(<AdminDocumentsPanel initialDocuments={docs} sectionKey="gia9-results" />);
    expect(screen.getAllByRole("button", { name: "Вверх" })[0]).toBeDisabled(); await userEvent.click(screen.getAllByRole("button", { name: "Вниз" })[0]);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("полный список"));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body as string)).toEqual({ sectionKey: "gia9-results", orderedDocumentIds: [2, 1] }); expect(screen.getByTestId("document-card-1")).toHaveTextContent("Первый");
  });

  it("treats DELETE 204 as success and removes the card", async () => {
    const docs = [adminDocument(1, "Удаляемый", 0)]; vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 }))); vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<AdminDocumentsPanel initialDocuments={docs} sectionKey="gia9-results" />); await userEvent.click(screen.getByRole("button", { name: "Удалить полностью" }));
    await waitFor(() => expect(screen.queryByTestId("document-card-1")).not.toBeInTheDocument()); expect(screen.getByRole("status")).toHaveTextContent("полностью удалён");
  });

  it("keeps mixed-scope documents reorderable but hides management actions", () => {
    const document = { ...adminDocument(1, "Смешанный", 0), canManage: false };
    render(<AdminDocumentsPanel initialDocuments={[document]} sectionKey="gia9-results" />);
    expect(screen.getByText("Только просмотр")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Вверх" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Вниз" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Редактировать" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Удалить полностью" })).not.toBeInTheDocument();
  });
});
