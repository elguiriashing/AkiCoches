"use client";

import Image from "next/image";
import styles from "./SuitePricingExperience.module.css";

export type DiscoveryProduct = "akipasa" | "akiduermo" | "akicoches" | "akihq";
type Locale = "en" | "es";
type Offer = "hq" | "listing" | "basico" | "standard" | "pro";

const products = {
  akipasa: {
    name: "AkiPasa",
    theme: "orange",
    logo: "/pwa/akipasa-192.png",
    en: {
      eyebrow: "PLACES. PEOPLE. POSSIBILITIES.",
      title: "More of the places you love.",
      intro:
        "Give your favourite discoveries a little extra. Give your business the tools to get discovered.",
    },
    es: {
      eyebrow: "LUGARES. GENTE. POSIBILIDADES.",
      title: "Más de los lugares que te encantan.",
      intro:
        "Más ventajas para descubrir lugares. Más herramientas para que descubran tu negocio.",
    },
    personalEn: [
      "Extra rewards for discovery",
      "Member-only benefits",
      "More ways to plan and save",
    ],
    personalEs: [
      "Más recompensas al descubrir",
      "Ventajas exclusivas",
      "Más formas de guardar y planificar",
    ],
    listingEn: [
      "Premium venue presence",
      "Enhanced media and presentation",
      "More tools for events and visibility",
    ],
    listingEs: [
      "Presencia Premium del local",
      "Presentación y fotos ampliadas",
      "Más herramientas para eventos y visibilidad",
    ],
  },
  akiduermo: {
    name: "AkiDuermo",
    theme: "mint",
    logo: "/brand/duermo-icon.png",
    en: {
      eyebrow: "GOOD NIGHTS. BETTER TRIPS.",
      title: "A better stay starts here.",
      intro:
        "Find your next favourite stay, or give your property a stronger presence.",
    },
    es: {
      eyebrow: "BUENAS NOCHES. MEJORES VIAJES.",
      title: "Tu próxima estancia empieza aquí.",
      intro: "Descubre dónde alojarte o haz que tu propiedad destaque.",
    },
    personalEn: [
      "Extra travel and saved-stay benefits",
      "Personal trip planning",
      "Premium discovery features",
    ],
    personalEs: [
      "Más ventajas para tus viajes",
      "Planificación personal",
      "Funciones Premium para descubrir",
    ],
    listingEn: [
      "Premium property presence",
      "Enhanced property media",
      "Additional insights for accommodation",
    ],
    listingEs: [
      "Presencia Premium de tu alojamiento",
      "Más opciones multimedia",
      "Información ampliada para alojamientos",
    ],
  },
  akicoches: {
    name: "AkiCoches",
    theme: "coral",
    logo: "/brand/conduzco-icon.svg",
    en: {
      eyebrow: "GO FURTHER.",
      title: "Your next journey, upgraded.",
      intro:
        "Explore with more confidence. Help your rental business stand out.",
    },
    es: {
      eyebrow: "LLEGA MÁS LEJOS.",
      title: "Mejora tu próximo viaje.",
      intro:
        "Descubre con más confianza. Haz que destaque tu empresa de alquiler.",
    },
    personalEn: [
      "Premium rental discovery experience",
      "More travel-planning convenience",
      "Personal member benefits",
    ],
    personalEs: [
      "Búsqueda de alquileres Premium",
      "Planificación más cómoda",
      "Ventajas para miembros",
    ],
    listingEn: [
      "Premium rental branch presence",
      "Enhanced fleet presentation",
      "More visibility and performance tools",
    ],
    listingEs: [
      "Presencia Premium de tu sucursal",
      "Presentación ampliada de la flota",
      "Más visibilidad y análisis",
    ],
  },
  akihq: {
    name: "AkiHQ",
    theme: "gold",
    logo: "/brand/hq-mark.svg",
    en: {
      eyebrow: "THE FREE BUSINESS HUB.",
      title: "Your business. One home.",
      intro:
        "Manage your AkiSuite presence for free. Add business tools only when you need them.",
    },
    es: {
      eyebrow: "TU CENTRO DE NEGOCIO GRATIS.",
      title: "Tu negocio. Un solo lugar.",
      intro:
        "Gestiona tu presencia en AkiSuite gratis. Añade herramientas cuando las necesites.",
    },
    personalEn: [],
    personalEs: [],
    listingEn: [
      "Premium listing tools on a discovery product",
      "Keep your existing AkiHQ management",
      "Business-focused upgrades",
    ],
    listingEs: [
      "Herramientas Premium para tu anuncio",
      "Mantén tu gestión gratuita en AkiHQ",
      "Mejoras para empresas",
    ],
  },
} as const;

const price: Record<Offer, number> = {
  hq: 0,
  listing: 1499,
  basico: 2499,
  standard: 4499,
  pro: 6499,
};
const basicoFeatures = {
  en: [
    "Choose 4 of 12 operating tools",
    "Replace 1 tool each monthly cycle",
    "Per location, with team access",
  ],
  es: [
    "Elige 4 de 12 herramientas",
    "Cambia 1 cada ciclo mensual",
    "Por ubicación, con acceso de equipo",
  ],
};
const standardFeatures = {
  en: [
    "Choose 8 of 12 operating tools",
    "Replace 2 tools each monthly cycle",
    "More room for growing teams",
  ],
  es: [
    "Elige 8 de 12 herramientas",
    "Cambia 2 cada ciclo mensual",
    "Más capacidad para equipos en crecimiento",
  ],
};
const proFeatures = {
  en: [
    "All 12 operating tools",
    "Unrestricted replacements",
    "Complete operations workspace",
  ],
  es: [
    "Las 12 herramientas operativas",
    "Cambios sin límite",
    "Espacio de operaciones completo",
  ],
};
const hqFeatures = {
  en: [
    "Listings, locations and teams",
    "One free management hub",
    "Upgrade only when you need operations",
  ],
  es: [
    "Fichas, ubicaciones y equipos",
    "Un centro de gestión gratuito",
    "Mejora solo cuando necesites operaciones",
  ],
};

function formatCents(cents: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function SuitePricingExperience({
  locale,
  product,
  logo,
}: {
  locale: Locale;
  product: DiscoveryProduct;
  logo?: string;
}) {
  const es = locale === "es";
  const app = products[product];
  const productOffers: Offer[] = ["hq", "listing", "basico", "standard", "pro"];
  const catalogue: Record<
    Offer,
    { name: string; label: string; benefits: readonly string[] }
  > = {
    hq: {
      name: "AkiHQ",
      label: es ? "Gestión gratis" : "Free management",
      benefits: hqFeatures[locale],
    },
    listing: {
      name: `${app.name} Premium`,
      label: es ? "Más visibilidad" : "More visibility",
      benefits: es ? app.listingEs : app.listingEn,
    },
    basico: {
      name: "AkiBusiness Standard",
      label: es ? "Operaciones" : "Operations",
      benefits: basicoFeatures[locale],
    },
    standard: {
      name: "AkiBusiness Plus",
      label: es ? "Más capacidad" : "More capacity",
      benefits: standardFeatures[locale],
    },
    pro: {
      name: "AkiBusiness Pro",
      label: es ? "Operaciones avanzadas" : "Advanced operations",
      benefits: proFeatures[locale],
    },
  };
  const offerEmail = (offer: Offer) =>
    `mailto:alex@akipasa.com?subject=${encodeURIComponent(`AkiSuite enquiry: ${product} / ${catalogue[offer].name} (${offer})`)}`;
  return (
    <main className={styles.root} data-theme={app.theme} data-product={product}>
      <div className={styles.orbit} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.topline}>
          <a
            className={styles.brand}
            href={
              product === "akipasa"
                ? `/${locale}`
                : product === "akihq"
                  ? `/${locale}/business`
                  : `/?lang=${locale}`
            }
          >
            <Image
              src={logo || app.logo}
              alt=""
              width={40}
              height={40}
              unoptimized
            />
            <span>
              {app.name}
              <small>MEMBERSHIP STUDIO</small>
            </span>
          </a>
          <nav
            className={styles.topActions}
            aria-label={es ? "Acciones de membresía" : "Membership navigation"}
          >
            <a
              href={`https://akipasa.com/${locale}/account/subscription?from=${product === "akihq" ? "akibusiness" : product}`}
            >
              {es ? "Mis suscripciones" : "My subscriptions"}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </header>

        <section className={styles.hero} aria-labelledby="suite-pricing-title">
          <div className={styles.heroCopy}>
            <span className={styles.overline}>
              <span className={styles.spark} aria-hidden="true">
                ✦
              </span>
              {app[locale].eyebrow}
            </span>
            <h1 id="suite-pricing-title">{app[locale].title}</h1>
            <p>{app[locale].intro}</p>
            <div className={styles.heroFacts}>
              <span>
                <span aria-hidden="true">✓</span>{" "}
                {es ? "Tu cuenta AkiSuite" : "One AkiSuite account"}
              </span>
              <span>
                <span aria-hidden="true">✓</span>{" "}
                {es
                  ? "Pago seguro cuando se active"
                  : "Secure checkout on launch"}
              </span>
            </div>
          </div>
          <div className={styles.heroArtwork} aria-hidden="true">
            <div className={styles.artGlow} />
            <div className={styles.artMain}>
              <Image
                src={logo || app.logo}
                width={92}
                height={92}
                alt=""
                unoptimized
              />
              <span>{app.name}</span>
            </div>
            <span className={styles.orbitOne}>✦</span>
            <span className={styles.orbitTwo}>✧</span>
          </div>
        </section>

        <section
          className={styles.catalogue}
          aria-labelledby="suite-packages-heading"
        >
          <div className={styles.catalogueTop}>
            <div>
              <span className={styles.kicker}>
                AKISUITE / {es ? "MEMBRESÍAS" : "MEMBERSHIPS"}
              </span>
              <h2 id="suite-packages-heading">
                {es
                  ? "El plan adecuado para cada paso."
                  : "A plan for your next move."}
              </h2>
              <p>
                {es
                  ? "Solo las opciones relevantes para esta aplicación."
                  : "Only the plans that make sense for this product."}
              </p>
            </div>
          </div>
          <div className={styles.cards} data-count={productOffers.length}>
            {productOffers.map((offer) => {
              const item = catalogue[offer];
              const free = offer === "hq";
              const featured = offer === "standard";
              const amount = price[offer];
              return (
                <article
                  id={`suite-${offer}`}
                  key={offer}
                  className={styles.card}
                  data-featured={featured || undefined}
                  data-offer={offer}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.planIcon} aria-hidden="true">
                      {offer === "hq"
                        ? "⌂"
                        : offer === "listing"
                          ? "◈"
                          : offer === "basico"
                            ? "▦"
                            : offer === "standard"
                              ? "✦"
                              : offer === "pro"
                                ? "✳"
                                : "✧"}
                    </span>
                    <span className={styles.cardType}>{item.label}</span>
                    {featured && (
                      <span className={styles.recommended}>
                        {es ? "8 herramientas" : "8 tools"}
                      </span>
                    )}
                  </div>
                  <div className={styles.cardBrand}>
                    <Image
                      src={free ? "/brand/hq-mark.svg" : offer === "listing" ? app.logo : "/brand/business-mark.svg"}
                      alt=""
                      width={46}
                      height={46}
                      unoptimized
                    />
                  </div>
                  <h3>{item.name}</h3>
                  {offer === "listing" && (
                    <p className={styles.planSub}>
                      {es
                        ? "Mejora el perfil de tu negocio en esta aplicación."
                        : "Upgrade your business presence in this app."}
                    </p>
                  )}
                  {offer === "hq" && (
                    <p className={styles.planSub}>
                      {es
                        ? "Tu centro gratuito para gestionar AkiSuite."
                        : "Your free home for managing AkiSuite."}
                    </p>
                  )}
                  <div className={styles.price}>
                    <strong>
                      {free
                        ? es
                          ? "Gratis"
                          : "Free"
                        : formatCents(amount, locale)}
                    </strong>
                    {!free && <span>/{es ? "mes" : "month"}</span>}
                  </div>
                  <p className={styles.cycleInfo}>
                    {free
                      ? es
                        ? "Sin tarjeta y sin suscripción."
                        : "No card and no subscription required."
                      : es
                        ? "Importe mensual."
                        : "Monthly amount."}
                  </p>
                  <div className={styles.planDivider} />
                  <ul className={styles.features}>
                    {item.benefits.map((benefit) => (
                      <li key={benefit}>
                        <span aria-hidden="true">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.cardBottom}>
                    <a
                      href={
                        free
                          ? `https://akihq.app/${locale}/business`
                          : offerEmail(offer)
                      }
                      className={
                        featured ? styles.primaryAction : styles.secondaryAction
                      }
                    >
                      {free
                        ? es
                          ? "Abrir AkiHQ gratis"
                          : "Open AkiHQ for free"
                        : es
                          ? "Consultar disponibilidad"
                          : "Enquire about this plan"}
                      <span aria-hidden="true">↗</span>
                    </a>
                    <small>
                      {free
                        ? es
                          ? "Siempre disponible"
                          : "Always available"
                        : es
                          ? "Precio previsto · activación pendiente"
                          : "Staged pricing · checkout not yet live"}
                    </small>
                  </div>
                </article>
              );
            })}
          </div>
          <p className={styles.footerNote}>
            {es
              ? "Tu selección activa permite trabajar ahora. Los cambios guardados se aplican en la próxima rotación mensual, también para las suscripciones anuales existentes. Puedes delegar las herramientas activas al equipo al instante. Listing Premium y las herramientas operativas son suscripciones distintas."
              : "Your active toolbox is available now. Saved changes apply at the next monthly rotation, including existing annual subscriptions. Delegate active tools to staff instantly. Listing Premium and operating tools are separate subscriptions."}
          </p>
          <p className={styles.footerNote}>
            {es
              ? "Importes mensuales. Los impuestos aplicables se confirman antes del pago. No se realiza ningún cobro desde esta pantalla. Las suscripciones anteriores siguen disponibles desde Mis suscripciones."
              : "Monthly amounts. Applicable taxes are confirmed before payment. This page does not collect payment. Existing subscriptions remain manageable under My subscriptions."}
          </p>
        </section>
      </div>
    </main>
  );
}
