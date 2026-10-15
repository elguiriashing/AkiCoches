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
