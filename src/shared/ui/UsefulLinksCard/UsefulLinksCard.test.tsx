import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconStar } from "@tabler/icons-react";
import UsefulLinksCard from "./UsefulLinksCard";

describe("UsefulLinksCard", () => {
  it("returns no card for an empty collection", () => {
    const { container } = render(<UsefulLinksCard title="Полезные ссылки" items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("keeps each row as one accessible link and secures external links", () => {
    render(<UsefulLinksCard title="Полезные ссылки" icon={IconStar} items={[{ id: "internal", title: "Внутренняя", href: "/inside" }, { id: "external", title: "Внешняя", href: "https://example.com", external: true }]} />);
    expect(screen.getByRole("link", { name: "Внутренняя" })).toHaveAttribute("href", "/inside");
    expect(screen.getByRole("link", { name: "Внешняя" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Внешняя" })).toHaveAttribute("rel", "noreferrer noopener");
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(document.querySelectorAll("a a")).toHaveLength(0);
  });
});
