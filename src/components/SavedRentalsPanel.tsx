"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatRentalPrice } from "@/lib/akiconduzco";
import {
  readSavedRentals,
  removeSavedRental,
  SAVED_RENTALS_EVENT,
  SAVED_RENTALS_KEY,
  type SavedRental,
} from "@/lib/saved-rentals";
import styles from "./SavedRentalsPanel.module.css";

export function SavedRentalsPanel({ locale }: { locale: "en" | "es" }) {
  const es = locale === "es";
  const [items, setItems] = useState<SavedRental[]>([]);
  const [ready, setReady] = useState(false);
  const refresh = useCallback(() => {
    setItems(readSavedRentals(window.localStorage));
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    const storage = (event: StorageEvent) => {
      if (!event.key || event.key === SAVED_RENTALS_KEY) refresh();
    };
    window.addEventListener("storage", storage);
    window.addEventListener(SAVED_RENTALS_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", storage);
      window.removeEventListener(SAVED_RENTALS_EVENT, refresh);
    };
  }, [refresh]);

  function remove(vehicleId: string) {
    setItems(removeSavedRental(window.localStorage, vehicleId));
    window.dispatchEvent(new Event(SAVED_RENTALS_EVENT));
  }

  if (!ready) {
    return (
      <div className={styles.message}>{es ? "Cargando…" : "Loading…"}</div>
    );
  }

  if (!items.length) {
    return (
      <div className={styles.message}>
        <strong>
          {es ? "Aún no has guardado ningún coche" : "No saved cars yet"}
        </strong>
        <p>
          {es
            ? "Abre una empresa de alquiler y pulsa Guardar coche para crear tu lista."
            : "Open a rental company and choose Save car to build your shortlist."}
        </p>
        <Link href={`/?lang=${locale}`}>
          {es ? "Explorar coches →" : "Explore cars →"}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className={styles.deviceNote}>
        {es
          ? "Guardados solo en este navegador. La sincronización con tu cuenta todavía no está disponible."
          : "Saved on this browser only. Account sync is not available yet."}
      </p>
      <div className={styles.list}>
        {items.map((item) => (
          <article className={styles.card} key={item.vehicle_id}>
            <div className={styles.image}>
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt=""
                  fill
                  sizes="96px"
                  unoptimized
                />
              ) : (
                <span aria-hidden="true">↗</span>
              )}
            </div>
            <div className={styles.details}>
              <small>
                {item.company_name} · {item.city}
              </small>
              <h3>{item.vehicle_name}</h3>
              <strong>
                {formatRentalPrice(item.daily_price_cents, locale)} /{" "}
                {es ? "día" : "day"}
              </strong>
            </div>
            <div className={styles.actions}>
              <Link
                href={`/rentals/${encodeURIComponent(item.company_slug)}?lang=${locale}&vehicle=${encodeURIComponent(item.vehicle_id)}`}
              >
                {es ? "Ver coche" : "View car"}
              </Link>
              <button type="button" onClick={() => remove(item.vehicle_id)}>
                {es ? "Quitar" : "Remove"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
