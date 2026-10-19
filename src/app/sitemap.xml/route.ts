import { createSupabasePublicClient } from "@/lib/supabase/public";
import { renderSitemap, type RentalSitemapEntry } from "@/lib/sitemap";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("car_rental_companies")
    .select("slug,updated_at,vehicles:car_rental_vehicles!inner(id)")
    .eq("status", "published")
    .eq("vehicles.status", "active")
    .order("updated_at", { ascending: false })
    .limit(5_000);

  const rentals = error
    ? []
    : (data ?? []).flatMap((rental): RentalSitemapEntry[] =>
        typeof rental.slug === "string" && rental.slug.length > 0
          ? [
              {
                slug: rental.slug,
                updated_at:
                  typeof rental.updated_at === "string"
                    ? rental.updated_at
                    : null,
              },
            ]
          : [],
      );

  return new Response(renderSitemap(rentals), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "Content-Type": "application/xml",
    },
  });
}
