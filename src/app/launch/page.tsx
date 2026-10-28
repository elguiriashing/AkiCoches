import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { conduzcoLocale } from "@/lib/akiconduzco-i18n";
import styles from "./launch.module.css";

/** Deliberately noindexed preview until the verified waitlist backend is live. */
export const metadata: Metadata = {
  title: "AkiCoches | Launch preview",
  description: "Preview of the upcoming AkiCoches experience.",
  robots: { index: false, follow: false },
};

export default async function LaunchPreviewPage() {
  const locale = conduzcoLocale((await headers()).get("x-akipasa-locale"));
  const es = locale === "es";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={"/?lang=" + locale} className={styles.brand}>
          <Image
            src="/brand/v3/coches.svg"
            alt=""
            width={48}
            height={48}
            unoptimized
          />
          <strong>AkiCoches<span>.</span></strong>
        </Link>
        <span className={styles.tag}>
          {es ? "Próximamente" : "Coming soon"}
        </span>
      </header>

      <section className={styles.main} aria-labelledby="launch-title">
        <span className={styles.eyebrow}>
          {es ? "En desarrollo" : "Under development"}
        </span>
        <h1 id="launch-title" className={styles.title}>
          {es
            ? "Tu próxima ruta se está preparando."
            : "Your next journey is taking shape."}
        </h1>
        <p className={styles.copy}>
          {es
            ? "AkiCoches está en desarrollo. Todavía no mostramos alquileres activos ni disponibilidad de vehículos en esta página. Estamos creando una experiencia local más sencilla y transparente."
            : "AkiCoches is under development. We are not showing live car rentals or vehicle availability on this page yet. We're building a simpler, more transparent local experience."}
        </p>
        <section className={styles.detail} aria-label={es ? "Lanzamiento" : "Launch"}>
          <h2>{es ? "Una lista de espera, sin spam" : "A waitlist without the spam"}</h2>
          <p>
            {es
              ? "Estamos preparando un registro para personas y negocios, por ciudad e intereses. Se abrirá cuando la verificación del email y la privacidad estén listas. Esta vista previa no recoge datos."
              : "We're preparing a sign-up for individuals and businesses, by city and interests. It opens once email verification and privacy controls are ready. This preview does not collect information."}
          </p>
          <div className={styles.pills}>
            <span className={styles.pill}>{es ? "Personas" : "Individuals"}</span>
            <span className={styles.pill}>{es ? "Negocios" : "Businesses"}</span>
            <span className={styles.pill}>{es ? "ES / EN" : "EN / ES"}</span>
          </div>
        </section>
        <nav className={styles.actions} aria-label={es ? "Opciones" : "Options"}>
          <Link href={"/hq-login?lang=" + locale}>
            {es ? "Acceso para negocios" : "Business sign in"}
          </Link>
          <Link href={"/account?lang=" + locale}>
            {es ? "Mi cuenta" : "My account"}
          </Link>
          <Link href={"https://akipasa.com/" + locale}>
            {es ? "Descubre planes en AkiPasa" : "Find plans on AkiPasa"}
          </Link>
        </nav>
      </section>
      <footer className={styles.footer}>
        <span>AkiCoches · {es ? "Una experiencia en construcción" : "An experience in progress"}</span>
        <Link href={"/" + locale + "/privacy"}>
          {es ? "Privacidad" : "Privacy"}
        </Link>
      </footer>
    </main>
  );
}
