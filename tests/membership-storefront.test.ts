import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
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
      'type Offer = "hq" | "listing" | "standard" | "plus" | "pro"',
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
  });
  it("links to the local membership page from the account", () => {
    expect(account).toContain('href="/membership"');
  });
});
