/**
 * An Apple Maps-style sketch of the Athens basin, drawn from real (simplified) geography:
 * the Saronic Gulf coast from Piraeus round Faliro Bay to Glyfada, Hymettus and Aigaleo,
 * the Kifisos and Attiki Odos motorways, the main avenues out of Syntagma, and the
 * parks and hills of the centre (National Garden, Acropolis, Lycabettus).
 *
 * Coordinates are kilometres from Syntagma (x east, y south), drawn at a fixed
 * 30 px/km. The SVG is never stretched: it is a fixed-size canvas positioned so that
 * Syntagma sits under the pin (see `.map-canvas` in Contact), so strokes stay 1 px
 * sharp and labels stay 11 px at every tile size. Pure SVG: no tiles, no requests.
 * Colours come from the `--map-*` tokens, so it follows the theme.
 */

const K = 30
/** Half the canvas, in px. The pin (Syntagma, 0/0) sits at this point of the SVG. */
export const MAP_HALF = { w: 660, h: 480 }

type Pt = readonly [number, number]

const px = ([x, y]: Pt) => `${(x * K).toFixed(1)} ${(y * K).toFixed(1)}`

/** Catmull-Rom through the points, as cubic Béziers: smooth coasts and roads from a few samples. */
function smooth(points: readonly Pt[], closed = false): string {
    const pts = closed ? [points[points.length - 1], ...points, points[0], points[1]] : [points[0], ...points, points[points.length - 1]]
    let d = `M${px(pts[1])}`
    for (let i = 1; i < pts.length - 2; i++) {
        const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]]
        const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
        const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
        d += ` C${px(c1)} ${px(c2)} ${px(p2)}`
    }
    return closed ? `${d} Z` : d
}

const poly = (points: readonly Pt[]) => `M${points.map(px).join(' L')} Z`

/* ── Geography (km from Syntagma) ─────────────────────────────────────────── */

const COAST: Pt[] = [
    [-22, 1.5], [-19, 1.8], [-16.5, 2.1], [-14, 2.4], [-12, 2.9], [-10.6, 3.3], [-9.6, 3.7], [-9.0, 3.9], [-8.6, 4.3], [-9.0, 4.75], [-9.7, 4.9],
    [-10.3, 5.3], [-10.5, 5.9], [-10.1, 6.4], [-9.3, 6.5], [-8.9, 6.15], [-8.5, 6.3], [-8.1, 6.0], [-7.3, 5.7],
    [-6.2, 5.35], [-5.0, 5.25], [-4.2, 5.6], [-3.4, 6.5], [-2.7, 7.8], [-2.0, 9.3], [-1.2, 10.5], [-0.4, 12], [0.3, 13.5], [1.1, 16.2],
]
const SEA = `${smooth(COAST)} L${px([-22, 16.2])} Z`

const HYMETTUS: Pt[] = [
    [6, -7.5], [5, -5], [4.6, -2], [4.8, 1.5], [4.3, 5], [3.3, 8.5], [2.6, 11], [3.3, 16.2],
    [9, 16.2], [9.5, 8], [10, 2], [9.6, -3], [8, -6.5],
]
const AIGALEO: Pt[] = [[-22, -11], [-16, -10.6], [-11, -10], [-9.6, -7], [-8.8, -4], [-9.4, -1.2], [-10.4, 1.2], [-11.5, 2.2], [-16, 2.0], [-22, 1.6]]

/** Scale a ring toward a point: cheap contour lines for the mountains. */
const inset = (ring: readonly Pt[], [cx, cy]: Pt, f: number): Pt[] => ring.map(([x, y]) => [cx + (x - cx) * f, cy + (y - cy) * f])

const PARKS: Pt[][] = [
    [[0.25, 0.05], [0.75, 0.1], [0.8, 0.55], [0.35, 0.7], [0.15, 0.45]], // National Garden & Zappeion
    [[-1.25, 0.25], [-0.7, 0.2], [-0.62, 0.55], [-0.95, 1.25], [-1.55, 1.35], [-1.7, 0.8]], // Acropolis, Philopappos, Pnyx
    [[-0.35, -2.2], [0.15, -2.25], [0.2, -1.75], [-0.3, -1.7]], // Pedion tou Areos
    [[-4.6, 4.4], [-3.9, 4.5], [-3.7, 5.05], [-4.4, 5.0]], // Faliro / SNFCC park
    [[-2.4, 7.6], [-0.8, 7.2], [-0.4, 8.6], [-1.8, 9.4]], // Ellinikon
]
const HILLS: { c: Pt; rx: number; ry: number; r: number }[] = [
    { c: [1.05, -0.95], rx: 0.42, ry: 0.28, r: -35 }, // Lycabettus
    { c: [1.9, -3.6], rx: 0.7, ry: 0.42, r: -30 }, // Tourkovounia
]

const MOTORWAYS: Pt[][] = [
    [[-4.5, 5.0], [-4.7, 3], [-4.3, 0], [-4.1, -3], [-3.9, -6], [-3.5, -9], [-3, -13.5], [-2.6, -16.2]], // Kifisou
    [[-22, -8.2], [-14, -8.8], [-9, -9.6], [-4, -10.2], [1, -10.4], [6, -10], [10, -9.4], [14, -9], [22, -8.4]], // Attiki Odos
    [[6.8, -9.8], [5.6, -6.5], [4.3, -3.2], [4.4, 1], [4.0, 5], [3.2, 8.4]], // Hymettus ring road
]
const AVENUES: Pt[][] = [
    [[0.0, 0.7], [-1.2, 2.0], [-2.6, 3.4], [-3.8, 4.6], [-4.4, 5.1]], // Syngrou
    [[-0.6, -0.8], [-2.4, 0.3], [-4.3, 1.5], [-6.2, 2.7], [-8.2, 3.8]], // Pireos
    [[1.9, -1.4], [2.8, -3.2], [3.8, -5.6], [5.0, -8.4], [6.2, -11], [7, -13.5], [7.6, -16.2]], // Kifisias
    [[0.2, -0.1], [1.0, -0.7], [1.9, -1.4]], // Vasilissis Sofias
    [[1.9, -1.4], [3.5, -2.0], [5.2, -2.6], [7.2, -3.3], [10, -4.1], [14, -5], [22, -6.6]], // Mesogeion
    [[-0.6, -0.8], [-0.5, -2.5], [-0.3, -4.5], [0.1, -7], [0.4, -10.4]], // Patission
    [[-0.6, -0.8], [-2.5, -1.4], [-5, -2.1], [-7.2, -2.9], [-9.5, -3.6], [-14, -4.4], [-22, -5.6]], // Athinon
    [[0.4, 0.9], [0.9, 3.0], [1.5, 5.6], [1.9, 8.2], [2.2, 11], [2.5, 13.5], [2.8, 16.2]], // Vouliagmenis
    [[-7.6, 5.5], [-6.2, 5.0], [-5.0, 4.9], [-4.0, 5.3], [-3.1, 6.3], [-2.4, 7.6], [-1.7, 9.0], [-0.9, 10.3], [-0.1, 11.8], [0.6, 13.5], [1.4, 16.2]], // Poseidonos
    [[-0.4, -1.9], [0.7, -1.7], [1.9, -1.4]], // Alexandras
    [[0.2, -0.1], [-0.6, -0.8]], // Panepistimiou
]

/**
 * Neighbourhood street grids. Athens is a patchwork of plans at different angles, so a
 * single grid reads as graph paper; one grid per district, each at its own angle, reads
 * as a city.
 */
const DISTRICTS: { ring: Pt[]; angle: number; step: number }[] = [
    { ring: [[-2, -2.5], [2.5, -2.5], [2.5, 1.5], [-2, 1.5]], angle: -14, step: 0.5 },
    { ring: [[-3.5, -9], [4, -9], [3, -2.5], [-2, -2.5], [-3.5, -3]], angle: 8, step: 0.6 },
    { ring: [[-22, -9], [-3.5, -9], [-3.5, -3], [-2, -2.5], [-2, 1.5], [-5, 3.5], [-22, 3]], angle: 25, step: 0.62 },
    { ring: [[-2, 1.5], [2.5, 1.5], [3.5, 6], [1, 16.2], [-5, 16.2], [-5, 3.5]], angle: -35, step: 0.6 },
    { ring: [[2.5, -2.5], [3, -9], [6, -9], [6, 6], [3.5, 6], [2.5, 1.5]], angle: 12, step: 0.6 },
    { ring: [[-22, 3], [-5, 3.5], [-5, 16.2], [-22, 16.2]], angle: -40, step: 0.58 },
    { ring: [[-22, -16.2], [22, -16.2], [22, -9], [-22, -9]], angle: -20, step: 0.7 },
    { ring: [[6, -9], [22, -9], [22, 16.2], [6, 16.2]], angle: 18, step: 0.7 },
]

function gridLines(step: number): string {
    const n = Math.ceil(30 / step)
    const lines: string[] = []
    for (let i = -n; i <= n; i++) {
        const o = (i * step * K).toFixed(1)
        lines.push(`M${o} -900 V900`, `M-900 ${o} H900`)
    }
    return lines.join(' ')
}

export interface MapPlaces {
    piraeus: string
    gulf: string
}

export default function AthensMap({ label, places, className = '' }: { label: string; places: MapPlaces; className?: string }) {
    const { w, h } = MAP_HALF
    return (
        <svg
            viewBox={`${-w} ${-h} ${w * 2} ${h * 2}`}
            width={w * 2}
            height={h * 2}
            className={className}
            role="img"
            aria-label={label}
        >
            <defs>
                {DISTRICTS.map((d, i) => (
                    <clipPath key={i} id={`athens-d${i}`}>
                        <path d={poly(d.ring)} />
                    </clipPath>
                ))}
            </defs>

            <rect x={-w} y={-h} width={w * 2} height={h * 2} fill="var(--map-urban)" />

            {/* Streets */}
            <g stroke="var(--map-street)" strokeWidth="1" fill="none" opacity="var(--map-street-alpha)">
                {DISTRICTS.map((d, i) => (
                    <g key={i} clipPath={`url(#athens-d${i})`}>
                        <path d={gridLines(d.step)} transform={`rotate(${d.angle})`} />
                    </g>
                ))}
            </g>

            {/* Mountains, with two faint contours each */}
            {[HYMETTUS, AIGALEO].map((ring, i) => {
                const c: Pt = i === 0 ? [7.2, 2] : [-12, -4]
                return (
                    <g key={i}>
                        <path d={smooth(ring, true)} fill="var(--map-hill)" />
                        <path d={smooth(inset(ring, c, 0.72), true)} fill="none" stroke="var(--map-contour)" strokeWidth="1" />
                        <path d={smooth(inset(ring, c, 0.44), true)} fill="none" stroke="var(--map-contour)" strokeWidth="1" />
                    </g>
                )
            })}

            {/* Parks and hills of the centre */}
            <g fill="var(--map-park)">
                {PARKS.map((ring, i) => <path key={i} d={smooth(ring, true)} />)}
                {HILLS.map((hill, i) => (
                    <ellipse key={i} cx={hill.c[0] * K} cy={hill.c[1] * K} rx={hill.rx * K} ry={hill.ry * K} transform={`rotate(${hill.r} ${hill.c[0] * K} ${hill.c[1] * K})`} />
                ))}
            </g>

            {/* The Saronic Gulf */}
            <path d={SEA} fill="var(--map-sea)" />
            <path d={smooth(COAST)} fill="none" stroke="var(--map-shore)" strokeWidth="1" />

            {/* Roads: casings first, then fills, so junctions merge cleanly. */}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {AVENUES.map((r, i) => <path key={`ac${i}`} d={smooth(r)} stroke="var(--map-casing)" strokeWidth="4.5" />)}
                {MOTORWAYS.map((r, i) => <path key={`mc${i}`} d={smooth(r)} stroke="var(--map-motorway-casing)" strokeWidth="6" />)}
                {AVENUES.map((r, i) => <path key={`a${i}`} d={smooth(r)} stroke="var(--map-road)" strokeWidth="2.75" />)}
                {MOTORWAYS.map((r, i) => <path key={`m${i}`} d={smooth(r)} stroke="var(--map-motorway)" strokeWidth="4" />)}
            </g>

            {/* A few place names, as Apple Maps shows at this zoom. */}
            <g className="map-labels" fontFamily="var(--font-display)" fontSize="11" fontWeight="600" textAnchor="middle">
                <text x={-7.1 * K} y={4.35 * K} fill="var(--map-label)">{places.piraeus}</text>
                <text x={-6.4 * K} y={7.3 * K} fill="var(--map-sea-label)" fontStyle="italic" fontWeight="500">{places.gulf}</text>
            </g>
        </svg>
    )
}
