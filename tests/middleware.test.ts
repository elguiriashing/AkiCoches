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
      "https://akihq.app/en/business/mobility?tab=fleet#redirected",
    );
    expect(
      (await middleware(request("/account"))).headers.get("x-robots-tag"),
    ).toBe("noindex, nofollow");
  });
});

describe("cross-product credential transfer prevention", () => {
  it("strips nested authentication material from Business and primary fallback handoffs", async () => {
    for (const path of ["/en/business", "/unknown"]) {
      const response = await middleware(
        request(
          `${path}?tab=fleet&next=%2Fen%2Fauth%2Fcallback%3Fcode%3Dqa-dummy&q=Malaga`,
        ),
      );
      expect(response.status).toBe(307);
      const target = new URL(response.headers.get("location")!);
      expect([...target.searchParams]).toEqual([
        ["tab", "fleet"],
        ["q", "Malaga"],
      ]);
      expect(target.hash).toBe("#redirected");
      expect(response.headers.get("referrer-policy")).toBe("no-referrer");
      expect(response.headers.get("cache-control")).toBe("no-store");
    }
  });
  it("scrubs credential keys case-insensitively while preserving safe search filters", async () => {
    const response = await middleware(
      request(
        "/unknown?q=malaga&ACCESS_TOKEN=private&Code=private&token_hash=private&refresh_token=private&provider_token=private&id_token=private&client_secret=private&password=private&STATE=private&error_description=private",
      ),
    );
    const target = new URL(response.headers.get("location")!);
    expect(target.origin).toBe("https://akipasa.com");
    expect([...target.searchParams]).toEqual([["q", "malaga"]]);
    expect(target.hash).toBe("#redirected");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
  });
  it("serves membership locally and scrubs credentials on locale redirects", async () => {
    const local = await middleware(request("/membership?lang=en"));
    expect(local.status).toBe(200);
    expect(local.headers.has("location")).toBe(false);

    const response = await middleware(
      request("/en/membership?access_token=private"),
    );
    const target = new URL(response.headers.get("location")!);
    expect(response.status).toBe(308);
    expect(target.pathname).toBe("/membership");
    expect([...target.searchParams]).toEqual([["lang", "en"]]);
    expect(target.href).not.toContain("private");

    const billing = await middleware(request("/en/account/subscription"));
    expect(billing.headers.get("location")).toBe(
      "http://localhost:3103/membership?lang=en#redirected",
    );
  });
  it("keeps callback code and state on local auth route instead of a cross-product redirect", async () => {
    const response = await middleware(
      request("/en/auth/callback?code=pkce-code&state=provider-state"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.has("location")).toBe(false);
  });
  it("rejects non-read methods before any cross-domain redirect", async () => {
    for (const path of [
      "/unknown?token=private",
      "/en/account/subscription?token=private",
    ])
      expect((await middleware(request(path, "POST"))).status).toBe(404);
  });
});
