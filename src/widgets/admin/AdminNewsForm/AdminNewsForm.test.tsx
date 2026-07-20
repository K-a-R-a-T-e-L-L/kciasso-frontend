import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AdminNewsDto } from "@/shared/api/generated/types";
import AdminNewsForm from "./AdminNewsForm.client";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const action = vi.fn(async () => ({ error: null }));

describe("AdminNewsForm cover image", () => {
  it("keeps cover inputs controlled for all existing cover states", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const initialData = {
      id: 1,
      title: "Новость",
      slug: "novost",
      excerpt: "Коротко",
      content: "Текст",
      coverImageUrl: null,
      status: "draft",
    } as unknown as AdminNewsDto;
    const view = render(<AdminNewsForm categories={[]} initialData={initialData} action={action} submitLabel="Сохранить" />);
    view.rerender(<AdminNewsForm categories={[]} initialData={{ ...initialData, coverImageUrl: "https://example.com/a.png" }} action={action} submitLabel="Сохранить" />);
    expect(consoleError).not.toHaveBeenCalledWith(expect.stringContaining("uncontrolled"));
  });

  it("allows the backend to generate a slug", () => {
    render(<AdminNewsForm categories={[]} action={action} submitLabel="Сохранить" />);
    expect(screen.getByRole("textbox", { name: /Slug \(необязательно\)/ })).not.toBeRequired();
    expect(screen.getByText("Оставьте поле пустым — адрес создастся автоматически из заголовка.")).toBeInTheDocument();
  });

  it("switches between file upload and URL input", async () => {
    render(<AdminNewsForm categories={[]} action={action} submitLabel="Сохранить" />);
    expect(screen.getByRole("button", { name: "Загрузить файл" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Указать ссылку" })).toBeInTheDocument();
    expect(screen.getByLabelText("Файл изображения")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Указать ссылку" }));
    expect(screen.getByLabelText("Ссылка на изображение")).toBeInTheDocument();
    expect(screen.queryByLabelText("Файл изображения")).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Ссылка на изображение"), "https://example.com/cover.png");
    await userEvent.click(screen.getByRole("button", { name: "Загрузить файл" }));
    expect(screen.getByLabelText("Файл изображения")).toBeInTheDocument();
    expect(screen.queryByLabelText("Ссылка на изображение")).not.toBeInTheDocument();
  });

  it("shows a preview and allows replacing or removing a selected file", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:preview");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    render(<AdminNewsForm categories={[]} action={action} submitLabel="Сохранить" />);
    const input = screen.getByLabelText("Файл изображения");
    await userEvent.upload(input, new File(["image"], "cover.webp", { type: "image/webp" }));
    expect(input.files).toHaveLength(1);
    expect(screen.getByRole("img", { name: "Предпросмотр изображения новости" })).toHaveAttribute(
      "src",
      "blob:preview",
    );
    expect(screen.getByRole("button", { name: "Заменить" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Удалить изображение" }));
    expect(screen.queryByRole("img", { name: "Предпросмотр изображения новости" })).not.toBeInTheDocument();
  });

  it("accepts only supported raster formats and caps the browser input at one file", () => {
    render(<AdminNewsForm categories={[]} action={action} submitLabel="Сохранить" />);
    const input = screen.getByLabelText("Файл изображения") as HTMLInputElement;
    expect(input.accept).toBe("image/jpeg,image/png,image/webp");
    expect(input.multiple).toBe(false);
    expect(input).not.toHaveAttribute("name");
  });
});
