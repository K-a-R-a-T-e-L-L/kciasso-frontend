import { describe, expect, it } from "vitest";
import {
  adminNewsControllerGetNewsQueryParamsSortEnum,
  adminNewsControllerGetNewsQueryParamsStatusEnum,
} from "@/shared/api/generated/types";
import {
  adminNewsHref,
  adminNewsRequest,
  parseAdminNewsQuery,
} from "./admin-news-query";

describe("admin news URL/server query", () => {
  it.each([10, 20, 50, 100])("accepts limit %s", (limit) => {
    expect(parseAdminNewsQuery({ limit: String(limit) }).limit).toBe(limit);
  });

  it("uses page=1, limit=20 and sort=newest defaults", () => {
    expect(parseAdminNewsQuery({})).toMatchObject({ page: 1, limit: 20, status: "all", sort: "newest" });
  });

  it("maps URL status through the generated status enum", () => {
    const query = parseAdminNewsQuery({ status: adminNewsControllerGetNewsQueryParamsStatusEnum.scheduled });
    expect(adminNewsRequest(query).status).toBe(adminNewsControllerGetNewsQueryParamsStatusEnum.scheduled);
  });

  it("omits backend status for all and never sends isPublished", () => {
    const request = adminNewsRequest(parseAdminNewsQuery({ status: "all" }));
    expect(request).not.toHaveProperty("status");
    expect(request).not.toHaveProperty("isPublished");
  });

  it("maps sort through the generated sort enum", () => {
    const request = adminNewsRequest(parseAdminNewsQuery({ sort: adminNewsControllerGetNewsQueryParamsSortEnum.title }));
    expect(request.sort).toBe(adminNewsControllerGetNewsQueryParamsSortEnum.title);
  });

  it("resets page when a filter changes", () => {
    const state = parseAdminNewsQuery({ page: "4", search: "ГИА", status: "draft", sort: "oldest", limit: "50" });
    expect(adminNewsHref(state, { status: "published" }, true)).toContain("page=1");
  });

  it("resets page when limit changes", () => {
    const state = parseAdminNewsQuery({ page: "4", limit: "20" });
    expect(adminNewsHref(state, { limit: 100 }, true)).toContain("page=1");
  });

  it("preserves every filter when page changes", () => {
    const state = parseAdminNewsQuery({ search: "ГИА", status: "draft", category: "exam", sort: "title", limit: "50" });
    const href = adminNewsHref(state, { page: 2 });
    expect(href).toBe("/admin/news?page=2&limit=50&search=%D0%93%D0%98%D0%90&status=draft&category=exam&sort=title");
  });

  it("builds the exact server query before pagination", () => {
    expect(adminNewsRequest(parseAdminNewsQuery({
      page: "3",
      limit: "50",
      search: "exam",
      status: "published",
      category: "gia",
      sort: "oldest",
    }))).toEqual({
      page: 3,
      limit: 50,
      search: "exam",
      status: "published",
      category: "gia",
      sort: "oldest",
    });
  });

  it("rejects unsupported URL values to safe defaults", () => {
    expect(parseAdminNewsQuery({ page: "-1", limit: "13", status: "DRAFT", sort: "random" })).toMatchObject({
      page: 1,
      limit: 20,
      status: "all",
      sort: "newest",
    });
  });
});
