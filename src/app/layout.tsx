import "./globals.css";
import "./compact-app.css";
import "./brand.css";
import "./appearance.css";
import "./tablet-responsive.css";
import "./portal-unity.css";
import "./product-brand.css";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { ConsentAnalytics } from "@/components/ConsentAnalytics";
import { PersonalisationConsent } from "@/components/PersonalisationConsent";
import { PwaRegistration } from "@/components/PwaRegistration";
import { ThemeManager } from "@/components/ThemeModeControls";
export const viewport: Viewport = { themeColor: "#FF3047" };
export const metadata: Metadata = {
  metadataBase: new URL("https://akicoches.com"),
  title: {
    default: "AkiCoches · Find your way there",
    template: "%s · AkiCoches",
  },
  description: "Discover local rental cars for your trip across Spain.",
  applicationName: "AkiCoches",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/brand/conduzco-icon.svg?v=2",
    apple: "/brand/conduzco-v2-180.png",
  },
  openGraph: {
    type: "website",
    siteName: "AkiCoches",
    title: "AkiCoches",
    url: "https://akicoches.com",
    locale: "es_ES",
    alternateLocale: "en_GB",
  },
  twitter: { card: "summary", title: "AkiCoches" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale =
    (await headers()).get("x-akipasa-locale") === "en" ? "en" : "es";
  return (
    <html lang={locale}>
      <body data-product="akiconduzco">
        <PwaRegistration />
        <ThemeManager />
        {children}
        <ConsentAnalytics />
        <PersonalisationConsent locale={locale} />
      </body>
    </html>
  );
}
