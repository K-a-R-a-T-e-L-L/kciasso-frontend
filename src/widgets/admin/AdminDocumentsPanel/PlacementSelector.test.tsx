import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DOCUMENT_PLACEMENT_GROUPS } from "@/shared/documents/document-placement-registry";
import PlacementSelector from "./PlacementSelector.client";

afterEach(() => cleanup());

describe("PlacementSelector", () => {
  function renderSelector(value: string[] = []) {
    const onApply = vi.fn(); const onCancel = vi.fn();
    render(<PlacementSelector value={value} onApply={onApply} onCancel={onCancel} />);
    return { onApply, onCancel };
  }

  it("starts closed and keeps at most one group open", async () => {
    renderSelector();
    const groups = screen.getAllByRole("button", { name: /ГИА|Качество|Региональный|О центре/ });
    expect(groups.every((group) => group.getAttribute("aria-expanded") === "false")).toBe(true);
    await userEvent.click(groups[0]); await userEvent.click(groups[1]);
    expect(groups[0]).toHaveAttribute("aria-expanded", "false"); expect(groups[1]).toHaveAttribute("aria-expanded", "true");
  });

  it("searches matching items and closes groups after clearing", async () => {
    renderSelector(); const search = screen.getByRole("textbox", { name: "Поиск по названию раздела" });
    await userEvent.type(search, "ГИА-9 Нормативные документы");
    expect(screen.getAllByText("ГИА-9").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /ГИА|Качество|Региональный|О центре/ }).filter((button) => button.getAttribute("aria-expanded") === "true")).toHaveLength(1);
    await userEvent.clear(search);
    expect(screen.getAllByRole("button", { name: /ГИА|Качество|Региональный|О центре/ }).every((button) => button.getAttribute("aria-expanded") === "false")).toBe(true);
  });

  it("selects and clears a group and reports the count", async () => {
    renderSelector(); await userEvent.click(screen.getByRole("button", { name: /ГИА-9/ })); await userEvent.click(screen.getByRole("button", { name: "Выбрать все" }));
    const group = DOCUMENT_PLACEMENT_GROUPS.find((item) => item.title === "ГИА-9");
    expect(screen.getByText(`Выбрано разделов: ${group?.items.length}`)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Очистить" })); expect(screen.getByText("Выбрано разделов: 0")).toBeInTheDocument();
  });

  it("does not persist Cancel and applies the exact placement set", async () => {
    const initial = [DOCUMENT_PLACEMENT_GROUPS[0].items[0].key]; const { onApply, onCancel } = renderSelector(initial);
    await userEvent.click(screen.getByRole("button", { name: /ГИА-9/ })); await userEvent.click(screen.getAllByRole("checkbox")[1]); await userEvent.click(screen.getByRole("button", { name: "Отмена" }));
    expect(onCancel).toHaveBeenCalledOnce(); expect(onApply).not.toHaveBeenCalled();
    cleanup(); const second = renderSelector(initial); await userEvent.click(screen.getByRole("button", { name: /ГИА-9/ })); await userEvent.click(screen.getAllByRole("checkbox")[1]); await userEvent.click(screen.getByRole("button", { name: "Применить" }));
    expect(second.onApply).toHaveBeenCalledWith([initial[0], DOCUMENT_PLACEMENT_GROUPS[0].items[1].key]);
  });
});
