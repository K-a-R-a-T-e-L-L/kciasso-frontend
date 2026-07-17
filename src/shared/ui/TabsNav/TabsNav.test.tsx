import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IconStar } from "@tabler/icons-react";
import LinkTabsNav from "./LinkTabsNav";
import ButtonTabsNav from "./ButtonTabsNav.client";

describe("TabsNav", () => {
  it("marks the active link and renders icon/count metadata", () => {
    render(<LinkTabsNav ariaLabel="Разделы" activeKey="one" items={[{ key: "one", title: "Первый", href: "/one", icon: IconStar, count: 2 }, { key: "two", title: "Второй", href: "/two" }]} />);
    expect(screen.getByRole("link", { name: /Первый2/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Второй" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Разделы");
  });

  it("exposes button tabs as selectable and invokes the selected key", () => {
    const onTabClick = vi.fn();
    render(<ButtonTabsNav ariaLabel="Фильтры" activeKey="two" onTabClick={onTabClick} items={[{ key: "one", title: "Первый" }, { key: "two", title: "Второй", icon: IconStar }]} />);
    expect(screen.getByRole("tab", { name: "Второй" })).toHaveAttribute("aria-selected", "true");
    screen.getByRole("tab", { name: "Первый" }).click();
    expect(onTabClick).toHaveBeenCalledWith("one");
  });
});
