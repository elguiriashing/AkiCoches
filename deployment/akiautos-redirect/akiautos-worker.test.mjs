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
  "//evil.example/map?next=https%3A%2F%2Fevil.example",
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
  "/en/auth/callback?code=private",
  "/oauth/callback",
  "/?access_token=private",
  "/?refresh_token=private",
  "/?ToKeN_HaSh=private",
  "/?code=private",
  "/?password=private",
  "/?state=private",
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
