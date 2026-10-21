import { accountTaskFromSearch } from "@/lib/account-task-resume";
import Link from "next/link";
import { headers } from "next/headers";
import { signOut } from "@/app/[locale]/auth/actions";
import { requireUser } from "@/lib/auth";
import { conduzcoLocale } from "@/lib/akiconduzco-i18n";
import { formatRentalPrice } from "@/lib/akiconduzco";
import { ConduzcoHeader } from "@/components/AkiConduzco";
import { SavedRentalsPanel } from "@/components/SavedRentalsPanel";
import base from "@/components/AkiConduzco.module.css";
import styles from "./account.module.css";

export const metadata = {
  title: "Account & rental requests · AkiCoches",
  robots: { index: false, follow: false },
};

type RentalBooking = {
  id: string;
  start_date: string;
  end_date: string;
  quoted_total_cents: number;
  status: string;
  vehicle:
    | {
        name: string;
        company:
          | { name: string; city: string }
          | { name: string; city: string }[]
          | null;
      }
    | {
        name: string;
        company:
          | { name: string; city: string }
          | { name: string; city: string }[]
          | null;
      }[]
    | null;
};

export default async function RenterAccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = conduzcoLocale((await headers()).get("x-akipasa-locale"));
  const es = locale === "es";
  const params = await searchParams;
  const { supabase, user } = await requireUser(
    locale,
    accountTaskFromSearch("coches", locale, "/account", params),
  );
  const filter =
    params.tab === "upcoming" ||
    params.tab === "history" ||
    params.tab === "saved"
      ? params.tab
      : "all";
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  // Explicit account scope alongside Supabase RLS. Never use a service-role client here.
  const { data, error } = await supabase
    .from("car_rental_bookings")
    .select(
      "id,start_date,end_date,quoted_total_cents,status,vehicle:car_rental_vehicles(name,company:car_rental_companies(name,city))",
    )
    .eq("renter_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const bookings = (data || []) as unknown as RentalBooking[];
  const isUpcoming = (booking: RentalBooking) =>
    ["requested", "confirmed"].includes(booking.status) &&
    booking.end_date >= today;
  const upcoming = bookings.filter(isUpcoming);
  const pending = upcoming.filter((booking) => booking.status === "requested");
  const visible = bookings.filter((booking) =>
    filter === "upcoming"
      ? isUpcoming(booking)
      : filter === "history"
        ? !isUpcoming(booking)
        : true,
  );
  const labels: Record<string, string> = es
    ? {
        requested: "Pendiente de confirmación",
        confirmed: "Confirmada",
        declined: "Rechazada",
        cancelled: "Cancelada",
        completed: "Completada",
      }
    : {
        requested: "Awaiting confirmation",
        confirmed: "Confirmed",
        declined: "Declined",
        cancelled: "Cancelled",
        completed: "Completed",
      };

  return (
    <div className={base.app}>
      <ConduzcoHeader locale={locale} />
      <main className={base.main + " " + styles.account}>
        <section className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>
              AKICOCHES / {es ? "MI CUENTA" : "MY ACCOUNT"}
            </span>
            <h1>{es ? "Tu viaje, bajo control." : "Your journey, sorted."}</h1>
            <p>
              {es
                ? "Consulta tus solicitudes de alquiler, prepara tu próxima escapada y gestiona tu cuenta AkiSuite."
                : "Follow your rental requests, plan your next trip and manage your AkiSuite account."}
            </p>
            <div className={styles.heroActions}>
              <Link href={"/?lang=" + locale} className={styles.primaryButton}>
                {es ? "Explorar coches" : "Explore cars"}{" "}
                <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/membership" className={styles.secondaryButton}>
                {es ? "Membresías" : "Membership"}
              </Link>
              <Link
                href={"https://akipasa.com/" + locale + "/account/settings"}
                className={styles.secondaryButton}
              >
                {es ? "Ajustes de cuenta" : "Account settings"}
              </Link>
            </div>
          </div>
          <div className={styles.identity}>
            <span className={styles.avatar} aria-hidden="true">
              {(user.email || "A").slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{es ? "Cuenta AkiSuite" : "AkiSuite account"}</strong>
              <small>{user.email}</small>
            </div>
          </div>
        </section>

        {!error && (
          <section
            className={styles.stats}
            aria-label={
              es
                ? "Resumen de solicitudes recientes"
                : "Recent requests overview"
            }
          >
            <div>
              <strong>{bookings.length}</strong>
              <span>{es ? "Últimas solicitudes" : "Recent requests"}</span>
            </div>
            <div>
              <strong>{upcoming.length}</strong>
              <span>{es ? "Próximas / vigentes" : "Current & upcoming"}</span>
            </div>
            <div>
              <strong>{pending.length}</strong>
              <span>{es ? "Esperando respuesta" : "Awaiting reply"}</span>
            </div>
          </section>
        )}

        <div className={styles.columns}>
          <section className={styles.bookings}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>
                  {filter === "saved"
                    ? es
                      ? "TU LISTA"
                      : "YOUR SHORTLIST"
                    : es
                      ? "TUS RESERVAS"
                      : "YOUR BOOKINGS"}
                </span>
                <h2>
                  {filter === "saved"
                    ? es
                      ? "Coches guardados"
                      : "Saved cars"
                    : es
                      ? "Solicitudes de alquiler"
                      : "Rental requests"}
                </h2>
              </div>
              <span className={styles.subtle}>
                {filter === "saved"
                  ? es
                    ? "Guardados en este dispositivo"
                    : "Saved on this device"
                  : es
                    ? "Últimas 50 solicitudes"
                    : "Latest 50 requests"}
              </span>
            </div>
            <nav
              className={styles.filters}
              aria-label={es ? "Filtrar solicitudes" : "Filter requests"}
            >
              {(
                [
                  ["all", es ? "Todas" : "All"],
                  ["upcoming", es ? "Próximas" : "Upcoming"],
                  ["history", es ? "Historial" : "History"],
                  ["saved", es ? "Guardados" : "Saved"],
                ] as const
              ).map(([value, text]) => (
                <Link
                  key={value}
                  href={"/account?lang=" + locale + "&tab=" + value}
                  aria-current={filter === value ? "page" : undefined}
                >
                  {text}
                </Link>
              ))}
            </nav>
            {filter === "saved" ? (
              <SavedRentalsPanel locale={locale} />
            ) : error ? (
              <div className={styles.message} role="alert">
                {es
                  ? "No hemos podido cargar las solicitudes. Inténtalo de nuevo."
                  : "We couldn't load your rental requests. Please try again."}
              </div>
            ) : visible.length === 0 ? (
              <div className={styles.message}>
                <strong>
                  {es
                    ? "No hay solicitudes en esta sección"
                    : "Nothing here yet"}
                </strong>
                <p>
                  {es
                    ? "Cuando solicites un coche, podrás seguir su estado aquí."
                    : "Once you request a car, you can track its status here."}
                </p>
                <Link href={"/?lang=" + locale}>
                  {es ? "Buscar coches →" : "Find a car →"}
                </Link>
              </div>
            ) : (
              <div className={styles.requestList}>
                {visible.map((booking) => {
                  const vehicle = Array.isArray(booking.vehicle)
                    ? booking.vehicle[0]
                    : booking.vehicle;
                  const company = Array.isArray(vehicle?.company)
                    ? vehicle.company[0]
                    : vehicle?.company;
                  return (
                    <article className={styles.request} key={booking.id}>
                      <div className={styles.requestTop}>
                        <div>
                          <span className={styles.operator}>
                            {company?.name ||
                              (es ? "Empresa de alquiler" : "Rental company")}
                          </span>
                          <h3>
                            {vehicle?.name || (es ? "Vehículo" : "Vehicle")}
                          </h3>
                          {company?.city && <small>{company.city}</small>}
                        </div>
                        <span
                          className={styles.status}
                          data-status={booking.status}
                        >
                          {labels[booking.status] ||
                            (es ? "Estado desconocido" : "Status unknown")}
                        </span>
                      </div>
                      <div className={styles.requestDetails}>
                        <span>
                          <small>{es ? "RECOGIDA" : "PICK-UP"}</small>
                          <strong>{booking.start_date}</strong>
                        </span>
                        <span aria-hidden="true" className={styles.arrow}>
                          →
                        </span>
                        <span>
                          <small>{es ? "DEVOLUCIÓN" : "DROP-OFF"}</small>
                          <strong>{booking.end_date}</strong>
                        </span>
                        <span className={styles.total}>
                          <small>
                            {es ? "TOTAL ESTIMADO" : "ESTIMATED TOTAL"}
                          </small>
                          <strong>
                            {formatRentalPrice(
                              booking.quoted_total_cents,
                              locale,
                            )}
                          </strong>
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            {filter !== "saved" && (
              <p className={styles.finePrint}>
                {es
                  ? "Las solicitudes requieren confirmación de la empresa. AkiCoches no cobra pagos online."
                  : "Rental requests require company confirmation. AkiCoches does not take online payments."}
              </p>
            )}
          </section>
          <aside
            className={styles.sidebar}
            aria-label={es ? "Opciones de cuenta" : "Account options"}
          >
            <section className={styles.sideCard}>
              <span className={styles.eyebrow}>
                {es ? "ACCESOS RÁPIDOS" : "QUICK LINKS"}
              </span>
              <h2>{es ? "Tu espacio" : "Your space"}</h2>
              <Link href={"/?lang=" + locale}>
                <span>{es ? "Buscar otro coche" : "Find another car"}</span>
                <span aria-hidden="true">↗</span>
              </Link>
              <Link href={"/map?lang=" + locale}>
                <span>{es ? "Explorar el mapa" : "Explore the map"}</span>
                <span aria-hidden="true">↗</span>
              </Link>
              <Link href={"https://akipasa.com/" + locale + "/account"}>
                <span>{es ? "Mi perfil AkiSuite" : "My AkiSuite profile"}</span>
                <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href={"https://akipasa.com/" + locale + "/account/settings"}
              >
                <span>
                  {es ? "Seguridad y ajustes" : "Security & settings"}
                </span>
                <span aria-hidden="true">↗</span>
              </Link>
            </section>
            <section className={styles.sideCard}>
              <span className={styles.eyebrow}>
                {es ? "TU CUENTA" : "YOUR ACCOUNT"}
              </span>
              <h2>
                {es
                  ? "Una cuenta, toda AkiSuite"
                  : "One account across AkiSuite"}
              </h2>
              <p>
                {es
                  ? "Tu identidad es compartida, pero cada producto mantiene sus reservas. Es posible que debas iniciar sesión al cambiar de web."
                  : "Your identity is shared, but each product keeps its own bookings. You may need to sign in again on another website."}
              </p>
              <form action={signOut}>
                <input type="hidden" name="locale" value={locale} />
                <button type="submit" className={styles.logout}>
                  {es ? "Cerrar sesión" : "Sign out"}{" "}
                  <span aria-hidden="true">↗</span>
                </button>
              </form>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
