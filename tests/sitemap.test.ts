import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

import { renderSitemap } from "@/lib/sitemap";

describe("AkiCoches sitemap", () => {
  it("only discovers published branches backed by an active fleet", () => {
    const route = readFileSync("src/app/sitemap.xml/route.ts", "utf8");
    expect(route).toContain("car_rental_vehicles!inner(id)");
    expect(route).toContain('.eq("status", "published")');
    expect(route).toContain('.eq("vehicles.status", "active")');
  });

  it("publishes standalone discovery routes and rental details", () => {
    const sitemap = renderSitemap([
      {
        slug: "costa-&-cars",
        updated_at: "2026-10-19T12:00:00.000Z",
      },
    ]);

    expect(sitemap).toContain("<loc>https://akicoches.com/</loc>");
    expect(sitemap).toContain("<loc>https://akicoches.com/map</loc>");
    expect(sitemap).toContain("<loc>https://akicoches.com/membership</loc>");
    expect(sitemap).toContain(
      "<loc>https://akicoches.com/rentals/costa-%26-cars</loc>",
    );
    expect(sitemap).toContain("<lastmod>2026-10-19T12:00:00.000Z</lastmod>");
    expect(sitemap).not.toContain("akipasa.com");
  });
});
