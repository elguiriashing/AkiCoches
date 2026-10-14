import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow:
        process.env.AKICOCHES_INDEXING_ENABLED === "true"
          ? ["/api/", "/account", "/bookings", "/en/auth", "/es/auth"]
          : "/",
    },
    sitemap: "https://akicoches.com/sitemap.xml",
    host: "https://akicoches.com",
  };
}
