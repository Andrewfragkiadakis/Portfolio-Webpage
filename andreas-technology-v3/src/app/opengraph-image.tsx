import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const alt = 'Andreas Fragkiadakis — IT Automation Lead & Security Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The share card, in the site's desktop language: the owner's memoji as a user picture
 * on a soft wallpaper gradient, his name and role. The memoji is embedded as a data URL
 * (read at build time), so the card has no network dependency.
 */
export default async function Image() {
    const memoji = await readFile(join(process.cwd(), 'public/avatar/memoji-peek.png'))
    const src = `data:image/png;base64,${memoji.toString('base64')}`

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(160deg, #F9E4DA 0%, #EBD9F4 45%, #CFE2F6 100%)',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 56,
                        padding: '56px 72px',
                        borderRadius: 28,
                        background: 'rgba(255, 255, 255, 0.86)',
                        boxShadow: '0 30px 80px rgba(20, 22, 60, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.06)',
                    }}
                >
                    <div
                        style={{
                            width: 220,
                            height: 220,
                            borderRadius: 9999,
                            overflow: 'hidden',
                            display: 'flex',
                            background: 'radial-gradient(120% 90% at 50% 20%, #F2F4F8 0%, #C9D1DE 100%)',
                            boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <img src={src} width={220} height={220} alt="Andreas Fragkiadakis" style={{ borderRadius: 9999 }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: 30, fontWeight: 500, color: '#5C5C62' }}>Hi, I&apos;m</div>
                        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: '-0.03em', color: '#1D1D1F', lineHeight: 1.02 }}>Andreas</div>
                        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: '-0.03em', color: '#1D1D1F', lineHeight: 1.02 }}>Fragkiadakis</div>
                        <div style={{ marginTop: 22, fontSize: 30, fontWeight: 600, color: '#1D1D1F' }}>IT Automation Lead &amp; Security Engineer</div>
                        <div style={{ marginTop: 10, fontSize: 24, color: '#0058D6' }}>Jamf 200 · Apple fleet of 550+ Macs · Athens</div>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    )
}
