import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
describe("AkiCoches memberships", () => {
  const page = readFileSync("src/app/membership/page.tsx", "utf8");
  const experience = readFileSync(
    "src/components/SuitePricingExperience.tsx",
    "utf8",
  );
  const account = readFileSync("src/app/account/page.tsx", "utf8");
  it("shows the five-plan commercial ladder without a public tool selector", () => {
    expect(page).toContain('product="akicoches"');
    expect(experience).toContain(
      'type Offer = "hq" | "listing" | "basico" | "standard" | "pro"',
    );
    expect(experience).toContain("AkiHQ");
    expect(experience).toContain("AkiCoches");
    expect(experience).toContain("AkiBusiness Standard");
    expect(experience).toContain("AkiBusiness Plus");
    expect(experience).toContain("AkiBusiness Pro");
    expect(experience).toContain("Choose 4 of 12 operating tools");
    expect(experience).toContain("Choose 8 of 12 operating tools");
    expect(experience).toContain("All 12 operating tools");
    expect(experience).not.toContain("What kind of business do you run?");
    expect(experience).not.toContain("AkiEnterprise");
    expect(experience).not.toContain("stripe.checkout");
    const studio = readFileSync("src/components/AkiSuiteMembershipStudio.tsx", "utf8");
    expect(studio).toContain('"/brand/hq-mark.svg"');
    expect(studio).toContain('"/brand/business-mark.svg"');
    expect(studio).toContain("hqGroup");
    expect(studio).toContain("businessGroup");
    expect(experience).toContain("AkiSuiteMembershipStudio");
    expect(experience).not.toContain("cardBrand");
    const style = readFileSync("src/components/AkiSuiteMembershipStudio.module.css", "utf8");
    expect(style).toContain("grid-template-columns: repeat(5, minmax(0, 1fr))");
    expect(style).toContain("grid-column: 1 / span 2");
    expect(style).toContain("grid-column: 3 / span 3");
    expect(style).toContain("width: 1px");
    expect(style).toContain("overflow-x: auto");
  });
  it("links to the local membership page from the account", () => {
    expect(account).toContain('href="/membership"');
  });
});

import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SuitePricingExperience } from "../src/components/SuitePricingExperience";

for (const locale of ["en", "es"] as const) {
  it(`renders five distinct approved monthly cards in ${locale}`, () => {
    const html = renderToStaticMarkup(
      React.createElement(SuitePricingExperience, {
        locale,
        product: "akicoches",
      }),
    );
    const cards = html.match(/<article\b[\s\S]*?<\/article>/g) ?? [];
    expect(cards).toHaveLength(5);
    // Brand art must sit above GROUPS, never be repeated in individual cards.
    expect((html.match(/src="\/brand\/hq-mark.svg"/g) ?? [])).toHaveLength(1);
    expect((html.match(/src="\/brand\/business-mark.svg"/g) ?? [])).toHaveLength(1);
    for (const card of cards) expect(card).not.toContain("<img");
    for (const [name, cents, tools, replacements] of [
      ["Standard", 2499, locale === "es" ? "4 de 12" : "4 of 12", "1"],
      ["Plus", 4499, locale === "es" ? "8 de 12" : "8 of 12", "2"],
      [
        "Pro",
        6499,
        locale === "es" ? "Las 12" : "All 12",
        locale === "es" ? "sin límite" : "Unrestricted",
      ],
    ] as const) {
      const card = cards.find((value) => value.includes(`AkiBusiness ${name}`));
      const amount = new Intl.NumberFormat(
        locale === "es" ? "es-ES" : "en-IE",
        { style: "currency", currency: "EUR" },
      ).format(cents / 100);
      expect(card).toContain(amount);
      expect(card).toContain(tools);
      expect(card).toContain(replacements);
      expect(card?.replace(/<[^>]+>/g, "")).not.toMatch(
        /239[.,]90|431[.,]90|623[.,]90|20\s?%|yearly|al año/,
      );
    }
    expect(html.replace(/<[^>]+>/g, "")).not.toMatch(
      /Most popular|Más elegido|20\s?%/,
    );
    expect(html).not.toContain("aria-pressed=");
    expect(html).toContain(locale === "es" ? "8 herramientas" : "8 tools");
    expect(html).toContain(
      locale === "es" ? "rotación mensual" : "monthly rotation",
    );
    expect(html).toContain(locale === "es" ? "al instante" : "instantly");
    expect(html).toContain(`https://akihq.app/${locale}/business`);
    expect(html).toContain(locale === "es" ? "tu ficha de AkiCoches" : "free AkiCoches listing");
    expect(html).toContain(locale === "es" ? "PARA AKIHQ" : "FOR AKIHQ");
    expect(html).toContain(locale === "es" ? "herramientas Premium de AkiCoches" : "deluxe suite of AkiCoches listing tools");
  });
}


describe("Canonical AkiSuite membership studio source parity", () => {
  it("uses the same reviewed template and stylesheet as all three discovery apps", () => {
    const expected = [
      ["src/components/AkiSuiteMembershipStudio.tsx", "28c8f7ee48d49ff91cad63c55e3aacaadfe3c28d"],
      ["src/components/AkiSuiteMembershipStudio.module.css", "4b42977034d6a285fd355e7afcb72583779b5862"],
    ] as const;
    for (const [path, sha] of expected) {
      const content = readFileSync(path);
      const gitBlobSha = createHash("sha1")
        .update("blob " + content.length + "\0")
        .update(content)
        .digest("hex");
      expect(gitBlobSha, path).toBe(sha);
    }
  });
});
