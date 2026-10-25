import { notFound } from "next/navigation";
import { isLocale } from "@/lib/config";
import { ProductPrivacy } from "@/components/ProductPrivacy";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ProductPrivacy locale={locale} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: locale === "es" ? "Privacidad de AkiCoches" : "AkiCoches privacy",
    description:
      locale === "es"
        ? "Datos, conservación y eliminación de cuenta de AkiCoches."
        : "AkiCoches data, retention and account deletion.",
    alternates: {
      canonical: `https://akicoches.com/${locale}/privacy`,
      languages: {
        en: "https://akicoches.com/en/privacy",
        es: "https://akicoches.com/es/privacy",
      },
    },
  };
}
