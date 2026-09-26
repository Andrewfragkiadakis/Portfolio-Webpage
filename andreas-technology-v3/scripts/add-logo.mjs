#!/usr/bin/env node
/**
 * Writes official brand logos from Simple Icons (https://simpleicons.org) into
 * public/logos/<slug>.svg and prints the `logo`, `ratio` and `brand` values to
 * paste into src/data/tools.ts.
 *
 *   node scripts/add-logo.mjs python swift claude
 *
 * Simple Icons draws every logo on a square 24×24 canvas. For a wordmark (e.g. macOS,
 * VMware) that leaves most of the box empty: tighten the file's viewBox to the drawn
 * bounds (svgElement.getBBox() in a browser console) and set `ratio` to width ÷ height.
 *
 * Brands that Simple Icons does not carry (Jamf, Microsoft, Slack, Duo, Check Point)
 * live in public/logos as files taken from each vendor's own brand/press kit.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as icons from 'simple-icons'

const slugs = process.argv.slice(2)
if (slugs.length === 0) {
    console.error('Usage: node scripts/add-logo.mjs <slug> [slug...]  (slugs from simpleicons.org)')
    process.exit(1)
}

const bySlug = new Map(Object.values(icons).filter((i) => i?.slug).map((i) => [i.slug, i]))
const outDir = fileURLToPath(new URL('../public/logos/', import.meta.url))
mkdirSync(outDir, { recursive: true })

let failed = false
for (const slug of slugs) {
    const icon = bySlug.get(slug)
    if (!icon) {
        console.error(`✗ ${slug}: not in Simple Icons — use the vendor's brand kit instead`)
        failed = true
        continue
    }
    writeFileSync(
        `${outDir}${slug}.svg`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>${icon.title}</title><path fill="#${icon.hex}" d="${icon.path}"/></svg>\n`,
    )
    console.log(`✓ ${icon.title}: logo: '${slug}', ratio: 1, brand: '#${icon.hex}'`)
}
process.exit(failed ? 1 : 0)
