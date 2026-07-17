import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { PublicDocumentsResult } from "@/shared/api/adapters/public-documents.adapter";
import PublicDocumentsBlock from "./PublicDocumentsBlock";

afterEach(() => document.body.replaceChildren());

function result(extension: string): PublicDocumentsResult {
  return { error: false, documents: [{ id: 12, title: "Документ", description: "Описание", documentNumber: "12", documentDate: "1999-12-31T12:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", currentVersion: { originalFilename: `file.${extension}`, extension, mimeType: "application/octet-stream", sizeBytes: "10" } }] };
}

describe("public documents characterization", () => {
  it.each(["pdf", "jpg", "jpeg", "png"])("opens %s", (extension) => {
    render(<PublicDocumentsBlock result={result(extension)} title="Документы" />);
    expect(screen.getByRole("link", { name: "Открыть документ" })).toBeInTheDocument();
  });

  it.each(["doc", "docx", "xls", "xlsx", "zip"])("downloads %s", (extension) => {
    render(<PublicDocumentsBlock result={result(extension)} title="Документы" />);
    expect(screen.getByRole("link", { name: "Скачать документ" })).toHaveAttribute("download");
  });

  it("renders requisites and omits internal metadata", () => {
    render(<PublicDocumentsBlock result={result("pdf")} />);
    expect(screen.getByText(/Документ № 12 от 31\.12\.1999/)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("SHA");
    expect(document.body.textContent).not.toContain("version");
    expect(document.body.textContent).not.toContain("internal");
  });

  it("hides empty content and localizes an error state when requested", () => {
    const { container } = render(<PublicDocumentsBlock result={{ documents: [], error: false }} />);
    expect(container).toBeEmptyDOMElement();
    render(<PublicDocumentsBlock result={{ documents: [], error: true }} hideWhenEmpty={false} />);
    expect(screen.getByText(/Не удалось загрузить документы/)).toBeInTheDocument();
  });

  it("preserves filtering through the shared search field", () => {
    const first = result("pdf").documents[0];
    const documents = [first, { ...first, id: 13, title: "Другой документ" }];
    render(<PublicDocumentsBlock result={{ documents, error: false }} searchable />);
    fireEvent.change(screen.getByLabelText("Поиск по документам"), { target: { value: "Другой" } });
    expect(screen.getByText("Другой документ")).toBeInTheDocument();
    expect(screen.queryByText("Документ", { selector: "h3" })).not.toBeInTheDocument();
  });
});
