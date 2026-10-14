import { describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
vi.mock("@/lib/supabase/middleware", () => ({
  refreshSession: async () => NextResponse.next(),
}));
import { middleware } from "../src/middleware";
const request = (path: string, method = "GET", host = "localhost:3103") =>
  new NextRequest(`http://${host}${path}`, { method, headers: { host } });
describe("independent canonical route middleware", () => {
  it("serves the actual rental route without recursive virtual-host rewrite", async () => {
    const response = await middleware(request("/?lang=en"));
    expect(response.status).toBe(200);
    expect(response.headers.has("x-middleware-rewrite")).toBe(false);
    expect(response.headers.get("x-middleware-request-x-akipasa-product")).toBe(
      "akiconduzco",
    );
    expect(response.headers.get("x-middleware-request-x-akipasa-locale")).toBe(
      "en",
    );
  });
  it("preserves legacy rental path query in one safe local redirect", async () => {
    const response = await middleware(request("/akiconduzco/map?lang=en"));
    expect(response.status).toBe(308);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/map");
    expect(new URL(response.headers.get("location")!).search).toBe("?lang=en");
  });
  it("rejects unknown hosts and unrelated API mutations", async () => {
    expect((await middleware(request("/", "GET", "evil.example"))).status).toBe(
      421,
    );
    expect(
      (await middleware(request("/api/stripe/webhook", "POST"))).status,
    ).toBe(404);
    expect(
      (await middleware(request("/en/business/mobility", "POST"))).status,
    ).toBe(404);
  });
  it("keeps fleet handoff fixed to canonical Business and private pages unindexed", async () => {
    const response = await middleware(
      request("/en/business/mobility?tab=fleet"),
    );
    expect(response.headers.get("location")).toBe(
      "https://akibusiness.com/en/business/mobility?tab=fleet",
    );
    expect(
      (await middleware(request("/account"))).headers.get("x-robots-tag"),
    ).toBe("noindex, nofollow");
  });
});
