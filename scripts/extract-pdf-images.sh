#!/usr/bin/env bash
# Extract images from a PDF, dedupe by MD5, then run process-images.mjs to
# produce web-ready JPEGs in src/projects/<slug>/images/.
#
# Usage: scripts/extract-pdf-images.sh <pdf-path> <slug>

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <pdf-path> <slug>" >&2
  exit 1
fi

PDF="$1"
SLUG="$2"

if [[ ! -f "$PDF" ]]; then
  echo "PDF not found: $PDF" >&2
  exit 1
fi

WORK="$(mktemp -d -t raive-pdf-XXXXXX)"
RAW="$WORK/raw"
UNIQUE="$WORK/unique"
mkdir -p "$RAW" "$UNIQUE"

echo "Extracting images from $PDF → $RAW"
pdfimages -j "$PDF" "$RAW/img"

echo "Deduplicating by content hash"
# Compute "hash  path" for every file, sort, then keep the first file per hash.
# Compatible with macOS's stock bash 3.2 (no associative arrays).
last_hash=""
while IFS=$'\t' read -r hash file; do
  if [[ "$hash" != "$last_hash" ]]; then
    cp "$file" "$UNIQUE/$(basename "$file")"
    last_hash="$hash"
  fi
done < <(for f in "$RAW"/*; do printf '%s\t%s\n' "$(md5 -q "$f")" "$f"; done | sort)

count=$(find "$UNIQUE" -type f | wc -l | tr -d ' ')
echo "Unique images: $count"

echo "Resizing → src/projects/$SLUG/images/"
node scripts/process-images.mjs "$UNIQUE" --slug="$SLUG"

echo "Cleaning up $WORK"
rm -rf "$WORK"
