import { render, screen } from "@testing-library/react";
import { vi, describe, expect, it } from "vitest";
import { MantineProvider } from "@mantine/core";
import AdminNavigation from "./AdminNavigation.client";

vi.mock("next/navigation", () => ({ usePathname: () => "/admin/pages" }));

describe("AdminNavigation", () => {
  it("separates the public home link and opens it in a new tab", () => {
    render(
      <MantineProvider>
        <AdminNavigation
          items={[
            { href: "/", title: "На главную", icon: "home" },
            { href: "/admin", title: "Обзор", icon: "dashboard" },
            { href: "/admin/pages", title: "Страницы", icon: "pages" },
          ]}
        />
      </MantineProvider>,
    );

    const home = screen.getByRole("link", { name: /На главную/ });
    expect(home).toHaveAttribute("target", "_blank");
    expect(home).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(home.closest("[data-admin-public-link]")).not.toBeNull();
    expect(screen.getByRole("link", { name: "Страницы" })).not.toHaveAttribute(
      "target",
    );
    expect(screen.getByRole("link", { name: "Обзор" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("link", { name: "Страницы" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
