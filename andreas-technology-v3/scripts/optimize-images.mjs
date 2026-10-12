#!/usr/bin/env node
/**
 * Re-encodes project screenshots as WebP next to the original, at most 2000 px wide
 * (the largest display is the 640 px stage at 3x, and next/image resizes from this), and
 * prints the saving. Point content at the .webp afterwards; originals are left in place.
 *
 *   node scripts/optimize-images.mjs public/images/foo/bar.png [more files…]
 *   node scripts/optimize-images.mjs --content     # every image src/data/content/en.ts uses
 */
import { readFileSync, statSync } from 'node:fs'
import sharp from 'sharp'

const MAX_WIDTH = 2000
const QUALITY = 88

let files = process.argv.slice(2)
if (files[0] === '--content') {
    const source = readFileSync('src/data/content/en.ts', 'utf8')
    files = [...new Set([...source.matchAll(/image: "([^"]+)"/g)].map((m) => `public${m[1]}`))].filter((f) => !f.endsWith('.webp'))
}
if (files.length === 0) {
    console.error('Usage: node scripts/optimize-images.mjs <image…> | --content')
    process.exit(1)
}

for (const file of files) {
    const out = file.replace(/\.(png|jpe?g)$/i, '.webp')
    const info = await sharp(file)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
        .toFile(out)
    const before = statSync(file).size / 1024
    const after = statSync(out).size / 1024
    console.log(`${file} → ${out}  ${info.width}×${info.height}  ${before.toFixed(0)} KB → ${after.toFixed(0)} KB`)
}
