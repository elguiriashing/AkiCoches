import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
const mocks = vi.hoisted(() => ({ refresh: vi.fn(), headers: vi.fn() }));
vi.mock("@/lib/supabase/middleware", () => ({ refreshSession: mocks.refresh }));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
import { middleware } from "../src/middleware";
import robots from "../src/app/robots";

const request = (path: string, method = "GET", host = "akicoches.com") =>
  new NextRequest(`https://${host}${path}`, { method, headers: { host } });

beforeEach(() => {
  vi.resetAllMocks();
  mocks.refresh.mockResolvedValue(NextResponse.next());
  mocks.headers.mockResolvedValue(new Headers({ host: "akicoches.com" }));
  vi.stubEnv("AKICOCHES_INDEXING_ENABLED", "false");
});
afterEach(() => vi.unstubAllEnvs());

describe("crawler access without changing authentication", () => {
  it.each(["/robots.txt", "/sitemap.xml"])("serves %s during an Auth outage", async (path) => {
    mocks.refresh.mockRejectedValue(new Error("Auth unavailable"));
    for (const method of ["GET", "HEAD"]) {
      const response = await middleware(request(path, method));
      expect(response.status).toBe(200);
      expect(response.headers.has("x-robots-tag")).toBe(false);
      expect(response.headers.has("set-cookie")).toBe(false);
    }
    expect(mocks.refresh).not.toHaveBeenCalled();
    expect((await middleware(request(path, "POST"))).status).toBe(404);
    expect((await middleware(request(path, "GET", "evil.example"))).status).toBe(421);
  });
  it.each(["/", "/membership"])("allows the canonical public page %s", async (path) => {
    const response = await middleware(request(path));
    expect(response.status).toBe(200);
    expect(response.headers.has("x-robots-tag")).toBe(false);
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });
  it.each(["/account", "/settings", "/bookings", "/en/auth/callback"])("keeps %s private and session-aware", async (path) => {
    const response = await middleware(request(path));
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });
  it("keeps local and preview copies excluded even when inventory is enabled", async () => {
    vi.stubEnv("AKICOCHES_INDEXING_ENABLED", "true");
    expect((await middleware(request("/", "GET", "localhost:3103"))).headers.get("x-robots-tag")).toBe("noindex, nofollow");
    mocks.headers.mockResolvedValue(new Headers({ host: "preview.workers.dev" }));
    expect(await robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });
});

it("does not index unapproved rental inventory", async () => {
  expect((await middleware(request("/rentals/branch"))).headers.get("x-robots-tag")).toBe("noindex, nofollow");
  const policy = await robots();
  expect(policy.rules).toEqual(expect.objectContaining({
    disallow: "/", allow: expect.arrayContaining(["/$", "/membership$", "/brand/", "/favicon.ico", "/sitemap.xml"]),
  }));
  vi.stubEnv("AKICOCHES_INDEXING_ENABLED", "true");
  expect((await middleware(request("/rentals/branch"))).headers.has("x-robots-tag")).toBe(false);
});
