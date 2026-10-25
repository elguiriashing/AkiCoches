"use client";

import { BusinessPathway } from "./BusinessPathway";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ConduzcoHeader } from "./AkiConduzco";
import { SaveRentalButton } from "./SaveRentalButton";
import {
  formatRentalPrice,
  rentalCategoryLabels,
  rentalDays,
  type RentalListing,
} from "@/lib/akiconduzco";
import {
  calendarDate,
  rentalRangeBlocked,
  type RentalBlock,
} from "@/lib/rental-calendar";
import shell from "./AkiConduzco.module.css";
import s from "./RentalCompanyApp.module.css";

type Company = {
  name: string;
  city: string;
  address?: string;
  description_es?: string;
  description_en?: string | null;
  phone?: string | null;
  website_url?: string | null;
  latitude?: number;
  longitude?: number;
  logo_url?: string;
  hero_url?: string;
};
type Props = {
  locale: "en" | "es";
  slug: string;
  listings: RentalListing[];
  company?: Company;
  error?: boolean;
  requestedVehicle?: string;
  initialStart?: string;
  initialEnd?: string;
  blocks?: RentalBlock[];
  calendarReady?: boolean;
  accountEmail?: string;
};

export function RentalCompanyApp({
  locale,
  slug,
  listings,
  company: companyInfo,
  error,
  requestedVehicle,
  initialStart = "",
  initialEnd = "",
  blocks = [],
  calendarReady = false,
  accountEmail = "",
}: Props) {
  const router = useRouter();
  const es = locale === "es";
  const today = new Date().toISOString().slice(0, 10);
  const [selectedId, setSelectedId] = useState(
    requestedVehicle || listings[0]?.vehicle_id || "",
  );
  const selected =
    listings.find((v) => v.vehicle_id === selectedId) || listings[0];
  const company: Company = companyInfo || {
    name: listings[0]?.company_name || "AkiCoches",
    city: listings[0]?.city || "",
    address: listings[0]?.address || "",
  };
  const pickupQuery =
    Number.isFinite(company.latitude) && Number.isFinite(company.longitude)
      ? `${company.latitude},${company.longitude}`
      : [company.address, company.city].filter(Boolean).join(", ");
  const [tab, setTab] = useState<"fleet" | "dates" | "request" | "company">(
    "fleet",
  );
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [month, setMonth] = useState((initialStart || today).slice(0, 7));
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const [filter, setFilter] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(accountEmail);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [availability, setAvailability] = useState<{
    key: string;
    state: "checking" | "available" | "blocked" | "error";
  }>({ key: "", state: "checking" });
  const requestLock = useRef(false);
  const days = rentalDays(start, end);
  const validRange = Boolean(start >= today && end > start && days <= 30);
  const key = `${selected?.vehicle_id}|${start}|${end}`;
  const knownBlocked =
    selected &&
    validRange &&
    rentalRangeBlocked(blocks, selected.vehicle_id, start, end);
  const available =
    validRange &&
    availability.key === key &&
    availability.state === "available" &&
    !knownBlocked;
  const filtered = listings.filter((v) =>
    `${v.vehicle_name} ${rentalCategoryLabels[v.category]?.[locale]}`
      .toLowerCase()
      .includes(filter.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice(
    Math.min(page, pages - 1) * pageSize,
    (Math.min(page, pages - 1) + 1) * pageSize,
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => {
      setPageSize(media.matches ? 2 : 4);
      setPage(0);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!validRange || !selected) return;
    const controller = new AbortController();
    setAvailability({ key, state: "checking" });
    const query = new URLSearchParams({
      q: selected.company_name,
      city: selected.city,
      start,
      end,
      bounds: "27,-19,44,5",
    });
    fetch(`/api/car-rentals?${query}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (!controller.signal.aborted)
          setAvailability({
            key,
            state: data.rows.some(
              (v: RentalListing) => v.vehicle_id === selected.vehicle_id,
            )
              ? "available"
              : "blocked",
          });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setAvailability({ key, state: "error" });
      });
    return () => controller.abort();
  }, [key, start, end, selected, validRange]);

  function chooseDate(date: string) {
    setSent(false);
    setMessage("");
    if (!start || end || date <= start) {
      setStart(date);
      setEnd("");
    } else setEnd(date);
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !available || requestLock.current || sent) return;
    requestLock.current = true;
    setSending(true);
    setMessage("");
    const storageKey = `coches-request-${selected.vehicle_id}-${start}-${end}`;
    try {
      let token = sessionStorage.getItem(storageKey);
      if (!token) {
        token = crypto.randomUUID();
        sessionStorage.setItem(storageKey, token);
      }
      const response = await fetch("/api/car-rentals/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: selected.vehicle_id,
          start,
          end,
          name,
          phone,
          email,
          locale,
          note,
          idempotencyKey: token,
        }),
      });
      if (response.status === 401) {
        const next = `/rentals/${slug}?${new URLSearchParams({ vehicle: selected.vehicle_id, start, end, lang: locale })}`;
        router.push(`/${locale}/auth?next=${encodeURIComponent(next)}`);
        return;
      }
      if (!response.ok)
        throw new Error(
          response.status === 409
            ? "dates"
            : response.status === 403
              ? "email"
              : "failed",
        );
      setSent(true);
      sessionStorage.removeItem(storageKey);
      setMessage(
        es
          ? "Solicitud enviada. La empresa te confirmará la reserva. No se ha realizado ningún pago."
          : "Request sent. The company will confirm your rental. No payment has been taken.",
      );
    } catch (e) {
      const reason = e instanceof Error ? e.message : "failed";
      if (reason === "dates") setAvailability({ key, state: "blocked" });
      setMessage(
        reason === "dates"
          ? es
            ? "Fechas no disponibles. Elige otras fechas."
            : "Dates no longer available. Choose another range."
          : reason === "email"
            ? es
              ? "Usa y verifica el email de tu cuenta para enviar la solicitud."
              : "Use your verified account email before sending a request."
            : es
              ? "No se pudo enviar. Vuelve a intentarlo."
              : "Could not send. Please try again.",
      );
    } finally {
      requestLock.current = false;
      setSending(false);
    }
  }
  const [year, monthIndex] = month.split("-").map(Number);
  const offset =
    (new Date(Date.UTC(year, monthIndex - 1, 1)).getUTCDay() + 6) % 7;
  const monthDays = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
  const moveMonth = (step: number) =>
    setMonth(calendarDate(year, monthIndex - 1 + step, 1).slice(0, 7));
  const money = (cents: number) => formatRentalPrice(cents, locale);
  const stateText = !validRange
    ? es
      ? "Elige hasta 30 días"
      : "Choose up to 30 days"
    : knownBlocked ||
        (availability.key === key && availability.state === "blocked")
      ? es
        ? "No disponible en estas fechas"
        : "Unavailable for these dates"
      : available
        ? es
          ? "Disponible para solicitar"
          : "Available to request"
        : availability.key === key && availability.state === "error"
          ? es
            ? "No se pudo verificar. Cambia las fechas para reintentar."
            : "Could not check. Change dates to retry."
          : es
            ? "Comprobando disponibilidad…"
            : "Checking availability…";

  return (
    <div className={`${shell.app} ${s.app}`} data-suite-fullscreen>
      <ConduzcoHeader locale={locale} />
      <main className={s.workspace}>
        <header className={s.companyHeader}>
          <Link
            href={`/map?lang=${locale}`}
            className={s.back}
            aria-label={es ? "Volver al mapa" : "Back to map"}
          >
            ←
          </Link>
          <div className={s.avatar}>
            {company.logo_url ? (
              <Image
                src={company.logo_url}
                alt={company.name}
                width={52}
                height={52}
                unoptimized
              />
            ) : (
              company.name.slice(0, 1)
            )}
          </div>
          <div className={s.companyIdentity}>
            <span className={s.eyebrow}>{company.city} · AKIFAMILY</span>
            <h1>{company.name}</h1>
            <p>{company.address}</p>
          </div>
          <span className={s.counter}>
            {listings.length} {es ? "coches" : "cars"}
          </span>
        </header>
        <nav
          className={s.tabs}
          aria-label={es ? "Empresa de alquiler" : "Rental company"}
        >
          {(
            [
              ["fleet", es ? "Flota" : "Fleet"],
              ["dates", es ? "Fechas" : "Dates"],
              ["request", es ? "Solicitud" : "Request"],
              ["company", es ? "La empresa" : "Company"],
            ] as const
          ).map(([id, label], i) => (
            <button
              key={id}
              aria-current={tab === id ? "page" : undefined}
              onClick={() => setTab(id)}
            >
              <small>0{i + 1}</small>
              {label}
            </button>
          ))}
        </nav>
        {error ? (
          <section className={s.empty}>
            <h2>{es ? "No se pudo cargar la flota" : "Fleet unavailable"}</h2>
            <button onClick={() => location.reload()}>
              {es ? "Reintentar" : "Retry"}
            </button>
          </section>
        ) : !selected ? (
          <section className={s.empty}>
            <h2>
              {es ? "La flota está en camino" : "The fleet is on its way"}
            </h2>
            <p>
              {es
                ? "Esta empresa aún no tiene coches publicados."
                : "This company has no published cars yet."}
            </p>
            <Link href={`/map?lang=${locale}`}>
              {es ? "Buscar otras empresas" : "Find other companies"}
            </Link>
          </section>
        ) : (
          <div className={s.body}>
            <section className={s.showcase} data-view={tab}>
              <div className={s.photo}>
                {selected.image_url ? (
                  <Image
                    key={selected.image_url}
                    src={selected.image_url}
                    alt={selected.vehicle_name}
                    fill
                    unoptimized
                    sizes="(max-width: 760px) 100vw, 55vw"
                  />
                ) : (
                  <div className={s.placeholder}>
                    <svg viewBox="0 0 320 160" aria-hidden="true">
                      <path d="M44 105 63 72l47-11 31-28h68l36 36 31 14 8 33H39zM110 61h117M143 34l-10 27M199 34l17 27" />
                      <circle cx="92" cy="114" r="21" />
                      <circle cx="240" cy="114" r="21" />
                    </svg>
                    <span>
                      {es ? "Fotos próximamente" : "Photos coming soon"}
                    </span>
                  </div>
                )}
                <span className={s.photoBadge}>
                  {rentalCategoryLabels[selected.category]?.[locale]}
                </span>
                <div className={s.photoCaption}>
                  <span>AKICOCHES · {company.city}</span>
                  <h2>{selected.vehicle_name}</h2>
                </div>
              </div>
              <div className={s.specs}>
                <span>
                  <strong>{selected.seats}</strong>
                  {es ? "plazas" : "seats"}
                </span>
                <span>
                  <strong>
                    {selected.transmission === "automatic"
                      ? es
                        ? "Auto"
                        : "Auto"
                      : "Manual"}
                  </strong>
                  {es ? "cambio" : "gearbox"}
                </span>
                <span>
                  <strong>{selected.luggage}</strong>
                  {es ? "maletas" : "bags"}
                </span>
                <span>
                  <strong>
                    {{
                      petrol: es ? "Gasolina" : "Petrol",
                      diesel: "Diésel",
                      electric: es ? "Eléctrico" : "Electric",
                      hybrid: es ? "Híbrido" : "Hybrid",
                    }[selected.fuel] || selected.fuel}
                  </strong>
                  {es ? "motor" : "fuel"}
                </span>
              </div>
              <footer className={s.priceBar}>
                <div>
                  <strong>{money(selected.daily_price_cents)}</strong>
                  <span> / {es ? "día" : "day"}</span>
                  <small>
                    {es ? "Fianza" : "Deposit"} {money(selected.deposit_cents)}
                  </small>
                </div>
                <div className={s.priceActions}>
                  <SaveRentalButton
                    listing={selected}
                    locale={locale}
                    className={s.secondary}
                  />
                  <button
                    className={s.primary}
                    onClick={() =>
                      setTab(tab === "dates" && available ? "request" : "dates")
                    }
                  >
                    {es ? "Elegir fechas" : "Choose dates"} ↗
                  </button>
                </div>
              </footer>
            </section>
            <section className={s.panel} aria-label={tab}>
              {tab === "fleet" && (
                <>
                  <div className={s.panelHead}>
                    <div>
                      <span className={s.eyebrow}>
                        {es
                          ? "ENCUENTRA TU COMPAÑERO DE VIAJE"
                          : "FIND YOUR TRAVEL COMPANION"}
                      </span>
                      <h2>
                        {es ? "La flota" : "The fleet"}
                        <small> / {listings.length}</small>
                      </h2>
                    </div>
                  </div>
                  <input
                    className={s.search}
                    aria-label={es ? "Buscar en la flota" : "Search fleet"}
                    placeholder={
                      es
                        ? "Buscar modelo o categoría…"
                        : "Search model or category…"
                    }
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setPage(0);
                    }}
                  />
                  <div className={s.fleetList}>
                    {visible.map((v) => (
                      <button
                        key={v.vehicle_id}
                        className={s.carCard}
                        aria-pressed={v.vehicle_id === selected.vehicle_id}
                        onClick={() => {
                          setSelectedId(v.vehicle_id);
                          setSent(false);
                          setMessage("");
                        }}
                      >
                        <span className={s.thumbnail}>
                          {v.image_url ? (
                            <Image
                              src={v.image_url}
                              alt=""
                              fill
                              unoptimized
                              sizes="88px"
                            />
                          ) : (
                            <span aria-hidden="true">↗</span>
                          )}
                        </span>
                        <span>
                          <strong>{v.vehicle_name}</strong>
                          <small>
                            {rentalCategoryLabels[v.category]?.[locale]} ·{" "}
                            {v.seats} {es ? "plazas" : "seats"}
                          </small>
                        </span>
                        <span className={s.cardPrice}>
                          {money(v.daily_price_cents)}
                          <small>/{es ? "día" : "day"}</small>
                        </span>
                      </button>
                    ))}
                    {!visible.length && (
                      <p>{es ? "Sin resultados" : "No matching cars"}</p>
                    )}
                  </div>
                  <div className={s.pagination}>
                    <span>
                      {es
                        ? "Elige un coche para descubrirlo"
                        : "Select a car to explore it"}
                    </span>
                    <button
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                      aria-label={es ? "Página anterior" : "Previous page"}
                    >
                      ←
                    </button>
                    <span>
                      {Math.min(page + 1, pages)}/{pages}
                    </span>
                    <button
                      disabled={page >= pages - 1}
                      onClick={() => setPage((p) => p + 1)}
                      aria-label={es ? "Página siguiente" : "Next page"}
                    >
                      →
                    </button>
                  </div>
                </>
              )}
              {tab === "dates" && (
                <>
                  <div className={s.panelHead}>
                    <div>
                      <span className={s.eyebrow}>{selected.vehicle_name}</span>
                      <h2>{es ? "¿Cuándo nos vamos?" : "When shall we go?"}</h2>
                    </div>
                  </div>
                  <div className={s.dateInputs}>
                    <label>
                      {es ? "Recogida" : "Pick-up"}
                      <input
                        type="date"
                        min={today}
                        value={start}
                        onChange={(e) => {
                          setStart(e.target.value);
                          setSent(false);
                        }}
                      />
                    </label>
                    <label>
                      {es ? "Devolución" : "Drop-off"}
                      <input
                        type="date"
                        min={start || today}
                        value={end}
                        onChange={(e) => {
                          setEnd(e.target.value);
                          setSent(false);
                        }}
                      />
                    </label>
                  </div>
                  <div className={s.calendar}>
                    <header>
                      <button
                        onClick={() => moveMonth(-1)}
                        disabled={month <= today.slice(0, 7)}
                        aria-label={es ? "Mes anterior" : "Previous month"}
                      >
                        ←
                      </button>
                      <strong>
                        {new Intl.DateTimeFormat(locale, {
                          month: "long",
                          year: "numeric",
                          timeZone: "UTC",
                        }).format(new Date(`${month}-01T00:00:00Z`))}
                      </strong>
                      <button
                        onClick={() => moveMonth(1)}
                        disabled={
                          month >=
                          calendarDate(
                            Number(today.slice(0, 4)) + 1,
                            Number(today.slice(5, 7)) - 1,
                            1,
                          ).slice(0, 7)
                        }
                        aria-label={es ? "Mes siguiente" : "Next month"}
                      >
                        →
                      </button>
                    </header>
                    <div className={s.days}>
                      {(es
                        ? ["L", "M", "X", "J", "V", "S", "D"]
                        : ["M", "T", "W", "T", "F", "S", "S"]
                      ).map((d, i) => (
                        <small key={i}>{d}</small>
                      ))}
                      {Array.from({ length: offset }, (_, i) => (
                        <span key={`blank${i}`} />
                      ))}
                      {Array.from({ length: monthDays }, (_, i) => {
                        const date = calendarDate(year, monthIndex - 1, i + 1);
                        const blocked = rentalRangeBlocked(
                          blocks,
                          selected.vehicle_id,
                          date,
                          calendarDate(year, monthIndex - 1, i + 2),
                        );
                        return (
                          <button
                            key={date}
                            disabled={
                              date < today ||
                              Boolean(
                                calendarReady &&
                                  blocked &&
                                  (!start || Boolean(end)),
                              )
                            }
                            aria-label={`${date}${calendarReady && blocked ? (es ? ", no disponible" : ", unavailable") : ""}`}
                            aria-pressed={date === start || date === end}
                            data-blocked={calendarReady && blocked}
                            data-range={date > start && date < end}
                            onClick={() => chooseDate(date)}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                    <small>
                      {calendarReady
                        ? es
                          ? "Tachado: ocupado · Elige recogida y devolución"
                          : "Struck out: unavailable · Choose pick-up and drop-off"
                        : es
                          ? "Elige fechas para comprobar disponibilidad"
                          : "Choose dates to check availability"}
                    </small>
                  </div>
                  <div className={s.summary} role="status">
                    <span data-available={available}>{stateText}</span>
                    {validRange && (
                      <strong>
                        {days} {es ? "días" : "days"} ·{" "}
                        {money(days * selected.daily_price_cents)}
                      </strong>
                    )}
                  </div>
                  <button
                    className={s.primary}
                    disabled={!available}
                    onClick={() => setTab("request")}
                  >
                    {es ? "Continuar con este coche" : "Continue with this car"}{" "}
                    →
                  </button>
                </>
              )}
              {tab === "request" && (
                <>
                  <div className={s.panelHead}>
                    <div>
                      <span className={s.eyebrow}>
                        {es ? "ÚLTIMA PARADA" : "ONE LAST STOP"}
                      </span>
                      <h2>
                        {sent
                          ? es
                            ? "¡En camino!"
                            : "You're on your way!"
                          : es
                            ? "Tu solicitud"
                            : "Your request"}
                      </h2>
                    </div>
                  </div>
                  <div className={s.summary}>
                    <strong>{selected.vehicle_name}</strong>
                    <span>
                      {validRange
                        ? `${start} → ${end} · ${money(days * selected.daily_price_cents)}`
                        : es
                          ? "Primero elige tus fechas"
                          : "Choose your dates first"}
                    </span>
                    <small>
                      {es ? "Fianza aparte" : "Deposit separately"}:{" "}
                      {money(selected.deposit_cents)}
                    </small>
                  </div>
                  {message && (
                    <p className={s.notice} role="status">
                      {message}
                    </p>
                  )}
                  {!sent && (
                    <form className={s.form} onSubmit={submit}>
                      <label>
                        {es ? "Tu nombre" : "Your name"}
                        <input
                          required
                          minLength={2}
                          maxLength={120}
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </label>
                      <label>
                        Email
                        <input
                          type="email"
                          required
                          maxLength={254}
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <small className={s.fine}>
                          {es
                            ? "Usa el email verificado de tu cuenta. Recibirás las actualizaciones de tu reserva aquí."
                            : "Use your verified account email. Booking updates will arrive here."}
                        </small>
                      </label>
                      <label>
                        {es ? "Teléfono" : "Phone"}
                        <input
                          type="tel"
                          required
                          minLength={7}
                          maxLength={40}
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </label>
                      <label>
                        {es ? "Mensaje (opcional)" : "Message (optional)"}
                        <textarea
                          rows={2}
                          maxLength={1000}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </label>
                      <p className={s.fine}>
                        {es
                          ? "La empresa confirma tu solicitud. No se realiza ningún pago aquí. Necesitas una cuenta con email verificado."
                          : "The company confirms your request. No payment is taken here. A verified account is required."}
                      </p>
                      <button
                        className={s.primary}
                        disabled={!available || sending}
                      >
                        {sending
                          ? es
                            ? "Enviando…"
                            : "Sending…"
                          : es
                            ? "Enviar solicitud"
                            : "Send request"}{" "}
                        ↗
                      </button>
                      {!available && (
                        <button
                          type="button"
                          className={s.secondary}
                          onClick={() => setTab("dates")}
                        >
                          {es ? "Elegir fechas" : "Choose dates"}
                        </button>
                      )}
                    </form>
                  )}
                  {sent && (
                    <Link
                      className={s.primary}
                      href={`/account?lang=${locale}`}
                    >
                      {es ? "Ver mis solicitudes" : "View my requests"}
                    </Link>
                  )}
                </>
              )}
              {tab === "company" && (
                <>
                  <span className={s.eyebrow}>LOCAL PEOPLE · OPEN ROADS</span>
                  <h2>{company.name}</h2>
                  <div className={s.companyTile}>
                    <span aria-hidden="true">↗</span>
                    <h3>{company.city}</h3>
                    <p>{company.address}</p>
                  </div>
                  {company.hero_url && (
                    <div className={s.branchHero}>
                      <Image
                        src={company.hero_url}
                        alt={company.name}
                        fill
                        unoptimized
                      />
                    </div>
                  )}
                  <p className={s.fine}>
                    {(es
                      ? company.description_es
                      : company.description_en || company.description_es) ||
                      (es
                        ? "Explora la flota de esta sucursal y solicita tus fechas directamente."
                        : "Explore this branch's fleet and request your dates directly.")}
                  </p>
                  {company.phone && (
                    <a className={s.secondary} href={`tel:${company.phone}`}>
                      {company.phone}
                    </a>
                  )}
                  {company.website_url && (
                    <a
                      className={s.secondary}
                      href={company.website_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {es ? "Web de la sucursal" : "Branch website"} ↗
                    </a>
                  )}
                  <a
                    className={s.primary}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickupQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {es ? "Ver zona de recogida" : "View pick-up area"}
                  </a>
                  <p className={s.fine}>
                    AkiCoches ·{" "}
                    {es
                      ? "Parte de la familia AkiPasa"
                      : "Part of the AkiPasa family"}
                  </p>
                </>
              )}
            </section>
          </div>
        )}
        <BusinessPathway locale={locale} category="rental" />
      </main>
    </div>
  );
}
