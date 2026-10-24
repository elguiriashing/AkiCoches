import type { Metadata } from "next";
import { headers } from "next/headers";
import { SuitePricingExperience } from "@/components/SuitePricingExperience";
import { conduzcoLocale } from "@/lib/akiconduzco-i18n";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Memberships · AkiCoches",
  description:
    "AkiCoches Premium for individuals and businesses. Free AkiHQ management and separate AkiBusiness operating tools.",
  alternates: { canonical: "https://akicoches.com/membership" },
};

export default async function MembershipPage() {
  const locale = conduzcoLocale((await headers()).get("x-akipasa-locale"));
  return (
    <SuitePricingExperience
      locale={locale}
      product="akicoches"
      logo="/brand/v3/coches.svg"
    />
  );
}
