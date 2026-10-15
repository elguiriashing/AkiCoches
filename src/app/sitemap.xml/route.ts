export function GET() {
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://akicoches.com/</loc></url><url><loc>https://akicoches.com/map</loc></url></urlset>',
    { headers: { "Content-Type": "application/xml" } },
  );
}
