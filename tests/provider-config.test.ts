import { resolveProductRoles } from "../src/lib/product-roles";
import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";
describe("shared Supabase canonical project and existing alias transport", () => {
  it("allows both exact known HTTPS storage origins for rental media", () => {
    const patterns = nextConfig.images?.remotePatterns || [];
    for (const hostname of [
      "akipasa.supabase.co",
      "vhpbvcfkcteswlsdjrfl.supabase.co",
    ])
      expect(patterns).toContainEqual({
        protocol: "https",
        hostname,
        pathname: "/storage/v1/object/**",
      });
  });
  it("allows exact project HTTPS and websocket connections in CSP", async () => {
    const headers = await nextConfig.headers!();
    const csp =
      headers[0].headers.find((x) => x.key === "Content-Security-Policy")
        ?.value || "";
    const directives = csp.split("; ");
    for (const hostname of [
      "akipasa.supabase.co",
      "vhpbvcfkcteswlsdjrfl.supabase.co",
    ]) {
      expect(directives.find((x) => x.startsWith("img-src "))).toContain(
        `https://${hostname}`,
      );
      expect(directives.find((x) => x.startsWith("connect-src "))).toContain(
        `https://${hostname}`,
      );
      expect(directives.find((x) => x.startsWith("connect-src "))).toContain(
        `wss://${hostname}`,
      );
    }
  });
});

describe("coordinated management and operations roles", () => {
  it("preserves the currently deployed role map unless the flag is exactly true", () => {
    for (const roleSwap of [undefined, "false", "1", "TRUE"]) {
      const roles = resolveProductRoles({ roleSwap });
      expect(roles.managementUrl).toBe("https://akibusiness.com");
      expect(roles.managementName).toBe("AkiBusiness");
      expect(roles.operationsUrl).toBe("https://akihq.app");
    }
  });
  it("switches roles despite retained legacy canonical environment defaults", () => {
    expect(
      resolveProductRoles({
        roleSwap: "true",
        managementUrl: "https://akibusiness.com/",
        operationsUrl: "https://akihq.app",
      }),
    ).toEqual({
      swapped: true,
      managementName: "AkiHQ",
      operationsName: "AkiBusiness",
      managementUrl: "https://akihq.app",
      operationsUrl: "https://akibusiness.com",
    });
  });
  it("retains explicit preview origins without accepting credentials or paths", () => {
    expect(
      resolveProductRoles({
        roleSwap: "true",
        managementUrl: "https://hq-preview.example.workers.dev/",
      }).managementUrl,
    ).toBe("https://hq-preview.example.workers.dev");
    for (const managementUrl of [
      "javascript:alert(1)",
      "https://user:secret@example.com",
      "https://example.com/auth",
      "https://example.com/?code=private",
      "https://example.com/#private",
      "http://example.com",
    ])
      expect(
        resolveProductRoles({ roleSwap: "true", managementUrl }).managementUrl,
      ).toBe("https://akihq.app");
  });
});
