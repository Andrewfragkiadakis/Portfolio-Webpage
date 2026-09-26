import { ImageResponse } from 'next/og'

export const alt = 'Andreas Fragkiadakis — M.Eng. Computer Engineer, IT & Security'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Swiss editorial palette (see globals.css).
const PAPER = '#F2F1EC'
const INK = '#111111'
const MUTED = '#5C5B56'
const SIGNAL = '#FF4F00'
const RULE = 'rgba(17, 17, 17, 0.9)'

const META = { fontSize: 18, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: MUTED }

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: PAPER,
          color: INK,
          display: 'flex',
          flexDirection: 'column',
          padding: '40px 56px 44px',
        }}
      >
        <div style={{ display: 'flex', borderTop: `2px solid ${RULE}`, paddingTop: 14 }}>
          <div style={{ ...META, display: 'flex', width: '33%' }}>M.Eng. Computer Engineer</div>
          <div style={{ ...META, display: 'flex', width: '33%' }}>Athens, Greece</div>
          <div style={{ ...META, display: 'flex', width: '34%', justifyContent: 'flex-end' }}>Jamf 200 · ITIL 4</div>
        </div>

        <div style={{ display: 'flex', flex: 1 }} />

        <div style={{ display: 'flex', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 20 }}>
          Apple Fleet & IT Automation · Security Engineering
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 150, fontWeight: 600, letterSpacing: '-0.055em', lineHeight: 0.88 }}>
          <div style={{ display: 'flex' }}>Andreas</div>
          <div style={{ display: 'flex' }}>
            Fragkiadakis<span style={{ color: SIGNAL, marginLeft: -18 }}>.</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
