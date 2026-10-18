export const conduzcoOrigin = "https://akicoches.com";
export const conduzcoMemberPaths = ["/map", "/account", "/bookings"];

export function safeConduzcoDestination(requested?: string) {
  if (!requested || requested.startsWith("//") || /[\\\r\n]/.test(requested))
    return "/account";
  try {
    const url = new URL(requested, conduzcoOrigin);
    if (url.origin !== conduzcoOrigin) return "/account";
    if (
      conduzcoMemberPaths.includes(url.pathname) ||
      /^\/rentals\/[a-z0-9-]+\/?$/.test(url.pathname) ||
      /^\/(en|es)\/auth\/recover\/?$/.test(url.pathname)
    )
      return `${url.pathname}${url.search}`;
  } catch {}
  return "/account";
}

export function conduzcoHostRoute(pathname: string) {
  if (pathname === "/akiconduzco")
    return { kind: "canonical" as const, path: "/" };
  if (pathname === "/") return { kind: "public" as const, path: "/" };
  if (pathname === "/membership")
    return { kind: "public" as const, path: pathname };
  if (
    pathname === "/map" ||
    pathname === "/account" ||
    pathname === "/bookings" ||
    /^\/rentals\/[a-z0-9-]+\/?$/.test(pathname)
  )
    return { kind: "public" as const, path: pathname };
  if (pathname.startsWith("/akiconduzco/"))
    return {
      kind: "canonical" as const,
      path: pathname.slice("/akiconduzco".length),
    };
  if (
    /^\/(en|es)\/auth(?:\/|$)/.test(pathname) ||
    /^\/(en|es)\/(terms|privacy)(?:\/accept)?\/?$/.test(pathname)
  )
    return { kind: "public" as const, path: pathname };
  if (
    [
      "/manifest.webmanifest",
      "/sw.js",
      "/offline.html",
      "/robots.txt",
      "/sitemap.xml",
    ].includes(pathname) ||
    pathname.startsWith("/sitemaps/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/pwa/") ||
    pathname.startsWith("/brand/") ||
    pathname === "/icon.svg" ||
    pathname === "/favicon.ico" ||
    ["/api/car-rentals", "/api/car-rentals/bookings"].includes(pathname) ||
    pathname === "/api/v1/personalisation/consent"
  )
    return { kind: "public" as const, path: pathname };
  if (pathname.startsWith("/api/"))
    return { kind: "reject" as const, path: pathname };
  return { kind: "primary" as const, path: pathname };
}

export function conduzcoHostMethodAllowed(pathname: string, method: string) {
  return (
    ["GET", "HEAD"].includes(method) ||
    (method === "POST" &&
      (pathname === "/account" ||
        pathname === "/api/car-rentals/bookings" ||
        pathname === "/api/v1/personalisation/consent" ||
        /^\/(en|es)\/auth(?:\/|$)/.test(pathname) ||
        /^\/(en|es)\/terms\/accept\/?$/.test(pathname)))
  );
}
export function conduzcoLanguageUrl(href: string, locale: "en" | "es") {
  const url = new URL(href);
  // Auth/legal pages use a localized pathname; its locale takes precedence over
  // the query used by unprefixed rental pages.
  url.pathname = url.pathname.replace(/^\/(?:en|es)(?=\/|$)/, `/${locale}`);
  url.searchParams.set("lang", locale);
  return url.toString();
}
