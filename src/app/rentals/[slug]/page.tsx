import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { RentalDetail } from "@/components/AkiConduzco";
import { conduzcoLocale } from "@/lib/akiconduzco-i18n";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { validDate, type RentalListing } from "@/lib/akiconduzco";
import { withRentalCovers } from "@/lib/rental-covers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Rental cars · ${slug.replaceAll("-", " ")} · AkiCoches`,
    alternates: {
      canonical: `https://akicoches.com/rentals/${encodeURIComponent(slug)}`,
    },
  };
}

export default async function RentalCompanyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ start?: string; end?: string; vehicle?: string }>;
}) {
  const [{ slug }, query, requestHeaders] = await Promise.all([
    params,
    searchParams,
    headers(),
  ]);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  const supabase = createSupabasePublicClient();
  const { data: company } = await supabase
    .from("car_rental_companies")
    .select("id,name,city,address")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!company) notFound();
  const { data, error } = await supabase.rpc("search_car_rentals", {
    p_q: company.name,
    p_city: company.city,
    p_category: null,
    p_start: null,
    p_end: null,
    p_min_price: null,
    p_max_price: null,
    p_bounds: null,
    p_limit: 100,
    p_offset: 0,
  });
  const listings = ((data || []) as RentalListing[]).filter(
    (row) => row.company_id === company.id,
  );
  const picturedListings = await withRentalCovers(supabase, listings);
  const today = new Date().toISOString().slice(0, 10);
  const {
    data: blocks,
    error: calendarError,
    count,
  } = listings.length
    ? await supabase
        .from("car_rental_calendar_blocks")
        .select("vehicle_id,start_date,end_date", { count: "exact" })
        .in(
          "vehicle_id",
          listings.map((row) => row.vehicle_id),
        )
        .gte("end_date", today)
        .order("start_date")
        .limit(1000)
    : { data: [], error: null, count: 0 };
  return (
    <RentalDetail
      company={company}
      blocks={blocks || []}
      calendarReady={
        !calendarError && count !== null && count <= (blocks?.length || 0)
      }
      locale={conduzcoLocale(requestHeaders.get("x-akipasa-locale"))}
      slug={slug}
      listings={picturedListings}
      error={Boolean(error)}
      requestedVehicle={query.vehicle}
      initialStart={validDate.safeParse(query.start).success ? query.start : ""}
      initialEnd={validDate.safeParse(query.end).success ? query.end : ""}
    />
  );
}
