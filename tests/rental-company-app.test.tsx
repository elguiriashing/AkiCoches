// @vitest-environment jsdom
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { RentalCompanyApp } from "../src/components/RentalCompanyApp";
import { SavedRentalsPanel } from "../src/components/SavedRentalsPanel";
import { rentalRangeBlocked } from "../src/lib/rental-calendar";
import type { RentalListing } from "../src/lib/akiconduzco";
vi.mock("../src/components/AkiConduzco", () => ({
  ConduzcoHeader: () => null,
}));
const car = {
  vehicle_id: "vehicle-1",
  vehicle_name: "Mustang GT",
  category: "premium",
  transmission: "manual",
  fuel: "petrol",
  seats: 2,
  luggage: 2,
  daily_price_cents: 11000,
  deposit_cents: 5000,
  image_url: null,
  company_id: "company-1",
  company_slug: "coches",
  company_name: "Local Cars",
  city: "Fuengirola",
  address: "Calle test",
  latitude: 36.5,
  longitude: -4.6,
  total: 1,
} satisfies RentalListing;
beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal("React", React);
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ rows: [car] }) }),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("company-first rental journey", () => {
  it("browses cars before asking for contact details", () => {
    render(<RentalCompanyApp locale="en" slug="coches" listings={[car]} />);
    expect(screen.getByRole("heading", { name: "Local Cars" })).toBeTruthy();
    expect(screen.queryByLabelText("Your name")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Choose dates/ }));
    expect(
      screen
        .getByRole("button", { name: /Continue with this car/ })
        .hasAttribute("disabled"),
    ).toBe(true);
  });
  it("saves and removes a real car on this browser without claiming account sync", () => {
    render(<RentalCompanyApp locale="en" slug="coches" listings={[car]} />);
    const save = screen.getByRole("button", { name: /Save car/ });
    fireEvent.click(save);
    expect(
      screen
        .getByRole("button", { name: /Saved/ })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(window.localStorage.getItem("akicoches:saved-rentals:v1")).toContain(
      "vehicle-1",
    );
    fireEvent.click(screen.getByRole("button", { name: /Saved/ }));
    expect(window.localStorage.getItem("akicoches:saved-rentals:v1")).toBe(
      "[]",
    );
  });
  it("shows the device-only boundary and lets the customer remove a saved car", () => {
    window.localStorage.setItem(
      "akicoches:saved-rentals:v1",
      JSON.stringify([
        {
          vehicle_id: car.vehicle_id,
          vehicle_name: car.vehicle_name,
          company_slug: car.company_slug,
          company_name: car.company_name,
          city: car.city,
          daily_price_cents: car.daily_price_cents,
          image_url: car.image_url,
          saved_at: new Date().toISOString(),
        },
      ]),
    );
    render(<SavedRentalsPanel locale="en" />);
    expect(screen.getByText(/Saved on this browser only/)).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "View car" }).getAttribute("href"),
    ).toContain("vehicle-1");
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.getByText("No saved cars yet")).toBeTruthy();
  });
  it("does not unlock request when server says unavailable", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ rows: [] }),
    } as Response);
    render(
      <RentalCompanyApp
        locale="en"
        slug="coches"
        listings={[car]}
        initialStart="2099-01-01"
        initialEnd="2099-01-03"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /02 Dates/ }));
    await screen.findByText("Unavailable for these dates");
    expect(
      screen
        .getByRole("button", { name: /Continue with this car/ })
        .hasAttribute("disabled"),
    ).toBe(true);
  });
  it("shows estimated price and unlocks request only after the authoritative search", async () => {
    render(
      <RentalCompanyApp
        locale="en"
        slug="coches"
        listings={[car]}
        initialStart="2099-01-01"
        initialEnd="2099-01-03"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /02 Dates/ }));
    await waitFor(() =>
      expect(
        screen
          .getByRole("button", { name: /Continue with this car/ })
          .hasAttribute("disabled"),
      ).toBe(false),
    );
    expect(screen.getByText(/2 days · €220/)).toBeTruthy();
    fireEvent.click(
      screen.getByRole("button", { name: /Continue with this car/ }),
    );
    expect(screen.getByLabelText("Your name")).toBeTruthy();
  });
  it("keeps the company visible with an empty fleet", () => {
    render(
      <RentalCompanyApp
        locale="es"
        slug="coches"
        company={{ name: "Local Cars", city: "Fuengirola" }}
        listings={[]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Local Cars" })).toBeTruthy();
    expect(screen.getByText("La flota está en camino")).toBeTruthy();
  });
  it("uses exclusive drop-off boundaries and detects blocks inside a selected range", () => {
    const blocks = [
      { vehicle_id: "v", start_date: "2099-01-04", end_date: "2099-01-06" },
    ];
    expect(rentalRangeBlocked(blocks, "v", "2099-01-01", "2099-01-04")).toBe(
      false,
    );
    expect(rentalRangeBlocked(blocks, "v", "2099-01-01", "2099-01-05")).toBe(
      true,
    );
    expect(
      rentalRangeBlocked(blocks, "other", "2099-01-01", "2099-01-05"),
    ).toBe(false);
  });
});
