import { ImageResponse } from 'next/og'

export const alt = 'Andreas Fragkiadakis — M.Eng. Computer Engineer, IT & Security'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BG = '#030014'
const FOREGROUND = '#e0e7ff'
const ACCENT = '#a5b4fc'
const STROKE = '3px'
const outlineShadow = [
  `-${STROKE} -${STROKE} 0 ${BG}`,
  `${STROKE} -${STROKE} 0 ${BG}`,
  `-${STROKE} ${STROKE} 0 ${BG}`,
  `${STROKE} ${STROKE} 0 ${BG}`,
].join(', ')

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: BG,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% 40%, rgba(165, 180, 252, 0.08) 0%, transparent 50%)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: FOREGROUND,
              textShadow: outlineShadow,
              lineHeight: 0.85,
              textAlign: 'center',
            }}
          >
            ANDREAS
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: FOREGROUND,
              textShadow: outlineShadow,
              lineHeight: 0.85,
              textAlign: 'center',
            }}
          >
            FRAGKIADAKIS
          </div>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: ACCENT,
            textTransform: 'uppercase',
          }}
        >
          M.ENG. COMPUTER ENGINEER
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 16,
            letterSpacing: '0.15em',
            color: FOREGROUND,
            opacity: 0.7,
            textTransform: 'uppercase',
          }}
        >
          SecOps · Infrastructure · AI
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
