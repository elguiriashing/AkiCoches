import type { Metadata } from "next";
import { headers } from "next/headers";
import { SuitePricingExperience } from "@/components/SuitePricingExperience";
import { personalPremiumVisible } from "@/lib/akisuite-rollout";
import { conduzcoLocale } from "@/lib/akiconduzco-i18n";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Memberships · AkiCoches",
  description: "AkiCoches Premium, rental-branch upgrades, AkiBusiness and AkiEnterprise.",
  alternates: { canonical: "https://akicoches.com/membership" },
};

export default async function MembershipPage() {
  const locale = conduzcoLocale((await headers()).get("x-akipasa-locale"));
  return (
    <SuitePricingExperience
      locale={locale}
      product="akicoches"
      personalUnlocked={await personalPremiumVisible()}
      logo="/brand/conduzco-icon.svg"
    />
  );
}
