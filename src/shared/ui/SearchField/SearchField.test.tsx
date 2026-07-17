import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SearchField from "./SearchField";

describe("SearchField", () => {
  it("renders an accessible labelled input and result count", () => {
    render(<SearchField label="Поиск по документам" value="" onChange={vi.fn()} resultCount={4} placeholder="Название" />);
    expect(screen.getByLabelText("Поиск по документам")).toHaveAttribute("placeholder", "Название");
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Найдено: 4")).toBeInTheDocument();
  });

  it("emits typing and clears the current value", () => {
    const onChange = vi.fn();
    render(<SearchField label="Поиск" value="текст" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Поиск"), { target: { value: "текст новый" } });
    expect(onChange).toHaveBeenCalledWith("текст новый");
    screen.getByRole("button", { name: "Очистить поиск" }).click();
    expect(onChange).toHaveBeenCalledWith("");
  });
});
