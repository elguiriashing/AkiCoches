import { notFound } from "next/navigation";
import { isLocale } from "@/lib/config";
import { LocaleDocumentLanguage } from "@/components/LocaleDocumentLanguage";
import { ConduzcoHeader } from "@/components/AkiConduzco";
import "../stay-auth.css";
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <LocaleDocumentLanguage locale={locale} />
      <ConduzcoHeader locale={locale} />
      {children}
    </>
  );
}
