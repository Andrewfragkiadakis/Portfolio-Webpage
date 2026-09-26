import { ImageResponse } from 'next/og'

export const alt = 'Andreas Fragkiadakis — M.Eng. Computer Engineer, IT & Security'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Swiss Cobalt palette (see globals.css).
const PAPER = '#F2F1EC'
const INK = '#111111'
const MUTED = '#5C5B56'
const COBALT = '#2323FF'
const RULE = 'rgba(17, 17, 17, 0.9)'

const META = { fontSize: 18, letterSpacing: '0.06em', textTransform: 'uppercase' as const }

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: PAPER, color: INK, display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 40px 44px 56px' }}>
          <div style={{ display: 'flex', borderTop: `2px solid ${RULE}`, paddingTop: 14 }}>
            <div style={{ ...META, color: MUTED, display: 'flex', width: '50%' }}>M.Eng. Computer Engineer</div>
            <div style={{ ...META, color: MUTED, display: 'flex', width: '50%' }}>Athens, Greece</div>
          </div>

          <div style={{ display: 'flex', flex: 1 }} />

          <div style={{ display: 'flex', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 20 }}>
            Apple Fleet & IT Automation · Security Engineering
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 128, fontWeight: 600, letterSpacing: '-0.055em', lineHeight: 0.88 }}>
            <div style={{ display: 'flex' }}>Andreas</div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              Fragkiadakis
              <div style={{ display: 'flex', width: 22, height: 22, background: COBALT, marginLeft: 6, marginBottom: 14 }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: 300, background: COBALT, color: '#FFFFFF', padding: '40px 32px 44px' }}>
          <div style={{ ...META, display: 'flex', justifyContent: 'space-between', borderTop: '2px solid rgba(255,255,255,0.9)', paddingTop: 14 }}>
            <span>(00)</span>
            <span>Jamf 200 · ITIL 4</span>
          </div>
          <div style={{ display: 'flex', fontSize: 190, fontWeight: 700, letterSpacing: '-0.06em', lineHeight: 0.9, marginTop: 20 }}>AF</div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
            Apple Fleet & IT Automation Lead
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
