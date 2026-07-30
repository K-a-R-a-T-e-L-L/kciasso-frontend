import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AdminUsersRegistry from "./AdminUsersRegistry";

describe("AdminUsersRegistry", () => {
  it("renders Mantine desktop table and mobile cards", () => {
    render(
      <MantineProvider>
        <AdminUsersRegistry
          currentUserId={1}
          deleteAction={vi.fn()}
          users={[{
            id: 1,
            name: "Администратор",
            email: "admin@example.test",
            role: "SUPER_ADMIN",
            isActive: true,
            canManageSiteSettings: true,
            canManageNews: true,
            documentsAccessMode: "ALL",
            documentGroups: [],
          }]}
        />
      </MantineProvider>,
    );

    expect(screen.getByTestId("users-desktop-table")).toBeInTheDocument();
    expect(screen.getByTestId("users-mobile-cards")).toBeInTheDocument();
    expect(screen.getAllByText("Администратор")).toHaveLength(2);
  });
});
