import type { ReactNode } from 'react'

/**
 * Line icons drawn in the spirit of SF Symbols (regular weight, round caps), which
 * cannot be used on the web. They replace Font Awesome, whose solid glyphs read as
 * generic web UI rather than Apple. Content still names icons by their old Font
 * Awesome class, so the data files did not change.
 */
const PATHS: Record<string, ReactNode> = {
    laptop: (
        <>
            <rect x="4.25" y="5" width="15.5" height="10.75" rx="1.6" />
            <path d="M2 18.75h20" />
        </>
    ),
    shield: (
        <>
            <path d="M12 3.2 19 6v5.4c0 4.3-2.9 7.6-7 9.4-4.1-1.8-7-5.1-7-9.4V6l7-2.8Z" />
            <path d="m9 12 2.1 2.1L15.2 10" />
        </>
    ),
    terminal: (
        <>
            <rect x="3" y="4.5" width="18" height="15" rx="3" />
            <path d="m7.5 9.5 2.75 2.5-2.75 2.5M12.75 15h3.75" />
        </>
    ),
    sparkles: (
        <>
            <path d="M10.5 3.5c.7 4.2 1.9 5.4 6 6-4.1.6-5.3 1.8-6 6-.7-4.2-1.9-5.4-6-6 4.1-.6 5.3-1.8 6-6Z" />
            <path d="M18 14.5c.3 1.9.9 2.4 2.5 2.75-1.6.35-2.2.85-2.5 2.75-.3-1.9-.9-2.4-2.5-2.75 1.6-.35 2.2-.85 2.5-2.75Z" />
        </>
    ),
    gear: (
        <>
            <path d="M18.07 10.32 20.11 10.76v2.48l-2.04.44-.59 1.43 1.13 1.75-1.75 1.75-1.75-1.13-1.43.59-.44 2.04h-2.48l-.44-2.04-1.43-.59-1.75 1.13-1.75-1.75 1.13-1.75-.59-1.43-2.04-.44v-2.48l2.04-.44.59-1.43-1.13-1.75 1.75-1.75 1.75 1.13 1.43-.59.44-2.04h2.48l.44 2.04 1.43.59 1.75-1.13 1.75 1.75-1.13 1.75Z" />
            <circle cx="12" cy="12" r="2.6" />
        </>
    ),
    headphones: (
        <>
            <path d="M4 15.5V12a8 8 0 0 1 16 0v3.5" />
            <rect x="3.25" y="13.25" width="4.25" height="6.5" rx="1.8" />
            <rect x="16.5" y="13.25" width="4.25" height="6.5" rx="1.8" />
        </>
    ),
    network: (
        <>
            <rect x="9.25" y="3" width="5.5" height="4.5" rx="1.2" />
            <rect x="2.75" y="16.5" width="5.5" height="4.5" rx="1.2" />
            <rect x="15.75" y="16.5" width="5.5" height="4.5" rx="1.2" />
            <path d="M12 7.5v4.5M5.5 16.5V14a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2.5" />
        </>
    ),
    copy: (
        <>
            <rect x="8" y="8" width="12" height="12" rx="2.2" />
            <path d="M16 5.6V5.2A2.2 2.2 0 0 0 13.8 3H6.2A2.2 2.2 0 0 0 4 5.2v7.6A2.2 2.2 0 0 0 6.2 15h.4" />
        </>
    ),
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    xmark: <path d="M6 6l12 12M18 6 6 18" />,
    plus: <path d="M12 5v14M5 12h14" />,
}

const FROM_FONT_AWESOME: Record<string, string> = {
    'fab fa-apple': 'laptop',
    'fas fa-shield-halved': 'shield',
    'fas fa-terminal': 'terminal',
    'fas fa-robot': 'sparkles',
    'fas fa-gears': 'gear',
    'fas fa-headset': 'headphones',
    'fas fa-network-wired': 'network',
}

export function Glyph({ name, className = '', strokeWidth = 1.6 }: { name: string; className?: string; strokeWidth?: number }) {
    const key = FROM_FONT_AWESOME[name] ?? name
    return (
        <svg
            viewBox="0 0 24 24"
            className={`shrink-0 ${className}`}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {PATHS[key] ?? PATHS.laptop}
        </svg>
    )
}
