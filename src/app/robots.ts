import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isCanonicalCrawlHost } from "@/lib/public-crawl";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") || "";
  if (!isCanonicalCrawlHost(host))
    return { rules: { userAgent: "*", disallow: "/" } };

  const inventoryEnabled = process.env.AKICOCHES_INDEXING_ENABLED === "true";
  return {
    rules: {
      userAgent: "*",
      allow: inventoryEnabled
        ? "/"
        : [
            "/$",
            "/?lang=",
            "/membership$",
            "/membership?lang=",
            "/brand/",
            "/_next/",
            "/pwa/",
            "/icon.svg",
            "/favicon.ico",
            "/robots.txt",
            "/sitemap.xml",
          ],
      disallow: inventoryEnabled
        ? [
            "/api/",
            "/account",
            "/settings",
            "/bookings",
            "/en/auth",
            "/es/auth",
            "/en/terms/accept",
            "/es/terms/accept",
          ]
        : "/",
    },
    sitemap: "https://akicoches.com/sitemap.xml",
    host: "https://akicoches.com",
  };
}
