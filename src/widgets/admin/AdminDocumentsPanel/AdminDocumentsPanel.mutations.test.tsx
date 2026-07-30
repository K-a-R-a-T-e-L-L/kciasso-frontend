import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AdminDocumentsPanel from "./AdminDocumentsPanel.client";

describe("document mutation entry points", () => {
  it("opens the Mantine creation drawer", async () => {
    render(
      <MantineProvider>
        <AdminDocumentsPanel initialDocuments={[]} sectionKey="gia9-results" />
      </MantineProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Добавить документ" }));
    expect(await screen.findByText("Новый документ")).toBeInTheDocument();
    expect(document.body).toHaveAttribute("data-scroll-locked");
  });
});
