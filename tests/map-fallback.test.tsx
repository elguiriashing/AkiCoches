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
  beforeEach(() => {
    vi.stubGlobal("React", React);
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(private callback: (entries: unknown[]) => void) {}
        observe() {
          this.callback([{ contentRect: { width: 800, height: 600 } }]);
        }
        disconnect() {}
      },
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          rows: [
            {
              company_id: "company-1",
              company_name: "Local Cars",
              company_slug: "local-cars",
              vehicle_id: "car-1",
              vehicle_name: "Small car",
              daily_price_cents: 4500,
              latitude: 36.72,
              longitude: -4.42,
            },
          ],
        }),
      }),
    );
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  for (const locale of ["en", "es"] as const) {
    it(`keeps a raster map, pin and same-origin catalogue in ${locale}`, async () => {
      render(
        React.createElement(ConduzcoMap, {
          locale,
          styleUrl: "https://tiles.openfreemap.org/styles/liberty",
          initialQuery: "Fuengirola & coast",
        }),
      );
      expect(
        await screen.findByRole("region", {
          name:
            locale === "en" ? "Rental car map" : "Mapa de coches de alquiler",
        }),
      ).toBeTruthy();
      const pin = await screen.findByRole("link", {
        name: "Local Cars, 1 vehicles, from €45 per day",
      });
      expect(pin.getAttribute("href")).toBe(
        `/rentals/local-cars?lang=${locale}`,
      );
      expect(
        screen.getByRole("button", {
          name: locale === "en" ? "Zoom in" : "Acercar",
        }),
      ).toBeTruthy();
      expect(
        screen.getByRole("link", { name: "© OpenStreetMap contributors" }),
      ).toBeTruthy();
      expect(screen.queryByRole("alert")).toBeNull();
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
    const fetcher = vi.fn().mockResolvedValue({
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
