// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import * as React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SuitePricingExperience } from "../src/components/SuitePricingExperience";
afterEach(cleanup);

describe("AkiCoches audience-first membership storefront", () => {
  const page = readFileSync("src/app/membership/page.tsx", "utf8");
  const experience = readFileSync("src/components/SuitePricingExperience.tsx", "utf8");
  it("keeps native membership routing and source business/software segregation", () => {
    expect(page).toContain('product="akicoches"');
    expect(experience).toContain("AkiSuiteAudienceStudio");
    expect(experience).toContain("Business Premium");
    expect(experience).not.toContain("stripe.checkout");
    expect(experience).not.toContain("AkiEnterprise");
  });
  for (const locale of ["en", "es"] as const) {
    it(`renders personal and business offers without five unrelated cards in ${locale}`, () => {
      const {container} = render(React.createElement(SuitePricingExperience, {locale,product:"akicoches"}));
      expect(container.querySelectorAll("[data-offer]")).toHaveLength(2);
      expect(container.querySelector("#personal-free")).not.toBeNull();
      expect(container.querySelector("#personal-premium button[disabled]")).not.toBeNull();
      expect(container.querySelector("#listing-premium")).toBeNull();
      fireEvent.click(screen.getByRole("tab",{name:locale==="es"?"Negocios":"Business"}));
      expect(container.querySelectorAll("[data-offer]")).toHaveLength(2);
      expect(container.querySelector("#akihq-free")).not.toBeNull();
      expect(container.querySelector("#listing-premium")?.textContent).toContain("€14.99");
      expect(container.querySelector("#listing-premium")?.textContent).toContain("AkiCoches Business Premium");
      expect(container.textContent).toContain("AkiBusiness");
      expect(container.querySelector('a[href*="akibusiness.com"]')).not.toBeNull();
      expect(container.querySelector('form')).toBeNull();
      const premium = container.querySelector("#listing-premium");
      expect(premium?.textContent).toContain(locale==="es"?"checkout pendiente":"checkout not yet live");
    });
  }
  it("uses the identical reviewed audience component and stylesheet across discovery apps", () => {
    for (const [path,sha] of [
      ["src/components/AkiSuiteAudienceStudio.tsx","fbd1fac9f9ae6adae497f359fb0ef2f92cbe6c1f"],
      ["src/components/AkiSuiteAudienceStudio.module.css","0bf1c16d123b5f7e7c93e228ef318083ef6b8a91"],
    ] as const) {
      const b=readFileSync(path);
      expect(createHash("sha1").update("blob "+b.length+"\0").update(b).digest("hex")).toBe(sha);
    }
  });
});
