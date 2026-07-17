import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import DocumentShareLinks from "./DocumentShareLinks.client";
import {
  adminDocumentShareLinksControllerCreate,
  adminDocumentShareLinksControllerList,
} from "@/shared/api/generated/clients";

vi.mock("@/shared/api/generated/clients", () => ({
  adminDocumentShareLinksControllerCreate: vi.fn(),
  adminDocumentShareLinksControllerList: vi.fn(),
  adminDocumentShareLinkRevokeControllerRevoke: vi.fn(),
}));

afterEach(() => vi.clearAllMocks());

const version = {
  id: 7, versionNumber: 1, originalFilename: "file.pdf", extension: "pdf",
  mimeType: "application/pdf", sizeBytes: "10", sha256: "x".repeat(64),
  createdAt: "2026-01-01T00:00:00.000Z", isCurrent: true,
};

describe("DocumentShareLinks characterization", () => {
  it("shows raw URL only after create and removes it after close", async () => {
    vi.mocked(adminDocumentShareLinksControllerList).mockResolvedValue([{
      id: 9, tokenPrefix: "abc123", versionNumber: 1, createdAt: "2026-01-01T00:00:00.000Z",
      expiresAt: null, revokedAt: null, accessCount: 0, lastAccessAt: null, isActive: true, isExpired: false,
      versionId: 7, documentId: 3, documentTitle: "Test document",
    }]);
    vi.mocked(adminDocumentShareLinksControllerCreate).mockResolvedValue({
      id: 10, token: "raw-secret-token", tokenPrefix: "raw-sec", versionNumber: 1, expiresAt: null,
      revokedAt: null, createdAt: "2026-01-01T00:00:00.000Z", lastAccessAt: null,
      accessCount: 0, isActive: true, isExpired: false, versionId: 7, documentId: 3,
      documentTitle: "Test document", sharePath: "/share/document",
    });
    render(<DocumentShareLinks version={version} />);
    await waitFor(() => expect(screen.getByText("abc123")).toBeInTheDocument());
    expect(document.body.textContent).not.toContain("raw-secret-token");
    await userEvent.click(screen.getByRole("button", { name: "Создать ссылку" }));
    await waitFor(() => expect(screen.getByText(/raw-secret-token/)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Скопировать ссылку" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(document.body.textContent).not.toContain("raw-secret-token");
    expect(document.body.textContent).toContain("abc123");
  });
});
