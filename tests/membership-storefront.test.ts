import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
describe("AkiCoches memberships", () => {
  const page = readFileSync("src/app/membership/page.tsx", "utf8");
  const account = readFileSync("src/app/account/page.tsx", "utf8");
  it("keeps product billing independent and premium locked", () => {
    expect(page).toContain("AkiCoches for Business");
    expect(page).toContain("AkiBusiness Standard");
    expect(page).toContain("AkiBusiness Pro");
    expect(page).toContain("AkiEnterprise");
    expect(page).not.toContain("stripe.checkout");
    expect(page).not.toContain("AkiCoches Premium</");
  });
  it("links to the local membership page from the account", () => {
    expect(account).toContain('href="/membership"');
  });
});
