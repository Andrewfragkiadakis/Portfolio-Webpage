import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Andreas Fragkiadakis — M.Eng. Computer Engineer, IT & Security'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Swiss Cobalt: the hero's 40/60 split, name broken across the seam.
// Round 5 palette (globals.css): calm cobalt, off-white paper, blue-black ink.
const COBALT = '#2d3fbf'
const PAPER = '#faf9f6'
const INK = '#14161b'
const RULE_ON_COBALT = 'rgba(250,249,246,0.8)'
const RULE_ON_PAPER = 'rgba(20,22,27,0.8)'

const META = { fontSize: 18, letterSpacing: '0.06em', textTransform: 'uppercase' as const }

export default async function Image() {
  // The logo is the technologist memoji (the favicon), embedded so the card needs no fetch.
  const memoji = await readFile(join(process.cwd(), 'public/favicons/android-chrome-512x512.png'))
  const memojiSrc = `data:image/png;base64,${memoji.toString('base64')}`

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: PAPER, color: INK }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 480, height: 630, background: COBALT, display: 'flex' }} />

        {/* Meta rows on strong hairlines, as on every panel. */}
        <div style={{ ...META, position: 'absolute', left: 40, right: 760, top: 40, display: 'flex', justifyContent: 'space-between', borderTop: `2px solid ${RULE_ON_COBALT}`, paddingTop: 12, color: PAPER }}>
          <span>(00)</span>
          <span>andreas.technology</span>
        </div>
        <div style={{ ...META, position: 'absolute', left: 520, right: 40, top: 40, display: 'flex', justifyContent: 'space-between', borderTop: `2px solid ${RULE_ON_PAPER}`, paddingTop: 12 }}>
          <span>IT & Security Engineer</span>
          <span>Athens, GR</span>
        </div>

        {/* The memoji on a paper square: the logo on a cobalt field. */}
        <div style={{ position: 'absolute', left: 40, top: 100, width: 112, height: 112, background: PAPER, display: 'flex', overflow: 'hidden' }}>
          <img src={memojiSrc} alt="Andreas Fragkiadakis" width={120} height={120} style={{ position: 'absolute', left: -4, top: -2 }} />
        </div>

        {/* One line of type broken across the seam, as in the hero. */}
        <div style={{ position: 'absolute', right: 1200 - 440, top: 262, fontSize: 84, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1, color: PAPER }}>ANDREAS</div>
        <div style={{ position: 'absolute', left: 520, top: 262, fontSize: 84, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1, color: COBALT }}>FRAGKIADAKIS</div>
        <div style={{ position: 'absolute', left: 520, top: 370, fontSize: 52, fontWeight: 700, letterSpacing: '-0.04em' }}>Automate. Secure. Scale.</div>

        <div style={{ ...META, position: 'absolute', left: 40, bottom: 40, color: PAPER }}>Jamf 200 · 550+ Macs</div>
        <div style={{ ...META, position: 'absolute', left: 520, bottom: 40 }}>Apple Fleet & IT Automation Lead · M.Eng.</div>
      </div>
    ),
    { ...size }
  )
}
