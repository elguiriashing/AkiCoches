import test from "node:test";
import assert from "node:assert/strict";
import { redirectAutos } from "./akiautos-worker.mjs";

test("cutover remains disabled until the operator verifies the replacement", () => {
  const result = redirectAutos(
    new Request("https://akiautos.com/rentals/test"),
  );
  assert.equal(result.status, 503);
  assert.equal(result.headers.get("location"), null);
});

for (const path of [
  "/",
  "/map?lang=es",
  "/rentals/example?from=2027-01-01&guests=2",
  "/map?lang=es&q=M%C3%A1laga%20Toyota&search=automatic&start=2027-01-01&end=2027-01-04&utm_source=instagram&utm_campaign=coches",
  "/map?context=%2Fmap%3Flang%3Den%26search%3Delectric&start=2027-01-01&end=2027-01-04",
  "/map?filters=%7B%22city%22%3A%22M%C3%A1laga%22%2C%22category%22%3A%22electric%22%2C%22start%22%3A%222027-01-01%22%7D",
  "//evil.example/map?search=automatic",
  "/%2F%2Fevil.example?lang=en",
]) {
  test(`redirect preserves path/query with a fixed trusted origin: ${path}`, () => {
    const source = new URL(path, "https://akiautos.com");
    // Set pathname explicitly for the double-slash adversarial URL.
    if (path.startsWith("//")) {
      source.hostname = "akiautos.com";
      source.pathname = "//evil.example/map";
    }
    const result = redirectAutos(new Request(source), {
      CUTOVER_VERIFIED: "true",
    });
    assert.equal(result.status, 308);
    const target = new URL(result.headers.get("location"));
    assert.equal(target.origin, "https://akicoches.com");
    assert.equal(target.pathname, source.pathname);
    assert.equal(target.search, source.search);
    assert.equal(target.hash, "#redirected");
    assert.equal(result.headers.get("cache-control"), "no-store");
    assert.equal(result.headers.get("referrer-policy"), "no-referrer");
  });
}

test("HTTP and HEAD converge directly on the HTTPS canonical domain", () => {
  const result = redirectAutos(
    new Request("http://akiautos.com/map?lang=en", {
      method: "HEAD",
    }),
    { CUTOVER_VERIFIED: "true" },
  );
  assert.equal(result.status, 308);
  assert.equal(
    result.headers.get("location"),
    "https://akicoches.com/map?lang=en#redirected",
  );
});

for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
  test(`does not forward ${method} across roots`, () => {
    const response = redirectAutos(
      new Request("https://akiautos.com/api/bookings", {
        method,
      }),
      { CUTOVER_VERIFIED: "true" },
    );
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("location"), null);
  });
}

for (const suffix of [
  "/?next=/map?lang=en",
  "/en/auth/callback?code=private",
  "/oauth/callback",
  "/?access_token=private",
  "/?refresh_token=private",
  "/?ToKeN_HaSh=private",
  "/?code=private",
  "/?password=private",
  "/?state=private",
  "/?provider_token=private",
  "/?PROVIDER_REFRESH_TOKEN=private",
  "/?oauth_token=private",
  "/?oauth_token_secret=private",
  "/?authorization=private",
  "/?api_key=private",
  "/?ApiKey=private",
]) {
  test(`does not migrate credential-bearing authentication URL: ${suffix.split("?")[0]}`, () => {
    const response = redirectAutos(
      new Request("https://akiautos.com" + suffix),
      {
        CUTOVER_VERIFIED: "true",
      },
    );
    assert.equal(response.status, 400);
    assert.equal(response.headers.get("location"), null);
  });
}

test("canonical destination is never handled as a source, preventing loops", () => {
  assert.equal(
    redirectAutos(new Request("https://akicoches.com/map"), {
      CUTOVER_VERIFIED: "true",
    }).status,
    404,
  );
});

for (const suffix of [
  "/?next=code%3Dqa-dummy",
  "/?next=code%253Dqa-dummy",
  "/?next=/en/auth/callback?code=qa-dummy",
  "/?next=%2Fen%2Fauth%2Fcallback%3Fcode%3Dqa-dummy",
  "/?next=%252Fen%252Fauth%252Fcallback%253Fcode%253Dqa-dummy",
  "/?next=%2Fmap%3FreturnTo%3D%252Fmap%253FACCESS_TOKEN%253Dqa-dummy",
  "/?next=/map?returnTo=code=qa-dummy",
  "/?next=/map%23refresh_token%3Dqa-dummy",
  "/?search=%3Fclient_secret%3Dqa-dummy",
  "/?next=https%3A%2F%2Fuser%3Aqa-dummy%40example.test%2Fmap",
  "/?next=%2Fmap%3Fprovider_token%5B%5D%3Dqa-dummy",
  "/?%2563%256f%2564%2565=qa-dummy",
  "/?%252563%25256f%252564%252565=qa-dummy",
  "/?%2563%256f%2564%2565",
  "/en/%61uth/callback",
  "/en/%2561uth/callback",
  "/?next=%5Cen%5Cauth%5Ccallback%3Fcode%3Dqa-dummy",
  "/?next=%E0%A4%A",
  "/?next=%00code%3Dqa-dummy",
  "/?context=%7B%22code%22%3A%22qa-dummy%22%7D",
  "/?context=%7B%22%5Cu0063ode%22%3A%22qa-dummy%22%7D",
  "/?context=%7B%22safe%22%3A%22%5Cu0063ode%3Dqa-dummy%22%7D",
  "/?context=%20https%3A%2F%2Fuser%3Aqa-dummy%40example.test%2Fmap",
  "/?context=%22https%3A%2F%2Fuser%3Aqa-dummy%40example.test%2Fmap%22",
  "/?context=ftp%3A%2F%2Fuser%3Aqa-dummy%40example.test%2Fmap",
  "/?code[0]=qa-dummy",
  "/?context=safe.refresh_token%3Dqa-dummy",
  "/?context=safe%5Baccess_token%5D%3Dqa-dummy",
  "/?context=%7B%22code%22%3Aqa-dummy%7D",
  "/?context=%7B%22a%22%3A%7B%22b%22%3A%7B%22c%22%3A%7B%22d%22%3A%7B%22e%22%3A%22safe%22%7D%7D%7D%7D%7D",
  "/?context=%ZZ",
  "/?context=stray%",
]) {
  test(`rejects nested or encoded credential inputs: ${suffix}`, () => {
    const response = redirectAutos(
      new Request("https://akiautos.com" + suffix),
      {
        CUTOVER_VERIFIED: "true",
      },
    );
    assert.equal(response.status, 400);
    assert.equal(response.headers.get("location"), null);
  });
}

test("bounded decoding rejects excessive encoding even for a harmless destination", () => {
  let nested = "/map?lang=en";
  for (let depth = 0; depth < 8; depth++) nested = encodeURIComponent(nested);
  const source = new URL("https://akiautos.com/map");
  source.searchParams.set("next", nested);
  const response = redirectAutos(new Request(source), {
    CUTOVER_VERIFIED: "true",
  });
  assert.equal(response.status, 400);
  assert.equal(response.headers.get("location"), null);
});

test("bounds the total URL and query field work before attempting a redirect", () => {
  for (const source of [
    `https://akiautos.com/map?search=${"a".repeat(8192)}`,
    `https://akiautos.com/map?${new URLSearchParams(
      Array.from({ length: 65 }, (_, index) => [`q${index}`, "safe"]),
    )}`,
  ]) {
    const response = redirectAutos(new Request(source), {
      CUTOVER_VERIFIED: "true",
    });
    assert.equal(response.status, 400);
    assert.equal(response.headers.get("location"), null);
  }
});
