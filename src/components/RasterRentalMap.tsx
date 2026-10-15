"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RentalListing } from "@/lib/akiconduzco";

type Locale = "en" | "es";
type Center = { latitude: number; longitude: number; zoom: number };

const TILE = 256;
const initialCenter: Center = { latitude: 36.72, longitude: -4.42, zoom: 8 };

function worldPoint(latitude: number, longitude: number, zoom: number) {
  const scale = TILE * 2 ** zoom;
  const lat = Math.max(-85.0511, Math.min(85.0511, latitude));
  const sin = Math.sin((lat * Math.PI) / 180);
  return {
    x: ((longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function coordinates(x: number, y: number, zoom: number) {
  const scale = TILE * 2 ** zoom;
  return {
    longitude: (x / scale) * 360 - 180,
    latitude:
      (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / scale))) * 180) / Math.PI,
  };
}

/** Canvas-free map for browsers that cannot initialize WebGL. */
export function RasterRentalMap({
  locale,
  query,
  category,
  start,
  end,
  onRows,
  onError,
}: {
  locale: Locale;
  query: string;
  category: string;
  start: string;
  end: string;
  onRows: (rows: RentalListing[]) => void;
  onError: (error: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [center, setCenter] = useState(initialCenter);
  const [rows, setLocalRows] = useState<RentalListing[]>([]);
  const middle = worldPoint(center.latitude, center.longitude, center.zoom);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!size.width || !size.height) return;
    const controller = new AbortController();
    const middle = worldPoint(center.latitude, center.longitude, center.zoom);
    const sw = coordinates(
      middle.x - size.width / 2,
      middle.y + size.height / 2,
      center.zoom,
    );
    const ne = coordinates(
      middle.x + size.width / 2,
      middle.y - size.height / 2,
      center.zoom,
    );
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/car-rentals?${new URLSearchParams({
            q: query,
            category,
            bounds: [sw.latitude, sw.longitude, ne.latitude, ne.longitude].join(
              ",",
            ),
            ...(start && end ? { start, end } : {}),
          })}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("unavailable");
        const data = await response.json();
        const listings = (data.rows || []) as RentalListing[];
        setLocalRows(listings);
        onRows(listings);
        onError(false);
      } catch {
        if (!controller.signal.aborted) onError(true);
      }
    }, 220);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [size, center, query, category, start, end, onRows, onError]);

  const tiles = useMemo(() => {
    if (!size.width || !size.height) return [];
    const result: { key: string; url: string; left: number; top: number }[] =
      [];
    const firstX = Math.floor((middle.x - size.width / 2) / TILE);
    const firstY = Math.floor((middle.y - size.height / 2) / TILE);
    const lastX = Math.floor((middle.x + size.width / 2) / TILE);
    const lastY = Math.floor((middle.y + size.height / 2) / TILE);
    const count = 2 ** center.zoom;
    for (let x = firstX; x <= lastX; x++)
      for (let y = firstY; y <= lastY; y++) {
        if (y < 0 || y >= count) continue;
        result.push({
          key: `${center.zoom}-${x}-${y}`,
          url: `https://tile.openstreetmap.org/${center.zoom}/${((x % count) + count) % count}/${y}.png`,
          left: x * TILE - middle.x + size.width / 2,
          top: y * TILE - middle.y + size.height / 2,
        });
      }
    return result;
  }, [center.zoom, middle.x, middle.y, size.width, size.height]);

  const companies = new Map<string, RentalListing[]>();
  for (const row of rows)
    companies.set(row.company_id, [
      ...(companies.get(row.company_id) || []),
      row,
    ]);
  const move = (dx: number, dy: number) => {
    const next = coordinates(
      middle.x + dx * size.width * 0.4,
      middle.y + dy * size.height * 0.4,
      center.zoom,
    );
    setCenter({
      ...center,
      latitude: next.latitude,
      longitude: next.longitude,
    });
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label={
        locale === "es" ? "Mapa de coches de alquiler" : "Rental car map"
      }
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#e8e7e3",
      }}
    >
      {tiles.map((tile) => (
        <div
          key={tile.key}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: tile.left,
            top: tile.top,
            width: TILE,
            height: TILE,
            backgroundImage: `url(${tile.url})`,
            backgroundSize: "256px 256px",
          }}
        />
      ))}
      {[...companies.values()].map((items) => {
        const row = items[0];
        const point = worldPoint(row.latitude, row.longitude, center.zoom);
        const left = point.x - middle.x + size.width / 2;
        const top = point.y - middle.y + size.height / 2;
        if (
          left < -50 ||
          left > size.width + 50 ||
          top < -50 ||
          top > size.height + 50
        )
          return null;
        const price = Math.round(
          Math.min(...items.map((item) => item.daily_price_cents)) / 100,
        );
        return (
          <a
            key={row.company_id}
            href={`/rentals/${encodeURIComponent(row.company_slug)}?lang=${locale}`}
            aria-label={`${row.company_name}, ${items.length} vehicles, from €${price} per day`}
            title={`${row.company_name} · ${items.length} · €${price}/${locale === "es" ? "día" : "day"}`}
            style={{
              position: "absolute",
              left,
              top,
              transform: "translate(-50%, -100%)",
              background: "#f04455",
              color: "white",
              border: "2px solid white",
              borderRadius: 24,
              padding: "7px 11px",
              font: "800 13px system-ui",
              boxShadow: "0 3px 12px #0007",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {items.length} · €{price}
          </a>
        );
      })}
      <div
        aria-label={locale === "es" ? "Controles del mapa" : "Map controls"}
        style={{
          position: "absolute",
          right: 16,
          bottom: 36,
          display: "grid",
          gap: 4,
        }}
      >
        <button
          type="button"
          onClick={() => move(0, -1)}
          aria-label={locale === "es" ? "Mover al norte" : "Pan north"}
        >
          ↑
        </button>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={() => move(-1, 0)}
            aria-label={locale === "es" ? "Mover al oeste" : "Pan west"}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1, 0)}
            aria-label={locale === "es" ? "Mover al este" : "Pan east"}
          >
            →
          </button>
        </div>
        <button
          type="button"
          onClick={() => move(0, 1)}
          aria-label={locale === "es" ? "Mover al sur" : "Pan south"}
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() =>
            setCenter((value) => ({
              ...value,
              zoom: Math.min(15, value.zoom + 1),
            }))
          }
          aria-label={locale === "es" ? "Acercar" : "Zoom in"}
        >
          +
        </button>
        <button
          type="button"
          onClick={() =>
            setCenter((value) => ({
              ...value,
              zoom: Math.max(3, value.zoom - 1),
            }))
          }
          aria-label={locale === "es" ? "Alejar" : "Zoom out"}
        >
          −
        </button>
      </div>
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          right: 8,
          bottom: 4,
          background: "#fffdfd",
          color: "#333",
          font: "11px system-ui",
          padding: "2px 5px",
        }}
      >
        © OpenStreetMap contributors
      </a>
    </div>
  );
}
