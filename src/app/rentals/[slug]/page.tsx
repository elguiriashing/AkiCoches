import { createSupabaseServerClient } from "@/lib/supabase/server";
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
    .select(
      "id,name,city,address,description_es,description_en,phone,website_url,latitude,longitude,logo_media_id,hero_media_id",
    )
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
  // Published company records without a live fleet are not public discovery
  // pages. This keeps test/draft branches out even when their slug is known.
  if (error || listings.length === 0) notFound();
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
  const authClient = await createSupabaseServerClient();
  const { data: auth } = await authClient.auth.getUser();
  const branchMedia: Record<string, string> = {};
  for (const id of [company.logo_media_id, company.hero_media_id].filter(
    Boolean,
  )) {
    const { data: row } = await supabase
      .from("car_rental_media")
      .select("storage_path,storage_bucket")
      .eq("id", id)
      .eq("company_id", company.id)
      .maybeSingle();
    if (row) {
      const { data: signed } = await supabase.storage
        .from(row.storage_bucket)
        .createSignedUrl(row.storage_path, 3600);
      if (signed?.signedUrl) branchMedia[id] = signed.signedUrl;
    }
  }
  return (
    <RentalDetail
      accountEmail={auth.user?.email || ""}
      company={{
        ...company,
        logo_url: branchMedia[company.logo_media_id],
        hero_url: branchMedia[company.hero_media_id],
      }}
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
