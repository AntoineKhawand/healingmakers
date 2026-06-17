/**
 * Extracts the largest embedded raster image from each product SVG
 * and converts it to a compressed WebP file.
 *
 * Run: node scripts/convert-svgs-to-webp.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(__dirname, "../public/products");

function extractLargestEmbeddedImage(svgContent) {
  // Match all data URI image embeds — pick the largest one (product photo, not thumbnail)
  const regex = /xlink:href="data:(image\/(?:png|jpeg|jpg|webp));base64,([^"]+)"/g;
  let best = null;
  let match;
  while ((match = regex.exec(svgContent)) !== null) {
    const [, mimeType, b64] = match;
    if (!best || b64.length > best.b64.length) {
      best = { mimeType, b64 };
    }
  }
  return best;
}

async function convertSvg(svgPath) {
  const svgContent = fs.readFileSync(svgPath, "utf8");
  const embedded = extractLargestEmbeddedImage(svgContent);

  if (!embedded) {
    console.warn(`  ⚠ No embedded image found: ${path.basename(svgPath)}`);
    return false;
  }

  const buffer = Buffer.from(embedded.b64, "base64");
  const outPath = svgPath.replace(/\.svg$/, ".webp");

  await sharp(buffer)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outPath);

  const origKB = Math.round(fs.statSync(svgPath).size / 1024);
  const newKB = Math.round(fs.statSync(outPath).size / 1024);
  console.log(
    `  ✓ ${path.basename(svgPath)} → .webp  ${origKB}KB → ${newKB}KB (${Math.round((1 - newKB / origKB) * 100)}% smaller)`
  );
  return true;
}

async function main() {
  const svgFiles = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".svg") && !f.startsWith("_"));
  console.log(`\nConverting ${svgFiles.length} product SVGs to WebP...\n`);

  let converted = 0;
  for (const file of svgFiles) {
    const ok = await convertSvg(path.join(PRODUCTS_DIR, file));
    if (ok) converted++;
  }

  console.log(`\nDone. Converted ${converted}/${svgFiles.length} files.\n`);
}

main().catch(console.error);
