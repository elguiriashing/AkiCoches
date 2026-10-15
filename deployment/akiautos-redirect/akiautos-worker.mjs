const SOURCE_HOST = "akiautos.com";
const TARGET_ORIGIN = "https://akicoches.com";
const credentialNames = new Set([
  "code",
  "token",
  "token_hash",
  "access_token",
  "refresh_token",
  "id_token",
  "provider_token",
  "provider_refresh_token",
  "oauth_token",
  "oauth_token_secret",
  "authorization",
  "api_key",
  "apikey",
  "client_secret",
  "password",
  "state",
  "error_description",
]);

export function redirectAutos(request, env = {}) {
  const url = new URL(request.url);
  const headers = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };
  if (url.hostname !== SOURCE_HOST) {
    return new Response("Unknown hostname", { status: 404, headers });
  }
  // Do not replay form submissions or credentials to a different root domain.
  if (!["GET", "HEAD"].includes(request.method)) {
    return new Response("Method not allowed", {
      status: 405,
      headers: { ...headers, Allow: "GET, HEAD" },
    });
  }
  if (
    /\/(?:auth|oauth)(?:\/|$)/i.test(url.pathname) ||
    [...url.searchParams.keys()].some((key) =>
      credentialNames.has(key.toLowerCase()),
    )
  ) {
    return new Response(
      "Start authentication directly at https://akicoches.com",
      {
        status: 400,
        headers,
      },
    );
  }
  // The operator enables this only after the independent app and TLS pass.
  if (env.CUTOVER_VERIFIED !== "true") {
    return new Response("Domain migration is not enabled", {
      status: 503,
      headers,
    });
  }
  // Assign components explicitly: a path beginning // must never change origin.
  const destination = new URL(TARGET_ORIGIN);
  destination.pathname = url.pathname;
  destination.search = url.search;
  // Browsers otherwise inherit a source fragment that the Worker cannot read.
  destination.hash = "redirected";
  return new Response(null, {
    status: 308,
    headers: { ...headers, Location: destination.href },
  });
}

const worker = { fetch: redirectAutos };
export default worker;
