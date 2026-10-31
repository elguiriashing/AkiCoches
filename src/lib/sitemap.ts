export type RentalSitemapEntry = {
  slug: string;
  updated_at: string | null;
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderSitemap(
  rentals: RentalSitemapEntry[],
  inventoryEnabled = false,
) {
  const staticUrls = inventoryEnabled
    ? ["/", "/map", "/membership"]
    : ["/", "/membership"];
  const urls = [
    ...staticUrls.map(
      (path) =>
        `<url><loc>${escapeXml(`https://akicoches.com${path}`)}</loc></url>`,
    ),
    ...(inventoryEnabled ? rentals : []).map(({ slug, updated_at: updatedAt }) => {
      const lastModified = updatedAt
        ? `<lastmod>${escapeXml(updatedAt)}</lastmod>`
        : "";
      return `<url><loc>${escapeXml(`https://akicoches.com/rentals/${encodeURIComponent(slug)}`)}</loc>${lastModified}</url>`;
    }),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
}
