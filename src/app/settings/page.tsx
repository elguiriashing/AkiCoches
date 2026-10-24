import { headers } from "next/headers";
import { conduzcoLocale } from "@/lib/akiconduzco-i18n";
import { ConduzcoHeader } from "@/components/AkiConduzco";
import { SharedAccount } from "@/components/SharedAccount";
import styles from "@/components/AkiConduzco.module.css";
export const metadata = {
  title: "Your account · AkiCoches",
  robots: { index: false, follow: false },
};
export default async function Settings({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const locale = conduzcoLocale((await headers()).get("x-akipasa-locale"));
  return (
    <div className={styles.app}>
      <ConduzcoHeader locale={locale} />
      <main>
        <SharedAccount
          locale={locale}
          product="AkiCoches"
          home={`/account?lang=${locale}`}
          membership={`/membership?lang=${locale}`}
          path="/settings"
          query={await searchParams}
        />
      </main>
    </div>
  );
}
