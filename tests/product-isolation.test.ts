import { afterEach, describe, expect, it } from "vitest";
import {
  publicRequestOrigin,
  trustedProductOrigin,
} from "../src/lib/public-request-origin";
import { safeAuthDestinationForOrigin } from "../src/lib/auth-security";
import {
  conduzcoHostRoute,
  safeConduzcoDestination,
} from "../src/lib/akiconduzco-routing";
import { POST } from "../src/app/api/car-rentals/bookings/route";
import { readFileSync } from "node:fs";
describe("AkiCoches isolated identity and booking boundary", () => {
  afterEach(() => {
    delete process.env.AKISUITE_ALLOWED_PREVIEW_ORIGINS;
  });
  it("does not reflect hostile forwarded hosts or Origin into callbacks", () => {
    expect(
      publicRequestOrigin(
        new Headers({
          host: "akicoches.com",
          "x-forwarded-host": "evil.example",
          origin: "https://evil.example",
        }),
      ),
    ).toBe("https://akicoches.com");
    expect(publicRequestOrigin(new Headers({ host: "evil.example" }))).toBe(
      "https://akicoches.com",
    );
  });
  it("allows only exact configured preview origins", () => {
    process.env.AKISUITE_ALLOWED_PREVIEW_ORIGINS =
      "https://coches-preview.example.workers.dev";
    expect(
      trustedProductOrigin("https://coches-preview.example.workers.dev"),
    ).toBe(true);
    expect(trustedProductOrigin("https://evil.workers.dev")).toBe(false);
    expect(
      safeAuthDestinationForOrigin(
        "en",
        "/rentals/car?lang=en",
        "https://coches-preview.example.workers.dev",
      ),
    ).toBe("/rentals/car?lang=en");
  });
  it("retains local recovery task and rejects foreign, encoded and control-character returns", () => {
    expect(
      safeAuthDestinationForOrigin(
        "en",
        "/en/auth/recover?next=%2Faccount",
        "http://localhost:3103",
      ),
    ).toContain("/en/auth/recover");
    for (const value of [
      "//evil.example",
      "https://evil.example/account",
      "/\\evil.example",
      "\r\nhttps://evil.example",
      "/%2f%2fevil.example",
    ])
      expect(safeConduzcoDestination(value)).toBe("/account");
  });
  it("does not expose unrelated APIs, but preserves legal pages", () => {
    expect(conduzcoHostRoute("/api/car-rentals-private").kind).toBe("reject");
    expect(conduzcoHostRoute("/api/stripe/webhook").kind).toBe("reject");
    expect(conduzcoHostRoute("/en/terms").kind).toBe("public");
    expect(conduzcoHostRoute("/es/privacy").kind).toBe("public");
  });
  it("does not publish a directly guessed company page without an active fleet", () => {
    const rentalPage = readFileSync("src/app/rentals/[slug]/page.tsx", "utf8");
    expect(rentalPage).toContain(
      "if (error || listings.length === 0) notFound()",
    );
  });
  it("rejects cross-origin booking before credentials or database access", async () => {
    const response = await POST(
      new Request("https://akicoches.com/api/car-rentals/bookings", {
        method: "POST",
        headers: { origin: "https://evil.example" },
        body: "{}",
      }),
    );
    expect(response.status).toBe(403);
  });
  it("rejects malformed same-origin booking before database access", async () => {
    const response = await POST(
      new Request("https://akicoches.com/api/car-rentals/bookings", {
        method: "POST",
        headers: { origin: "https://akicoches.com" },
        body: "{}",
      }),
    );
    expect(response.status).toBe(400);
  });
});
