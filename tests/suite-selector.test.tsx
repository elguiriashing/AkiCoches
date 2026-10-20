import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ConduzcoHeader } from "../src/components/AkiConduzco";
vi.mock("../src/app/[locale]/auth/actions", () => ({ signOut: vi.fn() }));
vi.mock("../src/components/LanguageLink", () => ({ LanguageLink: () => null }));
vi.mock("../src/components/ThemeModeControls", () => ({
  ThemeToggle: () => null,
}));
vi.mock("../src/components/PortalLogo", () => ({ PortalLogo: () => null }));
vi.stubGlobal("React", React);
describe("actual desktop/mobile suite selector destinations", () => {
  for (const locale of ["en", "es"] as const) {
    it(`renders all five canonical ${locale} destinations`, () => {
      const html = renderToStaticMarkup(<ConduzcoHeader locale={locale} />);
      for (const expected of [
        `https://akipasa.com/${locale}`,
        `https://akiduermo.com/?lang=${locale}`,
        `/?lang=${locale}`,
        `https://akihq.app/${locale}/business`,
        `https://akibusiness.com/?locale=${locale}`,
      ])
        expect(html).toContain(`href="${expected}"`);
    });
  }
});
