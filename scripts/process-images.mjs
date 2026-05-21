#!/usr/bin/env node
// Resize JPEGs into web-ready versions, max 2000px longest edge, ~82% quality.
// Usage: node scripts/process-images.mjs <source-dir> [--slug=<slug>] [--dest=<dest>]
// Default dest: src/projects/<slug>/images/

import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const MAX_EDGE = 2000;
const QUALITY = 82;
const EXT_IN = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);

function parseArgs(argv) {
  const args = { src: null, slug: null, dest: null };
  for (const a of argv.slice(2)) {
    if (a.startsWith("--slug=")) args.slug = a.slice(7);
    else if (a.startsWith("--dest=")) args.dest = a.slice(7);
    else if (!args.src) args.src = a;
  }
  return args;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function processDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  let processed = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!EXT_IN.has(ext)) continue;

    const outName = slugify(entry.name) + ".jpg";
    const outPath = path.join(dest, outName);

    try {
      await fs.access(outPath);
      skipped += 1;
      continue;
    } catch {}

    const inputPath = path.join(src, entry.name);
    try {
      await sharp(inputPath)
        .rotate()
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
        .withMetadata({ orientation: undefined })
        .toFile(outPath);
    } catch (err) {
      console.warn(`  ! ${entry.name}: ${err.message.split("\n")[0]}`);
      continue;
    }

    const stat = await fs.stat(outPath);
    console.log(`  ✓ ${entry.name} → ${outName} (${(stat.size / 1024).toFixed(0)} KB)`);
    processed += 1;
  }

  console.log(`Done. ${processed} processed, ${skipped} skipped.`);
}

const args = parseArgs(process.argv);
if (!args.src) {
  console.error("Usage: node scripts/process-images.mjs <source-dir> [--slug=<slug>] [--dest=<dest>]");
  process.exit(1);
}

const src = path.resolve(args.src);
const slug = args.slug ?? path.basename(src.replace(/\/+$/, ""));
const dest = path.resolve(args.dest ?? path.join("src/projects", slug, "images"));

console.log(`Source: ${src}`);
console.log(`Dest:   ${dest}`);
await processDir(src, dest);
