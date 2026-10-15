// @vitest-environment jsdom
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ConduzcoMap } from "../src/components/AkiConduzco";

vi.mock("maplibre-gl", () => ({
  default: {
    Map: class {
      private events = new Map<string, () => void>();
      constructor() {
        queueMicrotask(() => this.events.get("load")?.());
      }
      addControl() {}
      on(name: string, callback: () => void) {
        this.events.set(name, callback);
      }
      off(name: string) {
        this.events.delete(name);
      }
      fire(name: string) {
        this.events.get(name)?.();
      }
      remove() {}
      getBounds() {
        return {
          getSouth: () => 35,
          getWest: () => -6,
          getNorth: () => 38,
          getEast: () => -3,
        };
      }
      project() {
        return { x: 420, y: 360 };
      }
    },
    NavigationControl: class {},
  },
}));

describe("rental pins on the WebGL map", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows a location pin above the map and opens fleet and directions", async () => {
    vi.stubGlobal("React", React);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          rows: [
            {
              company_id: "company-1",
              company_name: "AkiCoches",
              company_slug: "akicoches",
              vehicle_id: "vehicle-1",
              vehicle_name: "Mustang",
              city: "Fuengirola",
              daily_price_cents: 11000,
              latitude: 36.5368,
              longitude: -4.6251,
            },
          ],
        }),
      }),
    );
    render(
      React.createElement(ConduzcoMap, {
        locale: "es",
        styleUrl: "https://tiles.openfreemap.org/styles/liberty",
      }),
    );
    const pin = await screen.findByRole("button", {
      name: "AkiCoches, 1 vehicles, from €110 per day",
    });
    expect(pin.closest("div")?.getAttribute("style")).toContain("left: 420px");
    fireEvent.click(pin);
    expect(
      screen.getByRole("link", { name: "Ver flota →" }).getAttribute("href"),
    ).toBe("/rentals/akicoches?lang=es");
    expect(
      screen.getByRole("link", { name: "Cómo llegar ↗" }).getAttribute("href"),
    ).toContain("36.5368%2C-4.6251");
  });
});
