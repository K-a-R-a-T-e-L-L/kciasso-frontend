import { Button, MantineProvider } from "@mantine/core";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AdminDashboard from "./AdminDashboard";

afterEach(cleanup);

const news = {
  total: 12,
  published: 7,
  draft: 3,
  scheduled: 2,
  recent: [
    {
      id: 4,
      title: "Последняя новость",
      categoryTitle: "О центре",
      status: "published" as const,
      updatedAt: "2026-08-10T08:30:00.000Z",
    },
  ],
};

const documents = {
  total: 18,
  published: 15,
  hidden: 3,
  recent: [
    {
      id: 8,
      title: "Приказ № 8",
      documentNumber: "8",
      status: "PUBLISHED",
      fileType: "PDF",
      updatedAt: "2026-08-09T08:30:00.000Z",
    },
  ],
};

function renderDashboard(overrides = {}) {
  render(
    <MantineProvider>
      <AdminDashboard
        displayName="Super Admin"
        email="admin@example.com"
        roleLabel="super-admin"
        generatedAt="2026-08-10T09:00:00.000Z"
        news={news}
        documents={documents}
        users={{ total: 5, active: 4 }}
        canManageSiteSettings
        quickActions={<Button>Быстрое действие</Button>}
        {...overrides}
      />
    </MantineProvider>,
  );
}

describe("AdminDashboard", () => {
  it("shows existing content statistics, attention counters and recent items", () => {
    renderDashboard();

    expect(screen.getByRole("heading", { name: "Добро пожаловать, Super Admin" })).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-stat-news")).toHaveTextContent("12");
    expect(screen.getByTestId("dashboard-stat-published-news")).toHaveTextContent("7");
    expect(screen.getByTestId("dashboard-stat-documents")).toHaveTextContent("18");
    expect(screen.getByTestId("dashboard-stat-users")).toHaveTextContent("4");
    expect(screen.getByRole("link", { name: /Черновики новостей/ })).toHaveAttribute("href", "/admin/news?status=draft");
    expect(screen.getByRole("link", { name: /Запланированные новости/ })).toHaveAttribute("href", "/admin/news?status=scheduled");
    expect(screen.getByRole("link", { name: /Скрытые документы/ })).toHaveAttribute("href", "/admin/documents?scope=all&status=UNLISTED");
    expect(screen.getByText("Последняя новость")).toBeInTheDocument();
    expect(screen.getByText("Приказ № 8")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Публичная версия сайта/ })).toHaveAttribute("target", "_blank");
  });

  it("renders only the sections available to the current administrator", () => {
    renderDashboard({ users: undefined, canManageSiteSettings: false });

    expect(screen.queryByTestId("dashboard-stat-users")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Пользователи и права/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Страницы и секции/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Новости и рубрики/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Материалы и документы/ })).toBeInTheDocument();
  });
});
