import { createSupabasePublicClient } from "@/lib/supabase/public";
import { renderSitemap, type RentalSitemapEntry } from "@/lib/sitemap";

export const dynamic = "force-dynamic";

export async function GET() {
  const inventoryEnabled = process.env.AKICOCHES_INDEXING_ENABLED === "true";
  let rentals: RentalSitemapEntry[] = [];
  // The public site can be discovered without advertising unapproved inventory.
  // When inventory indexing is closed, no database request is necessary.
  if (inventoryEnabled) {
    try {
      const supabase = createSupabasePublicClient();
      const { data, error } = await supabase
        .from("car_rental_companies")
        .select("slug,updated_at,vehicles:car_rental_vehicles!inner(id)")
        .eq("status", "published")
        .eq("vehicles.active", true)
        .order("updated_at", { ascending: false })
        .limit(5_000);

      if (!error) {
        rentals = (data ?? []).flatMap((rental): RentalSitemapEntry[] =>
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
      }
    } catch {
      // Provider/configuration failure must not remove the static public entries.
    }
  }

  return new Response(renderSitemap(rentals, inventoryEnabled), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
