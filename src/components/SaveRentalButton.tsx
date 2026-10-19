"use client";

import { useEffect, useState } from "react";
import type { RentalListing } from "@/lib/akiconduzco";
import {
  readSavedRentals,
  removeSavedRental,
  saveRental,
  SAVED_RENTALS_EVENT,
} from "@/lib/saved-rentals";

export function SaveRentalButton({
  listing,
  locale,
  className,
}: {
  listing: RentalListing;
  locale: "en" | "es";
  className?: string;
}) {
  const es = locale === "es";
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setSaved(
      readSavedRentals(window.localStorage).some(
        (item) => item.vehicle_id === listing.vehicle_id,
      ),
    );
    setError(false);
    setReady(true);
  }, [listing.vehicle_id]);

  function toggle() {
    try {
      if (saved) {
        removeSavedRental(window.localStorage, listing.vehicle_id);
      } else {
        saveRental(window.localStorage, {
          vehicle_id: listing.vehicle_id,
          vehicle_name: listing.vehicle_name,
          company_slug: listing.company_slug,
          company_name: listing.company_name,
          city: listing.city,
          daily_price_cents: listing.daily_price_cents,
          image_url: listing.image_url,
        });
      }
      setSaved(!saved);
      setError(false);
      window.dispatchEvent(new Event(SAVED_RENTALS_EVENT));
    } catch {
      setError(true);
    }
  }

  return (
    <span>
      <button
        type="button"
        className={className}
        aria-pressed={saved}
        disabled={!ready}
        onClick={toggle}
      >
        <span aria-hidden="true">{saved ? "♥" : "♡"}</span>{" "}
        {saved
          ? es
            ? "Guardado"
            : "Saved"
          : es
            ? "Guardar coche"
            : "Save car"}
      </button>
      {error && (
        <small role="status">
          {es
            ? "El navegador no pudo guardarlo."
            : "Your browser could not save this car."}
        </small>
      )}
    </span>
  );
}
