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
