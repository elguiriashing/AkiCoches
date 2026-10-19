import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
describe("AkiCoches memberships", () => {
  const page = readFileSync("src/app/membership/page.tsx", "utf8");
  const experience = readFileSync(
    "src/components/SuitePricingExperience.tsx",
    "utf8",
  );
  const account = readFileSync("src/app/account/page.tsx", "utf8");
  it("keeps product billing independent and premium locked", () => {
    expect(page).toContain('product="akicoches"');
    expect(page).toContain("personalPremiumVisible");
    expect(experience).toContain("AkiBusiness Standard");
    expect(experience).toContain("AkiBusiness Pro");
    expect(experience).toContain("AkiEnterprise");
    expect(experience).not.toContain("stripe.checkout");
    expect(experience).toContain("personalUnlocked");
  });
  it("links to the local membership page from the account", () => {
    expect(account).toContain('href="/membership"');
  });
});
