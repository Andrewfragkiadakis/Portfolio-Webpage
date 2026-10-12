#!/usr/bin/env node
/**
 * Initial JavaScript per prerendered page: every <script src="/_next/static/chunks/…"> in
 * .next/server/app/**\/*.html, gzipped at level 9 and summed. Fails above BUDGET_KIB.
 *
 *   npm run build && npm run size
 *   BUDGET_KIB=150 npm run size
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import { gzipSync } from 'node:zlib'

const BUDGET_KIB = Number(process.env.BUDGET_KIB ?? 215)
const appDir = '.next/server/app'
const staticDir = '.next'

if (!existsSync(appDir)) {
    console.error('No build found. Run `npm run build` first.')
    process.exit(1)
}

function htmlFiles(dir) {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name)
        if (statSync(path).isDirectory()) return htmlFiles(path)
        return name.endsWith('.html') && !name.startsWith('_') ? [path] : []
    })
}

let failed = false
for (const file of htmlFiles(appDir)) {
    const html = readFileSync(file, 'utf8')
    const chunks = [...new Set([...html.matchAll(/<script[^>]+src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)].map((m) => m[1]))]
    const kib = chunks.reduce((sum, src) => sum + gzipSync(readFileSync(join(staticDir, src.replace('/_next/', ''))), { level: 9 }).length, 0) / 1024
    const over = kib > BUDGET_KIB
    failed ||= over
    console.log(`${over ? '✗' : '✓'} ${relative(appDir, file).padEnd(28)} ${kib.toFixed(1).padStart(6)} KiB gzip in ${chunks.length} scripts (budget ${BUDGET_KIB})`)
}
process.exit(failed ? 1 : 0)
