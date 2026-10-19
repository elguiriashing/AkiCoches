import { z } from "zod";

export const SAVED_RENTALS_KEY = "akicoches:saved-rentals:v1";
export const SAVED_RENTALS_EVENT = "akicoches:saved-rentals-changed";

const savedRentalSchema = z.object({
  vehicle_id: z.string().min(1).max(100),
  vehicle_name: z.string().min(1).max(120),
  company_slug: z.string().min(1).max(160),
  company_name: z.string().min(1).max(120),
  city: z.string().min(1).max(100),
  daily_price_cents: z.number().int().min(100).max(1_000_000),
  image_url: z.string().url().nullable(),
  saved_at: z.string().datetime(),
});

const savedRentalsSchema = z.array(savedRentalSchema).max(50);

export type SavedRental = z.infer<typeof savedRentalSchema>;

export function readSavedRentals(storage: Pick<Storage, "getItem">) {
  try {
    const raw = storage.getItem(SAVED_RENTALS_KEY);
    if (!raw) return [];
    const parsed = savedRentalsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function saveRental(
  storage: Pick<Storage, "getItem" | "setItem">,
  rental: Omit<SavedRental, "saved_at">,
) {
  const next = [
    { ...rental, saved_at: new Date().toISOString() },
    ...readSavedRentals(storage).filter(
      (item) => item.vehicle_id !== rental.vehicle_id,
    ),
  ].slice(0, 50);
  storage.setItem(SAVED_RENTALS_KEY, JSON.stringify(next));
  return next;
}

export function removeSavedRental(
  storage: Pick<Storage, "getItem" | "setItem">,
  vehicleId: string,
) {
  const next = readSavedRentals(storage).filter(
    (item) => item.vehicle_id !== vehicleId,
  );
  storage.setItem(SAVED_RENTALS_KEY, JSON.stringify(next));
  return next;
}
