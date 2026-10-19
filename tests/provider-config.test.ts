import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";
import { resolveProductOrigin } from "../src/lib/config";
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

describe("AkiSuite management and operations origins", () => {
  it("maps historical defaults to the current product roles", () => {
    expect(
      resolveProductOrigin(
        "https://akibusiness.com",
        "https://akibusiness.com",
        "https://akihq.app",
      ),
    ).toBe("https://akihq.app");
    expect(
      resolveProductOrigin(
        "https://akihq.app",
        "https://akihq.app",
        "https://akibusiness.com",
      ),
    ).toBe("https://akibusiness.com");
  });

  it("preserves safe preview origins and rejects credentialed or pathful URLs", () => {
    expect(
      resolveProductOrigin(
        "https://preview.example.test/",
        "https://legacy.example.test",
        "https://canonical.example.test",
      ),
    ).toBe("https://preview.example.test");
    for (const candidate of [
      "https://user:secret@example.test",
      "https://example.test/path",
      "javascript:alert(1)",
    ])
      expect(
        resolveProductOrigin(
          candidate,
          "https://legacy.example.test",
          "https://canonical.example.test",
        ),
      ).toBe("https://canonical.example.test");
  });
});
