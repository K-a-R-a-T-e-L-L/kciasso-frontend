import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

const original = process.env.SITE_NOINDEX;

afterEach(() => {
  if (original === undefined) delete process.env.SITE_NOINDEX;
  else process.env.SITE_NOINDEX = original;
});

describe("site noindex proxy", () => {
  it.each(["true", "false"])('sets the public response header only for %s', async (value) => {
    process.env.SITE_NOINDEX = value;
    const response = await proxy(new NextRequest("http://localhost:3002/news"));
    expect(response.headers.get("X-Robots-Tag")).toBe(
      value === "true" ? "noindex, nofollow, noarchive" : null,
    );
  });

  it("preserves the admin redirect and applies noindex to it", async () => {
    process.env.SITE_NOINDEX = "true";
    const response = await proxy(new NextRequest("http://localhost:3002/admin"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3002/admin/login");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow, noarchive");
  });
});
