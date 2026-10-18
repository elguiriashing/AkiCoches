import Link from "next/link";
import { headers } from "next/headers";
import { ConduzcoHeader } from "@/components/AkiConduzco";
import { conduzcoLocale } from "@/lib/akiconduzco-i18n";
import styles from "./membership.module.css";

export const metadata = {
  title: "Membership · AkiCoches",
  description: "Membership and AkiBusiness options for AkiCoches",
};

export default async function MembershipPage() {
  const locale = conduzcoLocale((await headers()).get("x-akipasa-locale"));
  const es = locale === "es";
  const plans = [
    { name: "AkiCoches for Business", kind: es ? "Visibilidad de flotas" : "Fleet visibility", description: es ? "Mejora la presencia de tu empresa y sus vehículos." : "Give your rental business and vehicles more visibility.", href: "https://akibusiness.com/", accent: "red" },
    { name: "AkiBusiness Standard", kind: es ? "Operaciones" : "Operations", description: es ? "Organiza tu actividad desde una plataforma." : "Keep your day-to-day business in one workspace.", href: "https://akibusiness.com/", accent: "gold" },
    { name: "AkiBusiness Pro", kind: es ? "Herramientas avanzadas" : "Advanced tools", description: es ? "Más control de equipos, inventario y operaciones." : "More control over your team, inventory and operations.", href: "https://akibusiness.com/", accent: "gold" },
    { name: "AkiEnterprise", kind: es ? "El ecosistema completo" : "The complete ecosystem", description: es ? "Una sola solución para el conjunto de AkiSuite." : "One solution spanning the AkiSuite ecosystem.", href: "https://akibusiness.com/", accent: "enterprise" },
  ] as const;
  return (
    <div className={styles.app}>
      <ConduzcoHeader locale={locale} />
      <main className={styles.main}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>AKICOCHES / AKISUITE</span>
          <h1>{es ? "Tu camino. Tu negocio. Más posibilidades." : "Your road. Your business. More possibilities."}</h1>
          <p>{es ? "Explora los planes para empresas y las herramientas de AkiSuite. Premium personal aparecerá después de nuestro lanzamiento por puntos." : "Explore business visibility and AkiSuite operations. Personal Premium will appear once our points-based launch goes live."}</p>
        </header>
        <section className={styles.grid} aria-label={es ? "Planes disponibles" : "Available plans"}>
          {plans.map((plan) => (
            <article className={styles.card} data-accent={plan.accent} key={plan.name}>
              <span className={styles.kind}>{plan.kind}</span>
              <h2>{plan.name}</h2>
              <p>{plan.description}</p>
              <Link href={plan.href} className={styles.action}>{es ? "Explorar opciones" : "Explore options"} <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </section>
        <p className={styles.note}>{es ? "Los precios finales y las compras se confirmarán en el catálogo de facturación. No se realiza ningún cargo desde esta página." : "Final prices and purchases are confirmed in the billing catalogue. This page does not initiate charges."}</p>
      </main>
    </div>
  );
}
