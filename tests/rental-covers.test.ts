import { describe, expect, it, vi } from "vitest";
import { withRentalCovers } from "../src/lib/rental-covers";
import type { RentalListing } from "../src/lib/akiconduzco";

const listing: RentalListing = {
  vehicle_id: "vehicle-1",
  vehicle_name: "City car",
  category: "economy",
  transmission: "manual",
  fuel: "petrol",
  seats: 5,
  luggage: 2,
  daily_price_cents: 3900,
  deposit_cents: 10000,
  image_url: null,
  company_id: "company-1",
  company_slug: "city-cars",
  company_name: "City Cars",
  city: "Fuengirola",
  address: "Calle Test",
  latitude: 36.54,
  longitude: -4.62,
  total: 1,
};

describe("public rental cover selection", () => {
  it("signs only the selected cover returned by venue and Storage RLS", async () => {
    const signed = vi.fn().mockResolvedValue({
      data: [
        {
          path: "venue/cover.webp",
          signedUrl: "https://storage.example/signed",
        },
      ],
    });
    const client = {
      from: (table: string) => ({
        select: () => ({
          in: async () => ({
            data:
              table === "car_rental_vehicles"
                ? [{ id: "vehicle-1", cover_media_id: "cover-1" }]
                : [{ id: "cover-1", storage_path: "venue/cover.webp" }],
            error: null,
          }),
        }),
      }),
      storage: { from: () => ({ createSignedUrls: signed }) },
    };
    const result = await withRentalCovers(client as never, [listing]);
    expect(result[0].image_url).toBe("https://storage.example/signed");
    expect(signed).toHaveBeenCalledWith(["venue/cover.webp"], 3600);
  });

  it("does not expose a denied media path or replace the previous image", async () => {
    const client = {
      from: (table: string) => ({
        select: () => ({
          in: async () => ({
            data:
              table === "car_rental_vehicles"
                ? [{ id: "vehicle-1", cover_media_id: "cover-1" }]
                : [],
            error: null,
          }),
        }),
      }),
      storage: { from: () => ({ createSignedUrls: vi.fn() }) },
    };
    const existing = {
      ...listing,
      image_url: "https://images.example/old.webp",
    };
    expect(await withRentalCovers(client as never, [existing])).toEqual([
      existing,
    ]);
  });
});
