import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdminDocumentsPanel from "./AdminDocumentsPanel.client";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function documentFixture() {
  return { id: 1, title: "Документ", description: "Описание", documentNumber: "1", documentDate: "1999-12-31T12:00:00.000Z", status: "PUBLISHED" as const, placements: [{ id: 1, sectionKey: "gia9-results", sortOrder: 0, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" }], currentVersion: { id: 1, versionNumber: 1, originalFilename: "old.pdf", extension: "pdf", mimeType: "application/pdf", sizeBytes: "10", sha256: "x".repeat(64), createdAt: "2026-01-01T00:00:00.000Z", isCurrent: true }, versionsCount: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
}

function mockAdminFetch(items = [documentFixture()]) {
  const fetchMock = vi.fn((_: RequestInfo | URL, init?: RequestInit) => {
    if ((init?.method ?? "GET") === "GET") return Promise.resolve(new Response(JSON.stringify({ items }), { status: 200 }));
    return Promise.resolve(new Response(JSON.stringify({}), { status: 200 }));
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("AdminDocumentsPanel mutation boundaries", () => {
  it("builds the create multipart payload", async () => {
    const fetchMock = mockAdminFetch([]); render(<AdminDocumentsPanel initialDocuments={[]} sectionKey="gia9-results" />);
    await userEvent.click(screen.getByRole("button", { name: "Добавить документ" })); await userEvent.type(screen.getByLabelText("Название"), "Новый документ");
    const file = new File(["pdf"], "new.pdf", { type: "application/pdf" }); await userEvent.upload(screen.getByLabelText("Файл"), file); fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/admin/documents", expect.objectContaining({ method: "POST" })));
    const body = fetchMock.mock.calls.find((call) => call[1]?.method === "POST")?.[1]?.body as FormData;
    expect(body.getAll("placementKeys")).toEqual(["gia9-results"]); expect(body.get("title")).toBe("Новый документ"); expect(body.get("file")).toBe(file);
  });

  it("sends edit metadata and exact placements", async () => {
    const fetchMock = mockAdminFetch(); render(<AdminDocumentsPanel initialDocuments={[documentFixture()]} sectionKey="gia9-results" />);
    await userEvent.click(screen.getByRole("button", { name: "Редактировать" })); await userEvent.clear(screen.getByLabelText("Название")); await userEvent.type(screen.getByLabelText("Название"), "Обновлённый документ"); await userEvent.click(screen.getByRole("button", { name: "Сохранить" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/admin/documents/1", expect.objectContaining({ method: "PATCH" })));
    const patchCall = fetchMock.mock.calls.find((call) => call[0] === "/api/admin/documents/1" && call[1]?.method === "PATCH"); const placementCall = fetchMock.mock.calls.find((call) => call[0] === "/api/admin/documents/1/placements");
    expect(JSON.parse(patchCall?.[1]?.body as string).title).toBe("Обновлённый документ"); expect(JSON.parse(placementCall?.[1]?.body as string)).toEqual({ placementKeys: ["gia9-results"] });
  });

  it("uploads a new version and changes status through the existing endpoints", async () => {
    const fetchMock = mockAdminFetch(); render(<AdminDocumentsPanel initialDocuments={[documentFixture()]} sectionKey="gia9-results" />);
    await userEvent.click(screen.getByRole("button", { name: "Заменить файл" })); const file = new File(["doc"], "new.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }); fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } }); fireEvent.submit(document.querySelector('form')!);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/admin/documents/1/versions", expect.objectContaining({ method: "POST" }))); expect((fetchMock.mock.calls.find((call) => call[0] === "/api/admin/documents/1/versions")?.[1]?.body as FormData).get("file")).toBe(file);
    fireEvent.change(screen.getByRole("combobox", { name: "Статус Документ" }), { target: { value: "DRAFT" } }); await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/admin/documents/1/status", expect.objectContaining({ method: "PATCH" })));
  });
});
