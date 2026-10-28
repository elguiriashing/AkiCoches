import type { Metadata } from "next";
import { headers } from "next/headers";
import { AkiConduzco } from "@/components/AkiConduzco";
import { LaunchWaitlist } from "@/components/LaunchWaitlist";
import { conduzcoLocale } from "@/lib/akiconduzco-i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = conduzcoLocale((await headers()).get("x-akipasa-locale"));
  const title =
    locale === "es"
      ? "Estamos preparando AkiCoches"
      : "AkiCoches is on its way";
  return {
    title: { absolute: `${title} · AkiCoches` },
    description:
      locale === "es"
        ? "AkiCoches está en desarrollo. Apúntate para saber cuándo llegará a tu zona. Aún no admitimos reservas."
        : "AkiCoches is under development. Join the launch list for your area. Bookings are not available yet.",
    alternates: { canonical: "https://akicoches.com/" },
    openGraph: {
      title: `${title} · AkiCoches`,
      url: "https://akicoches.com/",
      siteName: "AkiCoches",
      type: "website",
    },
  };
}

export default async function AkiConduzcoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const query = await searchParams;
  const locale = conduzcoLocale((await headers()).get("x-akipasa-locale"));
  if (typeof query.q !== "string" || !query.q.trim()) return (
    <LaunchWaitlist product="coches" locale={locale} siteKey={process.env.NEXT_PUBLIC_LAUNCH_WAITLIST_TURNSTILE_SITE_KEY || null} />
  );
  return (
    <AkiConduzco
      locale={conduzcoLocale((await headers()).get("x-akipasa-locale"))}
      initialQuery={
        typeof query.q === "string" ? query.q.trim().slice(0, 100) : ""
      }
    />
  );
}
