/**
 * An original abstract wallpaper in the spirit of the recent macOS ones: soft folded
 * bands of colour sweeping across the screen, warm at the top and cool below. Pure
 * vector, no image download; one variant per theme (switched by CSS on `.dark`).
 */

interface Palette {
    base: [string, string, string]
    bands: { from: string; to: string; opacity: number }[]
    glow: string
    sheen: number
}

const LIGHT: Palette = {
    base: ['#F9E4DA', '#E6DDF6', '#CFE2F6'],
    bands: [
        { from: '#A9C2FF', to: '#86D0EE', opacity: 0.9 },
        { from: '#C3A6FF', to: '#8FB2FF', opacity: 0.85 },
        { from: '#F7A5C8', to: '#C39BFF', opacity: 0.88 },
        { from: '#FFC7A1', to: '#FF9EB8', opacity: 0.92 },
    ],
    glow: '#FFFFFF',
    sheen: 0.55,
}

const DARK: Palette = {
    base: ['#120D2E', '#161A48', '#0A1B33'],
    bands: [
        { from: '#0A2E4C', to: '#08465A', opacity: 0.92 },
        { from: '#1F1E6E', to: '#153C8E', opacity: 0.9 },
        { from: '#40197A', to: '#2A2290', opacity: 0.9 },
        { from: '#6A1F5A', to: '#43208A', opacity: 0.92 },
    ],
    glow: '#8C9CFF',
    sheen: 0.14,
}

/** Band edges, bottom (largest) to top (smallest), in a 1600 × 1000 canvas. */
const BANDS = [
    'M-200 1000 L-200 760 C 120 640 460 610 780 690 S 1360 760 1800 520 L1800 1000 Z',
    'M-200 -200 L-200 690 C 180 560 520 470 860 520 S 1420 560 1800 300 L1800 -200 Z',
    'M-200 -200 L-200 470 C 160 360 480 290 820 330 S 1380 330 1800 90 L1800 -200 Z',
    'M-200 -200 L-200 250 C 200 150 520 110 860 150 S 1360 120 1800 -80 L1800 -200 Z',
]

function Art({ id, p }: { id: string; p: Palette }) {
    return (
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" className={`wallpaper__${id}`}>
            <defs>
                <linearGradient id={`wp-${id}-base`} x1="0" y1="0" x2="0.4" y2="1">
                    <stop offset="0" stopColor={p.base[0]} />
                    <stop offset="0.55" stopColor={p.base[1]} />
                    <stop offset="1" stopColor={p.base[2]} />
                </linearGradient>
                {p.bands.map((b, i) => (
                    <linearGradient key={i} id={`wp-${id}-b${i}`} x1="0" y1="0.2" x2="1" y2="0.8">
                        <stop offset="0" stopColor={b.from} />
                        <stop offset="1" stopColor={b.to} />
                    </linearGradient>
                ))}
                <radialGradient id={`wp-${id}-glow`} cx="0.78" cy="0.18" r="0.55">
                    <stop offset="0" stopColor={p.glow} stopOpacity={p.sheen} />
                    <stop offset="1" stopColor={p.glow} stopOpacity="0" />
                </radialGradient>
                <filter id={`wp-${id}-soft`} x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="14" />
                </filter>
                <filter id={`wp-${id}-edge`} x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="3" />
                </filter>
            </defs>
            <rect width="1600" height="1000" fill={`url(#wp-${id}-base)`} />
            {BANDS.map((d, i) => (
                <g key={i}>
                    {/* A soft shadow under each fold gives the bands depth. */}
                    <path d={d} fill="#000000" opacity={id === 'dark' ? 0.24 : 0.07} filter={`url(#wp-${id}-soft)`} transform="translate(0 18)" />
                    <path d={d} fill={`url(#wp-${id}-b${i})`} opacity={p.bands[i].opacity} />
                    {/* Light catching the fold's edge. */}
                    <path d={d} fill="none" stroke="#FFFFFF" strokeOpacity={p.sheen * 0.8} strokeWidth="3" filter={`url(#wp-${id}-edge)`} />
                </g>
            ))}
            <rect width="1600" height="1000" fill={`url(#wp-${id}-glow)`} />
        </svg>
    )
}

export default function Wallpaper() {
    return (
        <div className="wallpaper" aria-hidden="true">
            <Art id="light" p={LIGHT} />
            <Art id="dark" p={DARK} />
        </div>
    )
}
