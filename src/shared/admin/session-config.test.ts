import { describe, expect, it } from "vitest";
import {
  adminAuthEndpoint,
  ADMIN_ACCESS_TOKEN_MAX_AGE_SECONDS,
  ADMIN_REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "./session-config";

describe("admin session configuration", () => {
  it("uses the backend global API prefix for refresh and logout", () => {
    expect(adminAuthEndpoint("http://localhost:4000", "refresh")).toBe(
      "http://localhost:4000/api/user/refresh",
    );
    expect(adminAuthEndpoint("http://localhost:4000/", "logout")).toBe(
      "http://localhost:4000/api/user/logout",
    );
  });

  it("keeps the approved access and refresh lifetimes", () => {
    expect(ADMIN_ACCESS_TOKEN_MAX_AGE_SECONDS).toBe(4 * 60);
    expect(ADMIN_REFRESH_TOKEN_MAX_AGE_SECONDS).toBe(60 * 60);
  });
});
