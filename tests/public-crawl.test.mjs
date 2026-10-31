import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { isCanonicalCrawlHost, isCrawlerMetadata, isPublicCrawlPage } from "../src/lib/public-crawl.ts";

test("canonical host only, never previews or deceptive suffixes", () => {
  assert.equal(isCanonicalCrawlHost("akicoches.com"), true);
  assert.equal(isCanonicalCrawlHost("AKICOCHES.COM"), true);
  for (const host of ["localhost:3103", "preview.workers.dev", "akicoches.com.evil.example", "evil-akicoches.com", "www.akicoches.com"])
    assert.equal(isCanonicalCrawlHost(host), false, host);
});

test("only crawler metadata may bypass session refresh", () => {
  for (const path of ["/robots.txt", "/sitemap.xml"])
    assert.equal(isCrawlerMetadata(path), true);
  for (const path of ["/api/health", "/api/bookings", "/account", "/en/auth/callback", "/sitemap.xml/private", "/robots.txt/../account"])
    assert.equal(isCrawlerMetadata(path), false, path);
});

test("public marketing pages are discoverable", () => {
  for (const path of ["/", "/membership"])
    assert.equal(isPublicCrawlPage(path), true, path);
});

test("private and unknown routes remain noindex", () => {
  for (const path of ["/account", "/settings", "/bookings", "/saved", "/en/auth", "/es/auth/callback", "/en/terms/accept", "/api/car-rentals", "/api/stays", "/unknown", "/offline.html"])
    assert.equal(isPublicCrawlPage(path, true), false, path);
});

test("unapproved rental inventory remains gated", () => {
  for (const path of ["/map", "/rentals/published-branch"]) {
    assert.equal(isPublicCrawlPage(path), false);
    assert.equal(isPublicCrawlPage(path, false), false);
    assert.equal(isPublicCrawlPage(path, true), true);
  }
  for (const path of ["/rentals/", "/rentals/branch/private", "/rentals/a%2Fb"])
    assert.equal(isPublicCrawlPage(path, true), false);
});

test("favicon uses a valid square 48px ICO container", () => {
  const icon = readFileSync(new URL("../public/favicon.ico", import.meta.url));
  assert.equal(icon.readUInt16LE(0), 0);
  assert.equal(icon.readUInt16LE(2), 1);
  assert.equal(icon.readUInt16LE(4), 1);
  assert.equal(icon[6], 48);
  assert.equal(icon[7], 48);
  assert.equal(icon.readUInt32LE(14) + icon.readUInt32LE(18), icon.length);
});
