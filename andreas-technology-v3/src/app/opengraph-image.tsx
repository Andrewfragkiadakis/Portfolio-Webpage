import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const alt = 'Andreas Fragkiadakis — Apple fleets. Automated.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const NAME = 'Andreas Fragkiadakis'
const HEADLINE = 'Apple fleets. Automated.'
const SUB = 'Team Lead, Apple Fleet & IT Automation · Jamf 200 · 550+ Macs'

/**
 * Inter SemiBold, subset to the characters on the card. Fetched at build time; if the
 * network is unavailable the card still renders in the default font.
 */
async function loadInter(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Inter:wght@600&text=${encodeURIComponent(text)}`)).text()
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1]
    if (!url) return null
    const res = await fetch(url)
    return res.ok ? await res.arrayBuffer() : null
  } catch {
    return null
  }
}

/** Social card in the site's apple.com style: white, the memoji mark, one headline. */
export default async function Image() {
  const mark = await readFile(join(process.cwd(), 'public/favicons/android-chrome-512x512.png'))
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`
  const inter = await loadInter(NAME + HEADLINE + SUB)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: inter ? 'Inter' : undefined,
        }}
      >
        <img src={markSrc} width={168} height={168} alt="" />
        <div style={{ marginTop: 18, fontSize: 34, fontWeight: 600, color: '#1d1d1f', letterSpacing: '0.004em' }}>{NAME}</div>
        <div style={{ marginTop: 10, fontSize: 92, fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.02em', lineHeight: 1.05 }}>{HEADLINE}</div>
        <div style={{ marginTop: 26, fontSize: 28, fontWeight: 600, color: '#6e6e73', letterSpacing: '0.004em' }}>{SUB}</div>
      </div>
    ),
    {
      ...size,
      fonts: inter ? [{ name: 'Inter', data: inter, weight: 600, style: 'normal' }] : undefined,
    }
  )
}
