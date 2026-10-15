// @vitest-environment jsdom
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { AkiConduzco, ConduzcoMap } from "../src/components/AkiConduzco";

vi.mock("maplibre-gl", () => ({
  default: {
    Map: class {
      constructor() {
        throw new Error("WebGL unavailable");
      }
    },
  },
}));

describe("rental map initialization failure", () => {
  beforeEach(() => vi.stubGlobal("React", React));
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  for (const locale of ["en", "es"] as const) {
    it(`offers an accessible same-origin catalogue fallback in ${locale}`, async () => {
      render(
        React.createElement(ConduzcoMap, {
          locale,
          styleUrl: "https://tiles.openfreemap.org/styles/liberty",
          initialQuery: "Fuengirola & coast",
        }),
      );
      await screen.findByRole("alert");
      const link = screen.getByRole("link", {
        name:
          locale === "en"
            ? "Browse rental catalogue"
            : "Ver catálogo de coches",
      });
      expect(link.getAttribute("href")).toBe(
        `/?lang=${locale}&q=Fuengirola+%26+coast`,
      );
      expect(
        screen.getByRole("textbox", {
          name:
            locale === "en"
              ? "Search city or company"
              : "Busca ciudad o empresa",
        }),
      ).toBeTruthy();
    });
  }

  it("retains the fallback search in the normal catalogue request", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({ rows: [], total: 0 }),
      });
    vi.stubGlobal("fetch", fetcher);
    render(
      React.createElement(AkiConduzco, {
        locale: "en",
        initialQuery: "Fuengirola & coast",
      }),
    );
    await waitFor(() => expect(fetcher).toHaveBeenCalled());
    const request = new URL(fetcher.mock.calls[0][0], "https://akicoches.com");
    expect(request.searchParams.get("q")).toBe("Fuengirola & coast");
  });
});
