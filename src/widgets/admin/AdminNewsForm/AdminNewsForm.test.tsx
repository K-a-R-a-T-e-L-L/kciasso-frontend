import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdminNewsForm from "./AdminNewsForm.client";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const action = vi.fn(async () => ({ error: null }));

describe("AdminNewsForm cover image", () => {
  it("switches between file upload and URL input", async () => {
    render(<AdminNewsForm categories={[]} action={action} submitLabel="Сохранить" />);
    expect(screen.getByRole("button", { name: "Загрузить файл" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Указать URL" })).toBeInTheDocument();
    expect(screen.getByLabelText("Файл изображения")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Указать URL" }));
    expect(screen.getByLabelText("URL изображения")).toBeInTheDocument();
    expect(screen.queryByLabelText("Файл изображения")).not.toBeInTheDocument();
  });

  it("shows a preview and allows replacing or removing a selected file", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:preview");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    render(<AdminNewsForm categories={[]} action={action} submitLabel="Сохранить" />);
    const input = screen.getByLabelText("Файл изображения");
    await userEvent.upload(input, new File(["image"], "cover.webp", { type: "image/webp" }));
    expect(screen.getByRole("img", { name: "Предпросмотр изображения новости" })).toHaveAttribute(
      "src",
      "blob:preview",
    );
    expect(screen.getByRole("button", { name: "Заменить изображение" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Удалить изображение" }));
    expect(screen.queryByRole("img", { name: "Предпросмотр изображения новости" })).not.toBeInTheDocument();
  });

  it("accepts only supported raster formats and caps the browser input at one file", () => {
    render(<AdminNewsForm categories={[]} action={action} submitLabel="Сохранить" />);
    const input = screen.getByLabelText("Файл изображения") as HTMLInputElement;
    expect(input.accept).toBe("image/jpeg,image/png,image/webp");
    expect(input.multiple).toBe(false);
  });
});
