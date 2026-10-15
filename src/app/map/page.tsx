import { headers } from "next/headers";
import { conduzcoLocale } from "@/lib/akiconduzco-i18n";
import { config } from "@/lib/config";
import { ConduzcoMap } from "@/components/AkiConduzco";
import "maplibre-gl/dist/maplibre-gl.css";

export const metadata = {
  title: "Map · AkiCoches",
  alternates: { canonical: "https://akicoches.com/map" },
};

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    start?: string;
    end?: string;
  }>;
}) {
  const [requestHeaders, query] = await Promise.all([headers(), searchParams]);
  return (
    <ConduzcoMap
      locale={conduzcoLocale(requestHeaders.get("x-akipasa-locale"))}
      styleUrl={config.mapStyleUrl}
      initialQuery={query.q || ""}
      initialCategory={query.category || "all"}
      initialStart={query.start || ""}
      initialEnd={query.end || ""}
    />
  );
}
