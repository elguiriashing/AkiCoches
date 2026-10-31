import { notFound } from "next/navigation";
import { isLocale } from "@/lib/config";
import { ProductPrivacy } from "@/components/ProductPrivacy";
import { publicPageMetadata } from "@/lib/page-metadata";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ProductPrivacy locale={locale} />;
}

export const generateMetadata = publicPageMetadata("/privacy");
