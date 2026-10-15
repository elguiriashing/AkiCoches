import type { RentalListing } from "@/lib/akiconduzco";
import { createSupabasePublicClient } from "@/lib/supabase/public";

// Only vehicles returned by the published catalogue are considered. The
// anonymous client can sign media only where existing venue/storage RLS permits.
export async function withRentalCovers(
  supabase: ReturnType<typeof createSupabasePublicClient>,
  listings: RentalListing[],
): Promise<RentalListing[]> {
  if (!listings.length) return listings;
  const { data: vehicles, error: vehicleError } = await supabase
    .from("car_rental_vehicles")
    .select("id,cover_media_id")
    .in(
      "id",
      listings.map((item) => item.vehicle_id),
    );
  if (vehicleError || !vehicles?.length) return listings;
  const coverByVehicle = new Map(
    vehicles
      .filter((item) => item.cover_media_id)
      .map((item) => [item.id, item.cover_media_id]),
  );
  const coverIds = [...new Set(coverByVehicle.values())] as string[];
  if (!coverIds.length) return listings;
  const { data: media, error: mediaError } = await supabase
    .from("venue_media")
    .select("id,storage_path")
    .in("id", coverIds);
  if (mediaError || !media?.length) return listings;
  const paths = [...new Set(media.map((item) => item.storage_path))];
  const { data: signed } = await supabase.storage
    .from("event-media")
    .createSignedUrls(paths, 3600);
  const signedByPath = new Map(
    (signed || []).flatMap((item) =>
      item.path && paths.includes(item.path) && !item.error && item.signedUrl
        ? [[item.path, item.signedUrl] as const]
        : [],
    ),
  );
  const urlByMedia = new Map(
    media.map((item) => [item.id, signedByPath.get(item.storage_path)]),
  );
  return listings.map((item) => ({
    ...item,
    image_url:
      urlByMedia.get(coverByVehicle.get(item.vehicle_id) || "") ||
      item.image_url,
  }));
}
