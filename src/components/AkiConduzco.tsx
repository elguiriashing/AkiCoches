"use client";

import Image from "next/image";
import { productRoles } from "@/lib/product-roles";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./AkiConduzco.module.css";
import { ThemeToggle } from "./ThemeModeControls";
import { RasterRentalMap } from "./RasterRentalMap";
import { conduzcoLanguageUrl } from "@/lib/akiconduzco-routing";
import {
  rentalCategories,
  rentalCategoryLabels,
  type RentalListing,
} from "@/lib/akiconduzco";

type Locale = "en" | "es";
const copy = {
  en: {
    explore: "Explore",
    map: "Map",
    account: "Account",
    login: "Log in",
    heroTag: "THE ROAD IS PART OF THE TRIP",
    first: "Find your",
    second: "way there.",
    intro:
      "Browse local rental cars for the places you want to go. Compare the details, choose your dates, and send a request directly to the rental company.",
    search: "Find a car",
    where: "PICK-UP AREA",
    city: "City or airport",
    from: "PICK-UP",
    until: "DROP-OFF",
    category: "VEHICLE TYPE",
    all: "Any type",
    cars: "Cars for your trip",
    mapLink: "See the map",
    empty: "No published rental cars match yet.",
    emptyNote:
      "We’re opening AkiCoches with local rental partners. Check another area or come back soon.",
    error: "We couldn’t load rentals just now.",
    retry: "Try again",
    perDay: "/ day",
    seats: "seats",
    luggage: "bags",
    automatic: "Automatic",
    manual: "Manual",
    fuel: "fuel",
    at: "in",
    operator: "Run a rental company?",
    operatorNote:
      "Manage your rental branch and fleet in your management workspace.",
    operatorLink: `Open ${productRoles.managementName}`,
    family: "PART OF THE AKIPASA FAMILY",
    go: "Find events",
    stays: "Find a stay",
    terms: "Terms",
    privacy: "Privacy",
    lang: "ES",
  },
  es: {
    explore: "Explorar",
    map: "Mapa",
    account: "Cuenta",
    login: "Entrar",
    heroTag: "EL CAMINO TAMBIÉN ES PARTE DEL VIAJE",
    first: "Encuentra",
    second: "cómo llegar.",
    intro:
      "Descubre coches de alquiler para los lugares que quieres visitar. Compara opciones, elige las fechas y envía tu solicitud directamente a la empresa.",
    search: "Buscar coche",
    where: "ZONA DE RECOGIDA",
    city: "Ciudad o aeropuerto",
    from: "RECOGIDA",
    until: "DEVOLUCIÓN",
    category: "TIPO DE VEHÍCULO",
    all: "Todos",
    cars: "Coches para tu viaje",
    mapLink: "Ver el mapa",
    empty: "Aún no hay coches de alquiler publicados.",
    emptyNote:
      "Estamos abriendo AkiCoches con empresas locales. Prueba otra zona o vuelve pronto.",
    error: "No se han podido cargar los alquileres.",
    retry: "Reintentar",
    perDay: "/ día",
    seats: "plazas",
    luggage: "maletas",
    automatic: "Automático",
    manual: "Manual",
    fuel: "combustible",
    at: "en",
    operator: "¿Gestionas una empresa de alquiler?",
    operatorNote: "Gestiona tu sucursal y flota desde tu espacio de gestión.",
    operatorLink: `Abrir ${productRoles.managementName}`,
    family: "PARTE DE LA FAMILIA AKIPASA",
    go: "Descubrir eventos",
    stays: "Buscar alojamiento",
    terms: "Condiciones",
    privacy: "Privacidad",
    lang: "EN",
  },
};

export function ConduzcoHeader({ locale }: { locale: Locale }) {
  const t = copy[locale];
  function switchLocale() {
    const next = locale === "en" ? "es" : "en";
    document.cookie = `akiconduzco_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    location.assign(conduzcoLanguageUrl(location.href, next));
  }
  return (
    <header className={styles.header}>
      <Link
        href={`/?lang=${locale}`}
        className={styles.brand}
        aria-label="AkiCoches home"
      >
        <Image
          src="/brand/conduzco-icon.svg"
          alt=""
          width={38}
          height={38}
          priority
        />
        <span>
          Aki<span>Coches</span>.
        </span>
      </Link>
      <nav className={styles.tools} aria-label="AkiCoches">
        <Link className={styles.navlink} href={`/map?lang=${locale}`}>
          {t.map}
        </Link>
        <Link className={styles.navlink} href={`/account?lang=${locale}`}>
          {t.account}
        </Link>
        <ThemeToggle locale={locale} />
        <button
          type="button"
          onClick={switchLocale}
          aria-label={
            locale === "en"
              ? "Cambiar idioma a español"
              : "Switch language to English"
          }
        >
          {t.lang}
        </button>
      </nav>
    </header>
  );
}

export function RentalCard({
  listing,
  locale,
  start,
  end,
}: {
  listing: RentalListing;
  locale: Locale;
  start?: string;
  end?: string;
}) {
  const category =
    rentalCategoryLabels[listing.category]?.[locale] || listing.category;
  const query = new URLSearchParams({
    lang: locale,
    ...(start ? { start } : {}),
    ...(end ? { end } : {}),
    vehicle: listing.vehicle_id,
  });
  return (
    <Link
      className={styles.card}
      href={`/rentals/${encodeURIComponent(listing.company_slug)}?${query}`}
    >
      <div className={styles.vehicleArt}>
        {listing.image_url ? (
          <Image
            src={listing.image_url}
            alt=""
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            unoptimized
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className={styles.vehicleIcon} aria-hidden="true" />
        )}
        <span className={styles.priceTag}>
          €{(listing.daily_price_cents / 100).toFixed(0)}{" "}
          <small>{locale === "es" ? "por día" : "/ day"}</small>
        </span>
      </div>
      <div className={styles.cardBody}>
        <h3>{listing.vehicle_name}</h3>
        <div className={styles.company}>
          {listing.company_name} · {listing.city}
        </div>
        <div className={styles.specs}>
          <span>{category}</span>
          <span>
            {listing.seats} {locale === "es" ? "plazas" : "seats"}
          </span>
          <span>
            {locale === "es"
              ? listing.transmission === "automatic"
                ? "Automático"
                : "Manual"
              : listing.transmission === "automatic"
                ? "Automatic"
                : "Manual"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function AkiConduzco({
  locale,
  initialQuery = "",
}: {
  locale: Locale;
  initialQuery?: string;
}) {
  const t = copy[locale];
  const [q, setQ] = useState(initialQuery);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [rows, setRows] = useState<RentalListing[]>([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const searchUrl = useMemo(
    () =>
      new URLSearchParams({
        q,
        city,
        category,
        ...(start && end ? { start, end } : {}),
      }).toString(),
    [q, city, category, start, end],
  );
  const load = useCallback(() => {
    const abort = new AbortController();
    setBusy(true);
    setError(false);
    fetch(`/api/car-rentals?${searchUrl}`, { signal: abort.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("unavailable");
        return response.json();
      })
      .then((data) => {
        if (!abort.signal.aborted) {
          setRows(Array.isArray(data.rows) ? data.rows : []);
          setTotal(Number(data.total || 0));
        }
      })
      .catch(() => {
        if (!abort.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!abort.signal.aborted) setBusy(false);
      });
    return () => abort.abort();
  }, [searchUrl]);
  useEffect(() => load(), [load, retry]);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRetry((n) => n + 1);
  }
  return (
    <div className={styles.app}>
      <ConduzcoHeader locale={locale} />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>{t.heroTag}</span>
            <h1>
              {t.first}
              <br />
              <em>{t.second}</em>
            </h1>
            <p>{t.intro}</p>
            <div className={styles.heroMeta}>
              <strong />
              {locale === "es"
                ? "Alquiler local. Tu viaje."
                : "Local car hire. Your trip."}
            </div>
          </div>
        </section>
        <section className={styles.searchPanel} aria-label={t.search}>
          <form className={styles.searchGrid} onSubmit={submit}>
            <label className={styles.field}>
              {t.where}
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={100}
                placeholder={t.city}
              />
            </label>
            <label className={styles.field}>
              {t.from}
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </label>
            <label className={styles.field}>
              {t.until}
              <input
                type="date"
                value={end}
                min={start || undefined}
                onChange={(e) => setEnd(e.target.value)}
              />
            </label>
            <label className={styles.field}>
              {t.category}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">{t.all}</option>
                {rentalCategories.map((value) => (
                  <option key={value} value={value}>
                    {rentalCategoryLabels[value][locale]}
                  </option>
                ))}
              </select>
            </label>
            <button className={styles.button} type="submit">
              {t.search}
            </button>
          </form>
          <label
            className={`${styles.field} ${styles.queryField}`}
            style={{ maxWidth: 420, marginTop: 12 }}
          >
            {locale === "es" ? "COCHE O EMPRESA" : "CAR OR COMPANY"}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              maxLength={100}
              placeholder={
                locale === "es"
                  ? "Ej. SUV, Málaga, nombre de empresa"
                  : "e.g. SUV, Málaga, company name"
              }
            />
          </label>
        </section>
        <div className={styles.sectionHead}>
          <div>
            <h2>{t.cars}</h2>
            <p>
              {total
                ? `${total} ${locale === "es" ? "opciones disponibles" : "options available"}`
                : t.emptyNote}
            </p>
          </div>
          <Link
            href={`/map?${new URLSearchParams({ lang: locale, ...(city ? { q: city } : {}), ...(category !== "all" ? { category } : {}), ...(start && end ? { start, end } : {}) })}`}
          >
            {t.mapLink} →
          </Link>
        </div>
        {error ? (
          <div className={styles.error} role="alert">
            {t.error}{" "}
            <button
              className={styles.navlink}
              onClick={() => setRetry((n) => n + 1)}
            >
              {t.retry}
            </button>
          </div>
        ) : busy ? (
          <div className={styles.empty} aria-live="polite">
            {locale === "es" ? "Buscando coches…" : "Finding rental cars…"}
          </div>
        ) : rows.length ? (
          <div className={styles.grid}>
            {rows.map((row) => (
              <RentalCard
                key={row.vehicle_id}
                listing={row}
                locale={locale}
                start={start}
                end={end}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>{t.empty}</strong>
            <p>{t.emptyNote}</p>
          </div>
        )}
        <section className={styles.businessIntro}>
          <strong>{t.operator}</strong>
          <p>{t.operatorNote}</p>
          <Link
            className={styles.button}
            href={`${productRoles.managementUrl}/${locale}/business`}
          >
            {t.operatorLink}
          </Link>
        </section>
        <footer className={styles.footer}>
          <span>{t.family} · AkiPasa × AkiDuermo × AkiCoches</span>
          <span>
            <Link href={`https://akipasa.com/${locale}`}>{t.go}</Link>　
            <Link href={`https://akiduermo.com/?lang=${locale}`}>
              {t.stays}
            </Link>
            　
            <Link href={`https://akipasa.com/${locale}/terms`}>{t.terms}</Link>
            　
            <Link href={`https://akipasa.com/${locale}/privacy`}>
              {t.privacy}
            </Link>
          </span>
        </footer>
      </main>
    </div>
  );
}

export { RentalCompanyApp as RentalDetail } from "./RentalCompanyApp";

export function ConduzcoMap({
  locale,
  styleUrl,
  initialQuery = "",
  initialCategory = "all",
  initialStart = "",
  initialEnd = "",
}: {
  locale: Locale;
  styleUrl: string;
  initialQuery?: string;
  initialCategory?: string;
  initialStart?: string;
  initialEnd?: string;
}) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(
    rentalCategories.includes(
      initialCategory as (typeof rentalCategories)[number],
    )
      ? initialCategory
      : "all",
  );
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [rows, setRows] = useState<RentalListing[]>([]);
  const [error, setError] = useState(false);
  const [rasterFallback, setRasterFallback] = useState(false);
  const [pinPositions, setPinPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [activePin, setActivePin] = useState<string | null>(null);
  const qRef = useRef(q);
  const categoryRef = useRef(category);
  const datesRef = useRef({ start, end });
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const companies = useMemo(() => {
    const grouped = new Map<string, RentalListing[]>();
    for (const row of rows)
      grouped.set(row.company_id, [
        ...(grouped.get(row.company_id) || []),
        row,
      ]);
    return grouped;
  }, [rows]);
  useEffect(() => {
    if (rasterFallback || !mapRef.current) return;
    const map = mapRef.current;
    const update = () => {
      const next: Record<string, { x: number; y: number }> = {};
      for (const [id, items] of companies) {
        const point = map.project([items[0].longitude, items[0].latitude]);
        if (Number.isFinite(point.x) && Number.isFinite(point.y))
          next[id] = { x: point.x, y: point.y };
      }
      setPinPositions(next);
    };
    map.on("move", update);
    map.on("resize", update);
    update();
    return () => {
      map.off("move", update);
      map.off("resize", update);
    };
  }, [companies, rasterFallback]);
  useEffect(() => {
    qRef.current = q;
    mapRef.current?.fire("moveend");
  }, [q]);
  useEffect(() => {
    categoryRef.current = category;
    mapRef.current?.fire("moveend");
  }, [category]);
  useEffect(() => {
    datesRef.current = { start, end };
    mapRef.current?.fire("moveend");
  }, [start, end]);
  useEffect(() => {
    if (!container) return;
    let map: import("maplibre-gl").Map | undefined;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let abort: AbortController | undefined;
    void import("maplibre-gl")
      .then(({ default: maplibre }) => {
        if (cancelled) return;
        map = new maplibre.Map({
          container,
          style: styleUrl,
          center: [-4.42, 36.72],
          zoom: 8,
        });
        mapRef.current = map;
        map.addControl(new maplibre.NavigationControl(), "bottom-right");
        const load = (initial = false) => {
          if (!map) return;
          if (timer) clearTimeout(timer);
          timer = setTimeout(
            async () => {
              const b = map!.getBounds();
              abort?.abort();
              abort = new AbortController();
              const bounds = [
                b.getSouth(),
                b.getWest(),
                b.getNorth(),
                b.getEast(),
              ].join(",");
              try {
                const response = await fetch(
                  `/api/car-rentals?${new URLSearchParams({
                    q: qRef.current,
                    category: categoryRef.current,
                    bounds,
                    ...(datesRef.current.start && datesRef.current.end
                      ? datesRef.current
                      : {}),
                  })}`,
                  { signal: abort.signal },
                );
                if (!response.ok) throw new Error("unavailable");
                const data = await response.json();
                if (cancelled) return;
                setRows(data.rows || []);
                setError(false);
              } catch {
                if (!abort?.signal.aborted && !cancelled) setError(true);
              }
            },
            initial ? 0 : 220,
          );
        };
        // Show the first set of rental locations as soon as the map is ready.
        // Keep the short debounce for later pans/filters to avoid excess requests.
        map.on("load", () => load(true));
        map.on("moveend", () => load(false));
      })
      .catch(() => {
        // Keep location search and pins available without WebGL.
        if (!cancelled) {
          mapRef.current = null;
          setRasterFallback(true);
        }
      });
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      abort?.abort();
      mapRef.current = null;
      map?.remove();
    };
  }, [container, styleUrl, locale]);
  return (
    <div className={styles.app}>
      <ConduzcoHeader locale={locale} />
      <main className={styles.mapLayout}>
        {rasterFallback ? (
          <div className={styles.mapCanvas}>
            <RasterRentalMap
              locale={locale}
              query={q}
              category={category}
              start={start}
              end={end}
              onRows={setRows}
              onError={setError}
            />
          </div>
        ) : (
          <div
            ref={setContainer}
            className={styles.mapCanvas}
            aria-label={
              locale === "es" ? "Mapa de coches de alquiler" : "Rental car map"
            }
          />
        )}
        {!rasterFallback && (
          <div
            className={styles.mapPins}
            aria-label={
              locale === "es" ? "Puntos de alquiler" : "Rental locations"
            }
          >
            {[...companies].map(([id, items]) => {
              const item = items[0];
              const position = pinPositions[id];
              if (!position) return null;
              const price = Math.round(
                Math.min(...items.map((row) => row.daily_price_cents)) / 100,
              );
              return (
                <div
                  className={styles.mapPin}
                  key={id}
                  style={{ left: position.x, top: position.y }}
                >
                  <button
                    type="button"
                    className="conduzco-map-marker"
                    aria-label={`${item.company_name}, ${items.length} vehicles, from €${price} per day`}
                    aria-expanded={activePin === id}
                    onClick={() => setActivePin(activePin === id ? null : id)}
                  >
                    {items.length} · €{price}
                  </button>
                  {activePin === id && (
                    <div className={styles.mapPinPopup}>
                      <strong>{item.company_name}</strong>
                      <span>
                        {items.length} {locale === "es" ? "coches" : "cars"} · €
                        {price}/{locale === "es" ? "día" : "day"}
                      </span>
                      <Link
                        href={`/rentals/${encodeURIComponent(item.company_slug)}?lang=${locale}`}
                      >
                        {locale === "es" ? "Ver flota →" : "View fleet →"}
                      </Link>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${item.latitude},${item.longitude}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {locale === "es" ? "Cómo llegar ↗" : "Directions ↗"}
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <section className={styles.mapPanel}>
          <h1>
            {locale === "es" ? "Coches cerca de ti" : "Rental cars near you"}
            <span style={{ color: "#f04455" }}>.</span>
          </h1>
          <form onSubmit={(event) => event.preventDefault()}>
            <input
              value={q}
              maxLength={100}
              aria-label={
                locale === "es"
                  ? "Busca ciudad o empresa"
                  : "Search city or company"
              }
              onChange={(event) => setQ(event.target.value)}
              placeholder={
                locale === "es"
                  ? "Busca ciudad o empresa"
                  : "Search city or company"
              }
            />
          </form>
          <label className={styles.mapFilter}>
            {locale === "es" ? "Tipo de vehículo" : "Vehicle type"}
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">
                {locale === "es" ? "Todos" : "All types"}
              </option>
              {rentalCategories.map((value) => (
                <option key={value} value={value}>
                  {rentalCategoryLabels[value][locale]}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.mapDates}>
            <label>
              {locale === "es" ? "Recogida" : "Pick-up"}
              <input
                type="date"
                value={start}
                onChange={(event) => setStart(event.target.value)}
              />
            </label>
            <label>
              {locale === "es" ? "Devolución" : "Drop-off"}
              <input
                type="date"
                min={start || undefined}
                value={end}
                onChange={(event) => setEnd(event.target.value)}
              />
            </label>
          </div>
          {error && (
            <div role="alert">
              <p>
                {locale === "es"
                  ? "Mapa no disponible. Puedes seguir buscando en el catálogo."
                  : "Map unavailable. You can continue searching the catalogue."}
              </p>
              <Link
                href={`/?${new URLSearchParams({ lang: locale, ...(q ? { q } : {}), ...(category !== "all" ? { category } : {}), ...(start && end ? { start, end } : {}) })}`}
              >
                {locale === "es"
                  ? "Ver catálogo de coches"
                  : "Browse rental catalogue"}
              </Link>
            </div>
          )}
          <div className={styles.mapResults}>
            {rows.map((row) => (
              <Link
                key={row.vehicle_id}
                href={`/rentals/${encodeURIComponent(row.company_slug)}?lang=${locale}&vehicle=${row.vehicle_id}`}
              >
                {row.vehicle_name}
                <small>
                  {row.company_name} · {row.city} · €
                  {Math.round(row.daily_price_cents / 100)}/day
                </small>
              </Link>
            ))}
            {!rows.length && !error && (
              <small>
                {locale === "es"
                  ? "Mueve el mapa para buscar en otra zona."
                  : "Move the map to search another area."}
              </small>
            )}
          </div>
        </section>
        <style>{`.conduzco-map-marker{border:1px solid #fff;border-radius:999px;background:#f04455;color:#fff;padding:6px 9px;font:800 12px system-ui;box-shadow:0 3px 12px #0007;cursor:pointer}.maplibregl-popup-content{font:600 13px system-ui;border-radius:10px}.maplibregl-ctrl-group{border-radius:10px!important;overflow:hidden}`}</style>
      </main>
    </div>
  );
}
