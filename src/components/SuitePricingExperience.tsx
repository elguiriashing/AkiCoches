"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./SuitePricingExperience.module.css";
import { AkiSuiteAudienceStudio, type MembershipAudienceOffer } from "./AkiSuiteAudienceStudio";

export type DiscoveryProduct = "akipasa" | "akiduermo" | "akicoches" | "akihq";
type Locale = "en" | "es";
const products = {
  akipasa: { name: "AkiPasa", theme: "orange", logo: "/pwa/akipasa-192.png",
    en: { eyebrow: "PLACES. PEOPLE. POSSIBILITIES.", title: "More of the places you love.", intro: "Discover places or manage your venue presence." },
    es: { eyebrow: "LUGARES. GENTE. POSIBILIDADES.", title: "Disfruta más de tus lugares favoritos.", intro: "Descubre lugares o gestiona tu local." },
    subject: "venue", esSubject: "local" },
  akiduermo: { name: "AkiDuermo", theme: "mint", logo: "/brand/duermo-icon.png",
    en: { eyebrow: "GOOD NIGHTS. BETTER TRIPS.", title: "A better stay starts here.", intro: "For guests and property owners." },
    es: { eyebrow: "BUENAS NOCHES. MEJORES VIAJES.", title: "Tu próxima estancia empieza aquí.", intro: "Para viajeros y propietarios." },
    subject: "property", esSubject: "alojamiento" },
  akicoches: { name: "AkiCoches", theme: "coral", logo: "/brand/conduzco-icon.svg",
    en: { eyebrow: "GO FURTHER.", title: "Your next journey, upgraded.", intro: "Choose between personal discovery and managing your rental business." },
    es: { eyebrow: "LLEGA MÁS LEJOS.", title: "Mejora tu próximo viaje.", intro: "Elige entre descubrir alquileres y gestionar tu negocio de vehículos." },
    subject: "rental branch", esSubject: "sucursal de alquiler" },
  akihq: { name: "AkiHQ", theme: "orange", logo: "/brand/hq-mark.svg",
    en: { eyebrow: "MANAGE FOR FREE.", title: "Your business. One home.", intro: "Free management and separate listing upgrades." },
    es: { eyebrow: "GESTIONA GRATIS.", title: "Tu negocio. Un solo lugar.", intro: "Gestión gratuita y mejoras de fichas independientes." },
    subject: "listing", esSubject: "ficha" },
} as const;

export function SuitePricingExperience({ locale, product, logo }: { locale: Locale; product: DiscoveryProduct; logo?: string }) {
  const es = locale === "es";
  const app = products[product];
  const individual: [MembershipAudienceOffer, MembershipAudienceOffer] = [
    {
      id: "personal-free", name: `${app.name} Free`,
      label: es ? "Para particulares" : "For individuals",
      description: es ? `Descubre ${app.name} sin pagar una cuota.` : `Discover ${app.name} without a subscription fee.`,
      price: es ? "Gratis" : "Free",
      benefits: es ? ["Explora opciones de alquiler", "Guarda tus favoritos", "Sin suscripción obligatoria"] : ["Explore rental options", "Save your favourites", "No required subscription"],
      action: <Link href="/">{es ? "Explorar gratis" : "Explore for free"} ↗</Link>,
    },
    {
      id: "personal-premium", name: `${app.name} Personal Premium`,
      label: es ? "Premium personal" : "Personal Premium",
      description: es ? "Ventajas personales para el viajero, no para propietarios de fichas." : "Personal travel benefits, not a business listing upgrade.",
      price: es ? "Próximamente" : "Coming soon",
      benefits: es ? ["Ventajas para viajeros", "Sin compra hasta su lanzamiento", "Sin software empresarial"] : ["Benefits for travellers", "Not yet available for new purchases", "No business software included"],
      action: <button type="button" disabled>{es ? "Aún no disponible" : "Not available yet"}</button>,
      note: es ? "El precio se confirmará antes del lanzamiento." : "Price will be confirmed before launch.",
      highlighted: true,
    },
  ];
  const business: [MembershipAudienceOffer, MembershipAudienceOffer] = [
    {
      id: "akihq-free", name: "AkiHQ",
      label: es ? "Gestión gratuita" : "Free business management",
      description: es ? `Tu centro para gestionar gratis tu ${app.esSubject} de ${app.name}.` : `Your home for managing your free ${app.name} ${app.subject}.`,
      price: es ? "Gratis" : "Free",
      benefits: es ? ["Sucursales y flotas", "Equipo y permisos", "Siempre gratis"] : ["Branches and fleets", "Team permissions", "Always free"],
      action: <a href={`https://akihq.app/${locale}/business`}>{es ? "Abrir AkiHQ gratis" : "Open free AkiHQ"} ↗</a>,
    },
    {
      id: "listing-premium", name: `${app.name} Business Premium`,
      label: es ? "Premium empresarial para AkiHQ" : "Business Premium for AkiHQ",
      description: es ? `Mejora tu presencia y desbloquea herramientas Premium para gestionar tu ${app.esSubject} de ${app.name} desde AkiHQ.` : `Upgrade your presence and unlock premium tools for your ${app.name} ${app.subject} through AkiHQ.`,
      price: "€14.99", period: es ? "/ mes por sucursal" : "/ month per branch",
      benefits: es ? ["Presencia Premium de la sucursal", "Mejor presentación de flota", "AkiBusiness se contrata aparte"] : ["Premium rental branch presence", "Enhanced fleet presentation", "AkiBusiness sold separately"],
      action: <a href={`mailto:alex@akipasa.com?subject=${encodeURIComponent(app.name + " Business Premium")}`}>{es ? "Consultar disponibilidad" : "Enquire about this plan"} ↗</a>,
      highlighted: true,
      note: es ? "Precio previsto · checkout pendiente" : "Staged price · checkout not yet live",
    },
  ];
  return <main className={styles.root} data-theme={app.theme} data-product={product}>
    <div className={styles.inner}>
      <header className={styles.topline}>
        <a className={styles.brand} href={product === "akipasa" ? `/${locale}` : product === "akihq" ? `/${locale}/business` : `/?lang=${locale}`}>
          <Image src={logo || app.logo} alt="" width={40} height={40} unoptimized/>
          <span>{app.name}<small>AKISUITE</small></span>
        </a>
        <nav className={styles.topActions} aria-label={es ? "Acciones de membresía" : "Membership navigation"}>
          <a href={`https://akipasa.com/${locale}/account/subscription?from=${product === "akihq" ? "akibusiness" : product}`}>{es ? "Mis suscripciones" : "My subscriptions"} ↗</a>
        </nav>
      </header>
      <AkiSuiteAudienceStudio
        theme={app.theme} locale={locale} product={app.name}
        eyebrow={app[locale].eyebrow} title={app[locale].title} description={app[locale].intro}
        individual={individual} business={business} businessSoftwareHref={`https://akibusiness.com/?locale=${locale}`}
        footerNote={<p>{es ? "Premium personal, Premium de fichas y AkiBusiness son independientes. Esta página no inicia ningún cobro." : "Personal Premium, listing Premium and AkiBusiness are separate products. No payment is collected on this page."}</p>}
      />
    </div>
  </main>;
}
