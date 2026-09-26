import type { ReactNode, SVGProps } from 'react'

/**
 * A small set of original line icons drawn in the spirit of SF Symbols: 24-unit grid,
 * one consistent 1.5 stroke, round caps and joins, optical centring. They replace the
 * Font Awesome glyphs of v1, so the whole interface speaks one icon language.
 */

/** Points of a scalloped seal, used by `checkmark.seal`. */
function sealPath(): string {
    const points: string[] = []
    const teeth = 12
    for (let i = 0; i < teeth * 2; i++) {
        const angle = (Math.PI * i) / teeth - Math.PI / 2
        const radius = i % 2 === 0 ? 9.2 : 7.6
        points.push(`${(12 + radius * Math.cos(angle)).toFixed(2)} ${(12 + radius * Math.sin(angle)).toFixed(2)}`)
    }
    return `M${points.join('L')}Z`
}

/** A gear outline with eight rounded teeth. */
function gearPath(): string {
    const teeth = 8
    const outer = 9
    const inner = 6.9
    const parts: string[] = []
    for (let i = 0; i < teeth; i++) {
        const a = (2 * Math.PI * i) / teeth
        const half = Math.PI / teeth
        const w = half * 0.42
        const pts = [
            [inner, a - half + w * 0.4],
            [outer, a - w],
            [outer, a + w],
            [inner, a + half - w * 0.4],
        ]
        for (const [r, t] of pts) parts.push(`${(12 + r * Math.cos(t)).toFixed(2)} ${(12 + r * Math.sin(t)).toFixed(2)}`)
    }
    return `M${parts.join('L')}Z`
}

const SEAL = sealPath()
const GEAR = gearPath()

const STROKE: Record<string, ReactNode> = {
    'chevron.right': <path d="M9.5 5.5 16 12l-6.5 6.5" />,
    'chevron.left': <path d="M14.5 5.5 8 12l6.5 6.5" />,
    'arrow.right': <path d="M4.5 12h14.5M13.5 6.5 19 12l-5.5 5.5" />,
    'arrow.up.right': <path d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15" />,
    xmark: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
    checkmark: <path d="M5 12.8l4.4 4.4L19 7.4" />,
    'checkmark.circle': (
        <>
            <circle cx="12" cy="12" r="8.75" />
            <path d="M8.3 12.4l2.6 2.6 4.9-5.4" />
        </>
    ),
    'checkmark.seal': (
        <>
            <path d={SEAL} />
            <path d="M8.6 12.2l2.3 2.3 4.4-4.8" />
        </>
    ),
    'checkmark.shield': (
        <>
            <path d="M12 3.2 19 5.8v5.5c0 4.6-3 8-7 9.5-4-1.5-7-4.9-7-9.5V5.8z" />
            <path d="M9 11.9l2.2 2.2 4-4.3" />
        </>
    ),
    rosette: (
        <>
            <circle cx="12" cy="9.5" r="5.75" />
            <path d="M8.9 14.4 7.5 21l4.5-2.2 4.5 2.2-1.4-6.6" />
        </>
    ),
    laptop: (
        <>
            <rect x="4.25" y="5.25" width="15.5" height="10.5" rx="1.75" />
            <path d="M2.25 18.75h19.5" />
        </>
    ),
    desktop: (
        <>
            <rect x="3" y="4" width="18" height="12.5" rx="2" />
            <path d="M9 20.25h6M12 16.5v3.75" />
        </>
    ),
    terminal: (
        <>
            <rect x="3" y="4.5" width="18" height="15" rx="2.75" />
            <path d="M7.5 9.5l3 2.5-3 2.5M12.75 15h4" />
        </>
    ),
    sparkles: (
        <>
            <path d="M10.5 3.5c.7 4.3 2.4 6 6.5 6.6-4.1.7-5.8 2.4-6.5 6.6-.7-4.2-2.4-5.9-6.5-6.6 4.1-.6 5.8-2.3 6.5-6.6z" />
            <path d="M18 14.5c.3 1.9 1 2.6 2.75 2.9-1.75.3-2.45 1-2.75 2.85-.3-1.85-1-2.55-2.75-2.85 1.75-.3 2.45-1 2.75-2.9z" />
        </>
    ),
    gearshape: (
        <>
            <path d={GEAR} />
            <circle cx="12" cy="12" r="2.9" />
        </>
    ),
    headset: (
        <>
            <path d="M4.75 14.5V12a7.25 7.25 0 0 1 14.5 0v2.5" />
            <rect x="3.5" y="13" width="4" height="6" rx="1.6" />
            <rect x="16.5" y="13" width="4" height="6" rx="1.6" />
            <path d="M18.5 19c0 1.4-1.3 2-3.5 2h-1.5" />
        </>
    ),
    network: (
        <>
            <rect x="9.5" y="3.5" width="5" height="4" rx="1.1" />
            <rect x="3.5" y="16.5" width="5" height="4" rx="1.1" />
            <rect x="15.5" y="16.5" width="5" height="4" rx="1.1" />
            <path d="M12 7.5v5M6 16.5v-4h12v4" />
        </>
    ),
    mappin: (
        <>
            <path d="M12 21s-6.5-5.7-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15.3 12 21 12 21z" />
            <circle cx="12" cy="9.8" r="2.3" />
        </>
    ),
    'person.text.rectangle': (
        <>
            <rect x="2.75" y="5" width="18.5" height="14" rx="2.5" />
            <circle cx="8.5" cy="10.6" r="2" />
            <path d="M5.4 16c.5-1.6 1.6-2.4 3.1-2.4s2.6.8 3.1 2.4M14.25 10h4.25M14.25 13.5h3" />
        </>
    ),
    graduationcap: (
        <>
            <path d="M2.5 9.5 12 5l9.5 4.5L12 14z" />
            <path d="M6.5 11.6V16c1.5 1.4 3.4 2 5.5 2s4-.6 5.5-2v-4.4M21.5 9.5v5" />
        </>
    ),
    'doc.text': (
        <>
            <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
            <path d="M14 3v5h5M8.75 12.5h6.5M8.75 16h6.5" />
        </>
    ),
    'doc.on.doc': (
        <>
            <rect x="8.5" y="7.5" width="11.5" height="13.5" rx="2.25" />
            <path d="M15.5 7.5V5.25A2.25 2.25 0 0 0 13.25 3h-7A2.25 2.25 0 0 0 4 5.25v9.5A2.25 2.25 0 0 0 6.25 17H8.5" />
        </>
    ),
    envelope: (
        <>
            <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
            <path d="M3.8 7.4 12 13.2l8.2-5.8" />
        </>
    ),
    briefcase: (
        <>
            <rect x="3" y="7.5" width="18" height="12" rx="2.5" />
            <path d="M9 7.5V5.8c0-.7.6-1.3 1.3-1.3h3.4c.7 0 1.3.6 1.3 1.3v1.7M3 12.75h18" />
        </>
    ),
    'person.crop.circle': (
        <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="10" r="3" />
            <path d="M6.3 18.4c1.2-2.2 3.2-3.4 5.7-3.4s4.5 1.2 5.7 3.4" />
        </>
    ),
    'list.bullet': (
        <>
            <path d="M9.5 7h10M9.5 12h10M9.5 17h10" />
            <circle cx="5" cy="7" r=".6" />
            <circle cx="5" cy="12" r=".6" />
            <circle cx="5" cy="17" r=".6" />
        </>
    ),
    'square.grid.2x2': (
        <>
            <rect x="4" y="4" width="6.75" height="6.75" rx="1.6" />
            <rect x="13.25" y="4" width="6.75" height="6.75" rx="1.6" />
            <rect x="4" y="13.25" width="6.75" height="6.75" rx="1.6" />
            <rect x="13.25" y="13.25" width="6.75" height="6.75" rx="1.6" />
        </>
    ),
    'circle.grid': (
        <>
            {[6, 12, 18].flatMap((x) => [6, 12, 18].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.35" />))}
        </>
    ),
    globe: (
        <>
            <circle cx="12" cy="12" r="9" />
            <ellipse cx="12" cy="12" rx="4" ry="9" />
            <path d="M3 12h18M4.6 7.5h14.8M4.6 16.5h14.8" />
        </>
    ),
    'arrow.down.tray': (
        <>
            <path d="M12 4v10.5M7.5 10.25 12 14.75l4.5-4.5" />
            <path d="M4.5 14.5v3.25a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V14.5" />
        </>
    ),
    clock: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.4 2" />
        </>
    ),
    book: (
        <>
            <path d="M12 6.5C10 5 7.2 4.5 4 5v13c3.2-.5 6 0 8 1.5 2-1.5 4.8-2 8-1.5V5c-3.2-.5-6 0-8 1.5z" />
            <path d="M12 6.5v13" />
        </>
    ),
    internaldrive: (
        <>
            <rect x="3" y="7.75" width="18" height="8.5" rx="2" />
            <path d="M6.25 12h5.5" />
            <circle cx="17" cy="12" r=".6" />
        </>
    ),
    paperplane: (
        <>
            <path d="M20.5 3.5 3.75 10.3l6.6 3.35 3.35 6.6z" />
            <path d="M20.5 3.5l-10.15 10.15" />
        </>
    ),
    'sun.max': (
        <>
            <circle cx="12" cy="12" r="3.9" />
            <path d="M12 2.75v2M12 19.25v2M2.75 12h2M19.25 12h2M5.45 5.45l1.4 1.4M17.15 17.15l1.4 1.4M5.45 18.55l1.4-1.4M17.15 6.85l1.4-1.4" />
        </>
    ),
    moon: <path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1z" />,
    folder: (
        <>
            <path d="M3 7.25a2 2 0 0 1 2-2h4.1l2 2.1H19a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M3 10.1h18" />
        </>
    ),
    'slider.horizontal.3': (
        <>
            <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1" />
            <circle cx="15" cy="7" r="2" />
            <circle cx="9" cy="12" r="2" />
            <circle cx="17" cy="17" r="2" />
        </>
    ),
}

const FILLED: Record<string, ReactNode> = {
    github: (
        <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .31.21.69.82.57A12 12 0 0 0 12 .3" />
    ),
    linkedin: (
        <>
            <rect x="3.2" y="9" width="3.7" height="11.6" rx=".4" />
            <circle cx="5.05" cy="5.1" r="2.15" />
            <path d="M9.6 9h3.5v1.6c.5-.95 1.75-1.95 3.6-1.95 3.85 0 4.55 2.5 4.55 5.75v6.2h-3.65v-5.5c0-1.3-.03-3-1.83-3-1.84 0-2.12 1.43-2.12 2.9v5.6H9.6z" />
        </>
    ),
}

export type SymbolName = keyof typeof STROKE | keyof typeof FILLED

/** Content-file glyph classes (kept from v1) mapped onto this symbol set. */
const FROM_FONT_AWESOME: Record<string, SymbolName> = {
    'fab fa-apple': 'laptop',
    'fas fa-laptop': 'laptop',
    'fas fa-shield-halved': 'checkmark.shield',
    'fas fa-robot': 'sparkles',
    'fas fa-terminal': 'terminal',
    'fas fa-gears': 'gearshape',
    'fas fa-headset': 'headset',
    'fas fa-network-wired': 'network',
    'fas fa-award': 'rosette',
    'fas fa-certificate': 'checkmark.seal',
    'fas fa-id-card': 'person.text.rectangle',
    'fas fa-graduation-cap': 'graduationcap',
    'fab fa-github': 'github',
    'fab fa-linkedin-in': 'linkedin',
}

/** Resolve a content-file icon (a v1 Font Awesome class) or a symbol name. */
export function symbolFor(icon: string | undefined, fallback: SymbolName = 'doc.text'): SymbolName {
    if (!icon) return fallback
    if (icon in STROKE || icon in FILLED) return icon as SymbolName
    return FROM_FONT_AWESOME[icon] ?? fallback
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
    name: SymbolName
    /** Stroke weight in grid units; 1.5 everywhere by default. */
    weight?: number
}

/** Decorative by default (`aria-hidden`); give the parent the accessible name. */
export default function Icon({ name, weight = 1.5, className = '', ...rest }: IconProps) {
    const filled = name in FILLED
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            aria-hidden="true"
            focusable="false"
            className={`sym shrink-0 ${className}`}
            {...(filled
                ? { fill: 'currentColor' }
                : { fill: 'none', stroke: 'currentColor', strokeWidth: weight, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const })}
            {...rest}
        >
            {filled ? FILLED[name] : STROKE[name]}
        </svg>
    )
}
