// Generate raster PWA and Apple icons from the canonical SVG artwork.
// Runs before local dev, Next build and Cloudflare build so no stale car icons ship.
import { readFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const brand = resolve(root, "public/brand");
const normal = await readFile(resolve(brand, "conduzco-icon.svg"));
const maskable = await readFile(resolve(brand, "conduzco-maskable.svg"));
const targets = [
  ...[180, 192, 512].map((size) => [normal, size, `public/brand/conduzco-v2-${size}.png`]),
  ...[192, 512].map((size) => [maskable, size, `public/brand/conduzco-v2-maskable-${size}.png`]),
];
for (const [source, size, path] of targets) {
  const target = resolve(root, path);
  await mkdir(dirname(target), { recursive: true });
  await sharp(source).resize(size, size).png().toFile(target);
}
