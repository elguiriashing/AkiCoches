/** Keep search discovery independent from private sessions and preview hosts. */
export const canonicalCrawlHost = "akicoches.com";

export function isCanonicalCrawlHost(host: string) {
  return host.toLowerCase() === canonicalCrawlHost;
}

export function isCrawlerMetadata(pathname: string) {
  return pathname === "/robots.txt" || pathname === "/sitemap.xml";
}

export function isPublicCrawlPage(pathname: string, inventoryEnabled = false) {
  if (pathname === "/" || pathname === "/membership") return true;
  return (
    inventoryEnabled &&
    (pathname === "/map" || /^\/rentals\/[a-z0-9-]+\/?$/.test(pathname))
  );
}
