import type { RentalListing } from "@/lib/akiconduzco";
import { createSupabasePublicClient } from "@/lib/supabase/public";

// Only vehicles returned by the published catalogue are considered. The
// anonymous client can sign media only where independent branch/storage RLS permits.
export async function withRentalCovers(
  supabase: ReturnType<typeof createSupabasePublicClient>,
  listings: RentalListing[],
): Promise<RentalListing[]> {
  if (!listings.length) return listings;
  const { data: vehicles, error: vehicleError } = await supabase
    .from("car_rental_vehicles")
    .select("id,rental_media_id")
    .in(
      "id",
      listings.map((item) => item.vehicle_id),
    );
  if (vehicleError || !vehicles?.length) return listings;
  const coverByVehicle = new Map(
    vehicles
      .filter((item) => item.rental_media_id)
      .map((item) => [item.id, item.rental_media_id]),
  );
  const coverIds = [...new Set(coverByVehicle.values())] as string[];
  if (!coverIds.length) return listings;
  const { data: media, error: mediaError } = await supabase
    .from("car_rental_media")
    .select("id,storage_path,storage_bucket")
    .in("id", coverIds);
  if (mediaError || !media?.length) return listings;
  const urlByMedia = new Map<string, string>();
  for (const bucket of ["rental-media", "event-media"]) {
    const rows = media.filter((item) => item.storage_bucket === bucket);
    const paths = [...new Set(rows.map((item) => item.storage_path))];
    if (!paths.length) continue;
    const { data: signed } = await supabase.storage
      .from(bucket)
      .createSignedUrls(paths, 3600);
    for (const row of rows) {
      const url = signed?.find(
        (item) => item.path === row.storage_path && !item.error,
      )?.signedUrl;
      if (url) urlByMedia.set(row.id, url);
    }
  }
  return listings.map((item) => ({
    ...item,
    image_url:
      urlByMedia.get(coverByVehicle.get(item.vehicle_id) || "") ||
      item.image_url,
  }));
}
