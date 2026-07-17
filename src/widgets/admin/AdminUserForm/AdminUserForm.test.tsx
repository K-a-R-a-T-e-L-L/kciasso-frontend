import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdminUserForm from "./AdminUserForm.client";

afterEach(cleanup);

describe("AdminUserForm permissions", () => {
  const action = vi.fn(async () => ({ error: null }));

  it("applies full content preset without granting SUPER_ADMIN", async () => {
    render(<AdminUserForm includePassword action={action} submitLabel="Создать" />);
    await userEvent.click(screen.getByRole("button", { name: "Полный доступ к контенту" }));
    expect(screen.getByRole("combobox", { name: "Роль" })).toHaveValue("ADMIN");
    expect(screen.getByRole("checkbox", { name: "Настройки сайта" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Новости" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Все группы" })).toBeChecked();
  });

  it("warns that empty selected document groups grant no access", async () => {
    render(<AdminUserForm action={action} submitLabel="Сохранить" />);
    await userEvent.click(screen.getByRole("radio", { name: "Выбранные группы" }));
    expect(screen.getByText("Пустой список означает отсутствие доступа к документам.")).toBeInTheDocument();
  });
});
