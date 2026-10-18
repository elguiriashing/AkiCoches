import { NextResponse, type NextRequest } from "next/server";
import { trustedProductOrigin } from "@/lib/public-request-origin";
import { refreshSession } from "@/lib/supabase/middleware";
import { stripCrossProductCredentials } from "@/lib/cross-product-query";
import {
  conduzcoHostMethodAllowed,
  conduzcoHostRoute,
} from "@/lib/akiconduzco-routing";
function crossProductRedirect(destination: URL) {
  stripCrossProductCredentials(destination);
  // Explicitly replace any source fragment, which the server cannot inspect.
  destination.hash = "redirected";
  const response = NextResponse.redirect(destination, 307);
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Cache-Control", "no-store");
  return response;
}
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const origin = `${/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? "http" : "https"}://${host}`;
  if (!trustedProductOrigin(origin))
    return new NextResponse(null, { status: 421 });
  request.headers.delete("x-akipasa-membership-next");
  request.headers.set("x-akipasa-product", "akiconduzco");
  const pathname = request.nextUrl.pathname;
  const lang =
    request.nextUrl.searchParams.get("lang") ||
    request.cookies.get("akiconduzco_locale")?.value;
  const locale = /^\/en(?:\/|$)/.test(pathname) || lang === "en" ? "en" : "es";
  request.headers.set("x-akipasa-locale", locale);
  const target = request.nextUrl.clone();
  if (/^\/(en|es)\/?$/.test(pathname)) {
    target.pathname = "/";
    target.searchParams.set("lang", locale);
    return NextResponse.redirect(target, 308);
  }
  // Pricing stays on AkiCoches; existing subscription management stays on AkiPasa.
  const productMembership = pathname.match(/^\/(?:(en|es)\/)?memberships?\/?$/);
  if (productMembership) {
    if (!["GET", "HEAD"].includes(request.method))
      return new NextResponse(null, { status: 404 });
    if (pathname !== "/membership") {
      target.pathname = "/membership";
      if (productMembership[1]) target.searchParams.set("lang", productMembership[1]);
      stripCrossProductCredentials(target);
      return NextResponse.redirect(target, 308);
    }
  }
  if (/^\/(?:(en|es)\/)?account\/(?:membership|memberships|subscription)\/?$/.test(pathname)) {
    if (!["GET", "HEAD"].includes(request.method))
      return new NextResponse(null, { status: 404 });
    const url = new URL(`/${locale}/account/subscription`, "https://akipasa.com");
    url.searchParams.set("from", "akicoches");
    return crossProductRedirect(url);
  }
  if (pathname === "/api/health")
    return request.method === "GET" || request.method === "HEAD"
      ? NextResponse.next()
      : new NextResponse(null, { status: 404 });
  if (!conduzcoHostMethodAllowed(pathname, request.method))
    return new NextResponse(null, { status: 404 });
  const route = conduzcoHostRoute(pathname);
  target.pathname = route.path;
  if (route.kind === "canonical") return NextResponse.redirect(target, 308);
  if (route.kind === "primary") {
    if (!["GET", "HEAD"].includes(request.method))
      return new NextResponse(null, { status: 404 });
    const business = /^\/(en|es)\/business(?:\/|$)/.test(pathname);
    const destination = new URL(
      business ? "https://akihq.app" : "https://akipasa.com",
    );
    destination.pathname = pathname;
    destination.search = request.nextUrl.search;
    return crossProductRedirect(destination);
  }
  if (route.kind === "reject") return new NextResponse(null, { status: 404 });
  const session = await refreshSession(request);
  const response = NextResponse.next({ request: { headers: request.headers } });
  session.cookies
    .getAll()
    .forEach(({ name, value, ...options }) =>
      response.cookies.set(name, value, options),
    );
  if (
    /^\/(account|bookings|en|es)(?:\/|$)/.test(pathname) ||
    process.env.AKICOCHES_INDEXING_ENABLED !== "true"
  )
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
