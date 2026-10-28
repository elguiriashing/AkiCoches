import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./gateway.module.css";

export const metadata: Metadata = {
  title: "Business access | AkiHQ",
  description: "Secure business management is available through AkiHQ.",
  robots: { index: false, follow: false },
};

export default async function HQLogin({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const locale = (await searchParams).lang === "en" ? "en" : "es";
  const es = locale === "es";
  return (
    <main
      className={styles.gateway}
      style={{ "--gateway-accent": "#ff3047" } as CSSProperties}
    >
      <section className={styles.shell}>
        <div className={styles.brand}>
          <Image src="/brand/v3/coches.svg" alt="" width={52} height={52} />
          <span>
            AkiCoches <span aria-hidden="true">/</span> AkiHQ
          </span>
        </div>
        <p className={styles.kicker}>
          {es ? "PARA EMPRESAS DE ALQUILER" : "FOR RENTAL PARTNERS"}
        </p>
        <h1 className={styles.title}>
          {es ? "Gestiona tu flota en AkiHQ" : "Manage your fleet on AkiHQ"}
        </h1>
        <p className={styles.description}>
          {es
            ? "Accede a tu empresa, sucursales y equipo desde el espacio de gestión para negocios mientras desarrollamos AkiCoches."
            : "Access your company, rental branches and team using the business-management workspace while AkiCoches is in development."}
        </p>
        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={`https://akihq.app/login?lang=${locale}`}
          >
            {es ? "Entrar a AkiHQ" : "Sign in to AkiHQ"}
          </a>
          <Link className={styles.secondary} href={`/?lang=${locale}`}>
            {es ? "Volver a explorar" : "Back to discovery"}
          </Link>
        </div>
        <p className={styles.note}>
          {es
            ? "AkiHQ gestiona tus fichas y ubicaciones. AkiBusiness es otro producto, independiente, para operaciones empresariales."
            : "AkiHQ manages your listings and locations. AkiBusiness is a separate, independent operations product."}{" "}
          <a href="https://akibusiness.com">
            {es ? "Conocer AkiBusiness" : "About AkiBusiness"}
          </a>
        </p>
      </section>
    </main>
  );
}
