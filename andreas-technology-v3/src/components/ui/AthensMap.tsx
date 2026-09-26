/**
 * A quiet, Apple Maps-like sketch of central Athens: the Saronic Gulf to the south-west,
 * a street grid, the main avenues, the National Garden and Lycabettus, and a pulsing pin
 * on the centre. Pure SVG; no map tiles or external requests. Colours come from the
 * `--map-*` tokens so it follows the theme.
 */
const MINOR_STREETS = Array.from({ length: 22 }, (_, i) => i * 22 - 40)

export default function AthensMap({ label, className = '' }: { label: string; className?: string }) {
    return (
        <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={label}>
            <rect width="400" height="260" fill="var(--map-land)" />

            {/* Street grid, slightly rotated like the real city plan. */}
            <g stroke="var(--map-street)" strokeWidth="1" transform="rotate(-14 200 130)">
                {MINOR_STREETS.map((x) => (
                    <line key={`v${x}`} x1={x} y1="-80" x2={x} y2="340" />
                ))}
                {MINOR_STREETS.map((y) => (
                    <line key={`h${y}`} x1="-80" y1={y} x2="480" y2={y} />
                ))}
            </g>

            {/* Sea: the Saronic Gulf reaching in from the south-west. */}
            <path d="M0 176 C 38 170 70 186 102 206 C 132 226 170 240 214 246 C 250 251 280 258 300 260 L 0 260 Z" fill="var(--map-sea)" />
            <path d="M0 176 C 38 170 70 186 102 206 C 132 226 170 240 214 246 C 250 251 280 258 300 260" fill="none" stroke="var(--map-shore)" strokeWidth="1.5" />

            {/* Green: the National Garden and Lycabettus hill. */}
            <path d="M226 124 l 26 -6 l 8 22 l -22 10 l -14 -8 z" fill="var(--map-park)" />
            <ellipse cx="282" cy="82" rx="22" ry="14" fill="var(--map-park)" transform="rotate(-20 282 82)" />
            <path d="M160 142 l 18 -4 l 6 12 l -16 6 z" fill="var(--map-park)" />

            {/* Main avenues, with a casing line under each. */}
            <g fill="none" strokeLinecap="round">
                <g stroke="var(--map-casing)" strokeWidth="7">
                    <path d="M40 40 C 110 70 160 100 200 130 C 240 160 300 190 380 214" />
                    <path d="M200 130 C 190 170 160 210 118 250" />
                    <path d="M200 130 C 250 110 300 90 390 70" />
                    <path d="M120 20 C 150 60 175 95 200 130" />
                </g>
                <g stroke="var(--map-road)" strokeWidth="4.5">
                    <path d="M40 40 C 110 70 160 100 200 130 C 240 160 300 190 380 214" />
                    <path d="M200 130 C 190 170 160 210 118 250" />
                    <path d="M200 130 C 250 110 300 90 390 70" />
                    <path d="M120 20 C 150 60 175 95 200 130" />
                </g>
            </g>

            {/* The pin. */}
            <circle className="map-pulse" cx="200" cy="130" r="16" fill="#0071e3" fillOpacity="0.35" />
            <circle cx="200" cy="130" r="9" fill="#ffffff" />
            <circle cx="200" cy="130" r="6" fill="#0071e3" />
        </svg>
    )
}
