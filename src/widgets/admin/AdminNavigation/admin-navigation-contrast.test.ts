import { describe, expect, it } from "vitest";
import {
  ADMIN_NAV_COLORS,
  ADMIN_NAV_FOCUS,
  contrastRatio,
} from "@/shared/lib/theme/mantine/admin-theme";

describe("admin navigation accessibility contract", () => {
  it.each([
    ["default", ADMIN_NAV_COLORS.defaultBackground],
    ["hover", ADMIN_NAV_COLORS.hoverBackground],
    ["active", ADMIN_NAV_COLORS.activeBackground],
    ["active:hover", ADMIN_NAV_COLORS.activeHoverBackground],
  ])("%s contrast is at least 4.5:1", (_, background) => {
    expect(contrastRatio(ADMIN_NAV_COLORS.foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  it("uses a visible two-pixel focus outline with offset", () => {
    expect(ADMIN_NAV_FOCUS).toMatchObject({ outlineWidth: 2, outlineOffset: 2 });
  });
});
