export const canonicalOrigin = "https://akicoches.com";
export function trustedProductOrigin(value: string) {
  try {
    const url = new URL(value);
    if (url.origin !== value || url.username || url.password) return false;
    if (
      url.origin === canonicalOrigin ||
      url.origin === "https://akiconduzco.akipasa.com"
    )
      return true;
    if (
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname)
    )
      return true;
    return (
      url.protocol === "https:" &&
      (process.env.AKISUITE_ALLOWED_PREVIEW_ORIGINS || "")
        .split(",")
        .map((x) => x.trim())
        .includes(value)
    );
  } catch {
    return false;
  }
}
export function publicRequestOrigin(
  headers: Headers,
  fallback = canonicalOrigin,
) {
  // Cloudflare terminates TLS. Never use browser Origin or forwarded host to construct auth callbacks.
  const host = headers.get("host") || "";
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const origin = `${local ? "http" : "https"}://${host}`;
  return trustedProductOrigin(origin)
    ? origin
    : trustedProductOrigin(fallback)
      ? fallback
      : canonicalOrigin;
}
