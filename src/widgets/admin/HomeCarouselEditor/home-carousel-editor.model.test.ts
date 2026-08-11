import { describe, expect, it } from "vitest";
import {
  getCarouselApiErrorMessage,
  moveCarouselSlide,
  validateCarouselForm,
} from "./home-carousel-editor.model";

const slides = [
  { id: 1, sortOrder: 0 },
  { id: 2, sortOrder: 1 },
  { id: 3, sortOrder: 2 },
];

describe("home carousel editor model", () => {
  it("moves a slide one position and normalizes order", () => {
    expect(moveCarouselSlide(slides, 2, -1)).toEqual([
      { id: 2, sortOrder: 0 },
      { id: 1, sortOrder: 1 },
      { id: 3, sortOrder: 2 },
    ]);
  });

  it("does not move a slide outside the list", () => {
    expect(moveCarouselSlide(slides, 1, -1)).toBe(slides);
    expect(moveCarouselSlide(slides, 3, 1)).toBe(slides);
  });

  it("extracts validation messages from a nested API error", () => {
    expect(
      getCarouselApiErrorMessage({
        message: {
          message: [
            "subtitle must be longer than or equal to 2 characters",
            "title must be shorter than or equal to 120 characters",
          ],
        },
      }),
    ).toBe(
      "subtitle must be longer than or equal to 2 characters. title must be shorter than or equal to 120 characters",
    );
  });

  it("uses a readable fallback instead of stringifying an unknown object", () => {
    expect(getCarouselApiErrorMessage({ message: { code: "INVALID" } })).toBe(
      "Не удалось сохранить изменения карусели.",
    );
  });

  it("validates the minimum title and subtitle length before submission", () => {
    expect(
      validateCarouselForm({
        title: "свы",
        subtitle: "с",
        primaryUrl: "/",
        secondaryUrl: "/",
      }),
    ).toBe("Подпись должна содержать не менее 2 символов.");
  });
});
