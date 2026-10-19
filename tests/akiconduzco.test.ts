import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  conduzcoHostMethodAllowed,
  conduzcoHostRoute,
  safeConduzcoDestination,
  conduzcoLanguageUrl,
} from "../src/lib/akiconduzco-routing";
import {
  formatRentalPrice,
  rentalEurosToCents,
  rentalSearchSchema,
} from "../src/lib/akiconduzco";

describe("AkiConduzco host and booking boundaries", () => {
  it("switches localized auth pages without losing mode, return path or origin", () => {
    const url = new URL(
      conduzcoLanguageUrl(
        "https://akicoches.example/en/auth?mode=recover&next=%2Faccount",
        "es",
      ),
    );
    expect(url.origin).toBe("https://akicoches.example");
    expect(url.pathname).toBe("/es/auth");
    expect(url.searchParams.get("mode")).toBe("recover");
    expect(url.searchParams.get("next")).toBe("/account");
    expect(url.searchParams.get("lang")).toBe("es");
    expect(
      new URL(
        conduzcoLanguageUrl("https://akicoches.example/map?q=Fuengirola", "en"),
      ).pathname,
    ).toBe("/map");
  });
  it("keeps public pages on the rental origin and rejects non-product paths", () => {
    expect(conduzcoHostRoute("/")).toEqual({
      kind: "public",
      path: "/",
    });
    expect(conduzcoHostRoute("/map")).toEqual({
      kind: "public",
      path: "/map",
    });
    expect(conduzcoHostRoute("/rentals/example-car").kind).toBe("public");
    expect(conduzcoHostRoute("/bookings")).toEqual({
      kind: "public",
      path: "/bookings",
    });
    expect(conduzcoHostRoute("/admin").kind).toBe("primary");
    expect(conduzcoHostRoute("/api/private").kind).toBe("reject");
  });

  it("allows authenticated booking requests while rejecting other writes", () => {
    expect(conduzcoHostMethodAllowed("/api/car-rentals/bookings", "POST")).toBe(
      true,
    );
    expect(conduzcoHostMethodAllowed("/api/car-rentals", "POST")).toBe(false);
    expect(conduzcoHostMethodAllowed("/account", "DELETE")).toBe(false);
  });

  it("accepts only safe same-host account return destinations", () => {
    expect(safeConduzcoDestination("/account")).toBe("/account");
    expect(safeConduzcoDestination("/rentals/a-car?lang=es")).toBe(
      "/rentals/a-car?lang=es",
    );
    expect(safeConduzcoDestination("//evil.example")).toBe("/account");
    expect(safeConduzcoDestination("https://evil.example/account")).toBe(
      "/account",
    );
  });

  it("validates bounded search dates and price ranges", () => {
    expect(
      rentalSearchSchema.safeParse({
        start: "2027-04-02",
        end: "2027-04-05",
        min: "2000",
        max: "8000",
      }).success,
    ).toBe(true);
    expect(rentalSearchSchema.safeParse({ start: "2027-04-02" }).success).toBe(
      false,
    );
    expect(
      rentalSearchSchema.safeParse({ start: "2027-04-05", end: "2027-04-02" })
        .success,
    ).toBe(false);
    expect(
      rentalSearchSchema.safeParse({ min: "8000", max: "2000" }).success,
    ).toBe(false);
    expect(formatRentalPrice(12900, "es")).toContain("129");
    expect(rentalEurosToCents(70)).toBe(7000);
  });

  it("keeps rental records separate from venue claims and mirrors both migrations", () => {
    const root = process.cwd();
    for (const name of [
      "20261014223000_akiconduzco_rentals.sql",
      "20261014230000_akiconduzco_rls_indexes.sql",
    ]) {
      const dbMigration = readFileSync(
        join(root, "database/migrations", name),
        "utf8",
      );
      const supabaseMigration = readFileSync(
        join(root, "supabase/migrations", name),
        "utf8",
      );
      expect(supabaseMigration).toBe(dbMigration);
      expect(dbMigration).toContain(
        name.endsWith("rentals.sql")
          ? "enable row level security"
          : "create policy",
      );
    }
    const rentalSchema = readFileSync(
      join(root, "database/migrations/20261014223000_akiconduzco_rentals.sql"),
      "utf8",
    );
    expect(rentalSchema).toContain("request_car_rental_booking");
    expect(rentalSchema).toContain("review_car_rental_company");
    expect(rentalSchema).not.toContain("discovery_vertical");
  });
});

describe("AkiSuite app switcher branding", () => {
  it("serves all five icons from the AkiCoches origin without remote image dependencies", () => {
    const root = process.cwd();
    const component = readFileSync(
      join(root, "src/components/AkiConduzco.tsx"),
      "utf8",
    );
    const icons = {
      pasa: "pasa-mark.svg",
      duermo: "duermo-mark.svg",
      coches: "conduzco-icon.svg",
      hq: "hq-mark.svg",
      business: "business-mark.svg",
    };
    for (const [product, filename] of Object.entries(icons)) {
      expect(component).toContain(`id: "${product}"`);
      expect(component).toContain(`icon: "/brand/${filename}"`);
      const svg = readFileSync(join(root, "public/brand", filename), "utf8");
      expect(svg).toContain('viewBox="0 0 128 128"');
      expect(svg).toContain('rx="29"');
    }
    expect(component).not.toMatch(/icon:\s*["']https?:\/\//);
    const car = readFileSync(
      join(root, "public/brand/conduzco-icon.svg"),
      "utf8",
    );
    expect(car).toContain("#FF3047");
    expect(car).toContain("#111111");
    const hq = readFileSync(join(root, "public/brand/hq-mark.svg"), "utf8");
    expect(hq).toContain("#111111");
    expect(hq).toContain("#FFC533");
    const business = readFileSync(
      join(root, "public/brand/business-mark.svg"),
      "utf8",
    );
    expect(business).toContain("ab-indigo");
    expect(business).toContain("ab-violet");
  });
});

describe("AkiCoches renter dashboard contract", () => {
  it("scopes renter history to the signed-in account and does not claim online payment", () => {
    const account = readFileSync(
      join(process.cwd(), "src/app/account/page.tsx"),
      "utf8",
    );
    const css = readFileSync(
      join(process.cwd(), "src/app/account/account.module.css"),
      "utf8",
    );
    expect(account).toContain('.eq("renter_id", user.id)');
    expect(account).toContain('["requested", "confirmed"]');
    expect(account).toContain("booking.end_date >= today");
    expect(account).toContain('filter === "upcoming"');
    expect(account).toContain('filter === "history"');
    expect(account).toContain('params.tab === "saved"');
    expect(account).toContain("SavedRentalsPanel");
    expect(account).toContain("signOut");
    expect(account).toContain("AkiCoches does not take online payments");
    expect(css).toContain("@media (max-width: 620px)");
    expect(css).toContain(':global(html[data-theme="light"])');
  });
});
