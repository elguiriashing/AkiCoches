import { spainLocations } from "./locations";

export function resolveProductOrigin(
  value: string | undefined,
  legacyOrigin: string,
  canonicalOrigin: string,
) {
  if (!value || value.replace(/\/$/, "") === legacyOrigin)
    return canonicalOrigin;
  try {
    const url = new URL(value);
    const loopback = ["localhost", "127.0.0.1"].includes(url.hostname);
    if (
      (url.protocol !== "https:" && !(loopback && url.protocol === "http:")) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      return canonicalOrigin;
    return url.origin;
  } catch {
    return canonicalOrigin;
  }
}

// Environment names are historical. Public product roles are now fixed:
// free listing/fleet management lives in AkiHQ; paid operations live in AkiBusiness.
const managementUrl = resolveProductOrigin(
  process.env.NEXT_PUBLIC_BUSINESS_URL,
  "https://akibusiness.com",
  "https://akihq.app",
);
const operationsUrl = resolveProductOrigin(
  process.env.NEXT_PUBLIC_CRM_URL,
  "https://akihq.app",
  "https://akibusiness.com",
);
export const config = {
  productName: process.env.NEXT_PUBLIC_PRODUCT_NAME || "AkiCoches",
  wordmark: "AkiCoches",
  handle: "akicoches",
  domain: "akicoches.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://akicoches.com",
  crmUrl: operationsUrl,
  businessUrl: managementUrl,
  tagline: { es: "Sal. Explora. Disfruta.", en: "Go out. Explore. Enjoy." },
  dataProvider: process.env.NEXT_PUBLIC_DATA_PROVIDER || "fixtures",
  mapStyleUrl:
    process.env.NEXT_PUBLIC_MAP_STYLE_URL ||
    "https://tiles.openfreemap.org/styles/liberty",
  googleAuthEnabled: process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true",
  currentTermsVersion: "2026-07-23",
  defaultLocale: "es" as const,
  locales: ["es", "en"] as const,
  timeZone: "Europe/Madrid",
  localities: spainLocations,
};

export type Locale = (typeof config.locales)[number];
export function isLocale(value: string): value is Locale {
  return config.locales.includes(value as Locale);
}
