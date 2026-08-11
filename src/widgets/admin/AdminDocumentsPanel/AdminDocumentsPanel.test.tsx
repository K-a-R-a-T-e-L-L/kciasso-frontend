import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DocumentDto } from "@/shared/api/generated/types";
import AdminDocumentsPanel from "./AdminDocumentsPanel.client";

const documentFixture: DocumentDto = {
  id: 1,
  title: "Документ",
  description: "Описание",
  documentNumber: "1",
  documentDate: "1999-12-31T12:00:00.000Z",
  status: "PUBLISHED",
  canManage: true,
  placements: [
    {
      id: 1,
      sectionKey: "gia9-results",
      sortOrder: 0,
      publicationStatus: "DRAFT",
      publicationRevision: 0,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  currentVersion: {
    id: 1,
    versionNumber: 1,
    originalFilename: "file.pdf",
    extension: "pdf",
    mimeType: "application/pdf",
    sizeBytes: "10",
    sha256: "x".repeat(64),
    createdAt: "2026-01-01T00:00:00.000Z",
    isCurrent: true,
  },
  versionsCount: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function renderPanel(
  documents: DocumentDto[] = [],
  initialCreateOpen = false,
) {
  return render(
    <MantineProvider>
      <AdminDocumentsPanel
        initialDocuments={documents}
        sectionKey="gia9-results"
        initialCreateOpen={initialCreateOpen}
      />
    </MantineProvider>,
  );
}

describe("Admin documents Mantine layout", () => {
  it("renders a labeled filter surface and empty state", () => {
    renderPanel();
    expect(
      screen.getByRole("heading", { name: "Материалы и документы" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Фильтры" }),
    ).toBeInTheDocument();
    expect(screen.getAllByLabelText("Раздел").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Поиск")).toBeInTheDocument();
    expect(
      screen.getByText("В доступных разделах пока нет документов."),
    ).toBeInTheDocument();
  });

  it("renders compact document metadata and primary actions", () => {
    renderPanel([documentFixture]);
    expect(screen.getByTestId("document-card-1")).toBeInTheDocument();
    expect(screen.getByText("Документ")).toBeInTheDocument();
    const openLink = screen.getByRole("link", { name: "Открыть" });
    expect(openLink).toHaveAttribute("target", "_blank");
    expect(openLink).toHaveAttribute(
      "href",
      "/api/admin/documents/1/versions/1/file",
    );
    expect(screen.getByRole("link", { name: "Скачать" })).toHaveAttribute(
      "href",
      "/api/admin/documents/1/versions/1/download",
    );
    expect(
      screen.getByRole("button", { name: "Редактировать" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Действия документа" }),
    ).toBeInTheDocument();
  });

  it("shows explicit reorder controls when the complete list is available", () => {
    renderPanel([
      documentFixture,
      { ...documentFixture, id: 2, title: "Второй документ" },
    ]);
    expect(
      screen.getAllByRole("button", { name: "Вниз" }).length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getAllByRole("button", { name: "Вверх" }).length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("opens the existing create drawer from a dashboard quick link", () => {
    renderPanel([], true);
    expect(screen.getByRole("dialog", { name: "Новый документ" })).toBeInTheDocument();
  });
});
