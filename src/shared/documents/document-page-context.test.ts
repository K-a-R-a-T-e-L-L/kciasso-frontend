import { describe, expect, it } from "vitest";
import { resolveDocumentPageContext } from "./document-placement-registry";

const allGroups = ["gia-9", "gia-11", "gia", "quality", "regional", "about"];

describe("document page context", () => {
  it("uses a neutral context when no filter is selected", () => {
    const context = resolveDocumentPageContext({ allowedGroupIds: allGroups, canSeeAll: true });
    expect(context.title).toBe("Материалы и документы");
    expect(context.queryPlacementKey).toBe("gia-9.normative-documents");
  });

  it("maps explicit all, group and placement contexts", () => {
    expect(resolveDocumentPageContext({ scope: "all", allowedGroupIds: allGroups, canSeeAll: true }).title)
      .toBe("Все материалы и документы");
    expect(resolveDocumentPageContext({ group: "GIA_11", allowedGroupIds: allGroups, canSeeAll: true }).title)
      .toBe("Документы ГИА-11");
    expect(resolveDocumentPageContext({ placement: "gia-11.essay", allowedGroupIds: allGroups, canSeeAll: true }).title)
      .toBe("ГИА-11 · Итоговое сочинение");
  });

  it("does not leak unknown or forbidden keys", () => {
    const context = resolveDocumentPageContext({ placement: "gia-11.essay", allowedGroupIds: ["gia-9"], canSeeAll: false });
    expect(context.title).toBe("Материалы и документы");
    expect(context.title).not.toContain("gia-11");
    expect(context.queryPlacementKey).toBe("gia-9.normative-documents");
    expect(resolveDocumentPageContext({ placement: "tampered.key", allowedGroupIds: allGroups, canSeeAll: true }).title)
      .toBe("Материалы и документы");
  });
});
