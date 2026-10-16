import { spainLocations } from "./locations";

const publicManagementOrigin = process.env.NEXT_PUBLIC_BUSINESS_URL;
const publicOperationsOrigin = process.env.NEXT_PUBLIC_CRM_URL;
// Preserve custom preview origins while remapping known old product defaults.
const managementOrigin =
  !publicManagementOrigin ||
  publicManagementOrigin.replace(/\/$/, "") === "https://akibusiness.com"
    ? "https://akihq.app"
    : publicManagementOrigin;
const operationsOrigin =
  !publicOperationsOrigin ||
  publicOperationsOrigin.replace(/\/$/, "") === "https://akihq.app"
    ? "https://akibusiness.com"
    : publicOperationsOrigin;

export const config = {
  productName: process.env.NEXT_PUBLIC_PRODUCT_NAME || "AkiCoches",
  wordmark: "AkiCoches",
  handle: "akicoches",
  domain: "akicoches.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://akicoches.com",
  crmUrl: operationsOrigin,
  businessUrl: managementOrigin,
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
