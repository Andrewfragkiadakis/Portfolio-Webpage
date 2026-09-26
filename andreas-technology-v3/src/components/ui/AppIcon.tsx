import { useId, type ReactNode } from 'react'
import Icon, { type SymbolName } from '@/components/ui/Icon'
import type { AppId } from '@/data/apps'

/**
 * Original app icons in the macOS Big Sur idiom: a superellipse ("squircle") tile,
 * a layered gradient, a soft top highlight, a hairline rim and a drop shadow, with one
 * simple glyph. None of this is Apple artwork; the shapes are drawn here from scratch.
 */

/** Superellipse |x|^n + |y|^n = 1 (n = 5 is close to the continuous-corner app shape). */
function squirclePath(size = 100, inset = 1, n = 5, steps = 96): string {
    const r = size / 2 - inset
    const c = size / 2
    const pts: string[] = []
    for (let i = 0; i < steps; i++) {
        const t = (2 * Math.PI * i) / steps
        const cos = Math.cos(t)
        const sin = Math.sin(t)
        const x = c + r * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n)
        const y = c + r * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n)
        pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`)
    }
    return `M${pts.join('L')}Z`
}

export const SQUIRCLE = squirclePath()

/** Gradient stops per app: [top, bottom]. */
const TINT: Record<AppId, [string, string]> = {
    hero: ['#7CC8FF', '#1F6BF0'],
    about: ['#C79BFF', '#7437E6'],
    services: ['#4FE3AE', '#0A9A6C'],
    experience: ['#FFC173', '#F0650F'],
    projects: ['#FBFCFE', '#D9DFE8'],
    contact: ['#FF8FA3', '#E3264F'],
    terminal: ['#56565E', '#1B1B1F'],
    github: ['#454B55', '#0D1117'],
    linkedin: ['#2E97EE', '#0A62BC'],
    resume: ['#FFFFFF', '#FFFFFF'],
    credential: ['#FFFFFF', '#FFFFFF'],
}

function useSvgId(): string {
    return `ai${useId().replace(/[^a-zA-Z0-9]/g, '')}`
}

/** Squircle tile with gradient, highlight and rim; children draw the glyph (100-unit box). */
export function Squircle({ from, to, children, id }: { from: string; to: string; children?: ReactNode; id: string }) {
    return (
        <>
            <defs>
                <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={from} />
                    <stop offset="1" stopColor={to} />
                </linearGradient>
                <linearGradient id={`${id}-hl`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.34" />
                    <stop offset="0.48" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
                <filter id={`${id}-gs`} x="-20%" y="-20%" width="140%" height="150%">
                    <feDropShadow dx="0" dy="1.6" stdDeviation="1.6" floodColor="#000000" floodOpacity="0.22" />
                </filter>
            </defs>
            <path d={SQUIRCLE} fill={`url(#${id}-bg)`} />
            <g filter={`url(#${id}-gs)`}>{children}</g>
            <path d={SQUIRCLE} fill={`url(#${id}-hl)`} />
            <path d={SQUIRCLE} fill="none" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1" />
        </>
    )
}

function Glyph({ app, id }: { app: AppId; id: string }) {
    switch (app) {
        case 'hero':
            // A display showing a tiny wallpaper.
            return (
                <>
                    <defs>
                        <linearGradient id={`${id}-scr`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor="#FFB58A" />
                            <stop offset="0.5" stopColor="#F59BC8" />
                            <stop offset="1" stopColor="#7E8CFF" />
                        </linearGradient>
                    </defs>
                    <rect x="19" y="23" width="62" height="42" rx="6.5" fill="#FFFFFF" />
                    <rect x="24" y="28" width="52" height="32" rx="2.5" fill={`url(#${id}-scr)`} />
                    <path d="M24 50c9-6 17-7 26-2s17 4 26-3v12.5a2.5 2.5 0 0 1-2.5 2.5h-47a2.5 2.5 0 0 1-2.5-2.5z" fill="#FFFFFF" fillOpacity="0.35" />
                    <path d="M43 65h14l2.5 9h-19z" fill="#E6ECF7" />
                    <rect x="34" y="73" width="32" height="4.5" rx="2.25" fill="#FFFFFF" />
                </>
            )
        case 'about':
            // A contact card.
            return (
                <>
                    <rect x="17" y="26" width="66" height="48" rx="8" fill="#FFFFFF" />
                    <circle cx="36" cy="45" r="7.5" fill="#8B5CF6" />
                    <path d="M24.5 64c1.6-6 6-9 11.5-9s9.9 3 11.5 9z" fill="#8B5CF6" />
                    <rect x="53" y="40" width="21" height="4" rx="2" fill="#C9B5FA" />
                    <rect x="53" y="49" width="16" height="4" rx="2" fill="#DDD0FC" />
                    <rect x="53" y="58" width="19" height="4" rx="2" fill="#DDD0FC" />
                </>
            )
        case 'services':
            // Three sliders: the craft of tuning systems.
            return (
                <>
                    {[34, 50, 66].map((y) => (
                        <rect key={y} x="22" y={y - 3} width="56" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.55" />
                    ))}
                    <rect x="22" y="31" width="38" height="6" rx="3" fill="#FFFFFF" />
                    <rect x="22" y="47" width="18" height="6" rx="3" fill="#FFFFFF" />
                    <rect x="22" y="63" width="44" height="6" rx="3" fill="#FFFFFF" />
                    <circle cx="60" cy="34" r="8.5" fill="#FFFFFF" />
                    <circle cx="40" cy="50" r="8.5" fill="#FFFFFF" />
                    <circle cx="66" cy="66" r="8.5" fill="#FFFFFF" />
                </>
            )
        case 'experience':
            // A briefcase.
            return (
                <>
                    <path d="M40 36v-5a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v5" fill="none" stroke="#FFFFFF" strokeWidth="5" />
                    <rect x="17" y="35" width="66" height="42" rx="8" fill="#FFFFFF" />
                    <rect x="17" y="53" width="66" height="3.5" fill="#FFD9B0" />
                    <rect x="44.5" y="49.5" width="11" height="10" rx="2.5" fill="#F47A20" />
                </>
            )
        case 'projects':
            // A folder, drawn in the system-folder blue.
            return (
                <>
                    <defs>
                        <linearGradient id={`${id}-fd`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#8FD0FF" />
                            <stop offset="1" stopColor="#4DA6F7" />
                        </linearGradient>
                    </defs>
                    <path d="M18 31a5 5 0 0 1 5-5h15.5l6 6H77a5 5 0 0 1 5 5v35a5 5 0 0 1-5 5H23a5 5 0 0 1-5-5z" fill="#3E92E8" />
                    <path d="M18 41.5a4.5 4.5 0 0 1 4.5-4.5h55a4.5 4.5 0 0 1 4.5 4.5V72a5 5 0 0 1-5 5H23a5 5 0 0 1-5-5z" fill={`url(#${id}-fd)`} />
                    <path d="M22.5 37h55a4.5 4.5 0 0 1 4.5 4.5v1a4.5 4.5 0 0 0-4.5-4.5h-55a4.5 4.5 0 0 0-4.5 4.5v-1a4.5 4.5 0 0 1 4.5-4.5z" fill="#FFFFFF" fillOpacity="0.55" />
                </>
            )
        case 'contact':
            // A paper plane.
            return (
                <>
                    <path d="M20 50 79 25 63 76 47 59z" fill="#FFFFFF" />
                    <path d="M47 59 79 25 52 71z" fill="#FFD6DE" />
                    <path d="M47 59 79 25" stroke="#FF9DB0" strokeWidth="1.6" />
                </>
            )
        case 'terminal':
            return (
                <>
                    <path d="M28 37 41 50 28 63" fill="none" stroke="#F4F4F6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="46" y="59" width="24" height="6" rx="3" fill="#F4F4F6" />
                </>
            )
        case 'github':
            return (
                <g transform="translate(22 22) scale(2.333)" fill="#FFFFFF">
                    <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .31.21.69.82.57A12 12 0 0 0 12 .3" />
                </g>
            )
        case 'linkedin':
            return (
                <g transform="translate(23 21) scale(2.25)" fill="#FFFFFF">
                    <rect x="3.2" y="9" width="3.7" height="11.6" rx=".4" />
                    <circle cx="5.05" cy="5.1" r="2.15" />
                    <path d="M9.6 9h3.5v1.6c.5-.95 1.75-1.95 3.6-1.95 3.85 0 4.55 2.5 4.55 5.75v6.2h-3.65v-5.5c0-1.3-.03-3-1.83-3-1.84 0-2.12 1.43-2.12 2.9v5.6H9.6z" />
                </g>
            )
        default:
            return null
    }
}

/** A PDF document: page, folded corner, text lines and the file-type label. */
function DocumentArt({ id }: { id: string }) {
    return (
        <>
            <defs>
                <linearGradient id={`${id}-pg`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FFFFFF" />
                    <stop offset="1" stopColor="#F1F3F7" />
                </linearGradient>
                <filter id={`${id}-ds`} x="-30%" y="-20%" width="160%" height="150%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.28" />
                </filter>
            </defs>
            <g filter={`url(#${id}-ds)`}>
                <path d="M25 6h34l20 20v64a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z" fill={`url(#${id}-pg)`} />
            </g>
            <path d="M59 6v16a4 4 0 0 0 4 4h16z" fill="#DDE1E8" />
            {[34, 41, 48, 55].map((y, i) => (
                <rect key={y} x="30" y={y} width={i === 3 ? 26 : 40} height="3" rx="1.5" fill="#C9CED8" />
            ))}
            <text x="50" y="82" textAnchor="middle" fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" fontWeight="800" fontSize="15" letterSpacing="0.5" fill="#E5484D">
                PDF
            </text>
        </>
    )
}

/** A certificate with a ribbon seal, for the Jamf 200 credential. */
function CertificateArt({ id }: { id: string }) {
    return (
        <>
            <defs>
                <linearGradient id={`${id}-seal`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#5B9BFF" />
                    <stop offset="1" stopColor="#1D4ED8" />
                </linearGradient>
                <filter id={`${id}-ds`} x="-20%" y="-30%" width="140%" height="170%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.28" />
                </filter>
            </defs>
            <g filter={`url(#${id}-ds)`}>
                <rect x="8" y="20" width="84" height="58" rx="4" fill="#FFFDF6" />
            </g>
            <rect x="13" y="25" width="74" height="48" rx="2" fill="none" stroke="#D8C98F" strokeWidth="1.4" />
            <rect x="27" y="34" width="46" height="4" rx="2" fill="#8C93A1" />
            <rect x="32" y="43" width="36" height="2.6" rx="1.3" fill="#CDD2DB" />
            <rect x="29" y="49" width="30" height="2.6" rx="1.3" fill="#CDD2DB" />
            <path d="M63 72 59 88l6-3.5 4 5 2-15zM77 72l4 16-6-3.5-4 5-2-15z" fill="#1E40AF" />
            <circle cx="70" cy="66" r="11" fill={`url(#${id}-seal)`} stroke="#FFFFFF" strokeWidth="1.6" />
            <path d="M65.2 66.2l3.3 3.3 6.3-6.8" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
    )
}

interface AppIconProps {
    app: AppId
    /** Rendered size in px (or any CSS length). */
    size?: number | string
    className?: string
}

/** A full-colour app icon. Decorative: the parent carries the accessible name. */
export default function AppIcon({ app, size = 48, className = '' }: AppIconProps) {
    const id = useSvgId()
    const [from, to] = TINT[app]
    return (
        <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            aria-hidden="true"
            focusable="false"
            className={`app-icon shrink-0 ${app === 'resume' || app === 'credential' ? 'app-icon--doc' : ''} ${className}`}
        >
            {app === 'resume' ? (
                <DocumentArt id={id} />
            ) : app === 'credential' ? (
                <CertificateArt id={id} />
            ) : (
                <Squircle from={from} to={to} id={id}>
                    <Glyph app={app} id={id} />
                </Squircle>
            )}
        </svg>
    )
}

/**
 * A small squircle tile with a white line symbol, for service and skill cards: the
 * same shape language as the app icons, at list-item size.
 */
export function GlyphTile({ symbol, tint, size = 32, className = '' }: { symbol: SymbolName; tint: readonly [string, string]; size?: number; className?: string }) {
    const id = useSvgId()
    return (
        <span className={`relative inline-flex shrink-0 items-center justify-center text-white ${className}`} style={{ width: size, height: size }} aria-hidden="true">
            <svg viewBox="0 0 100 100" className="app-icon absolute inset-0 w-full h-full" focusable="false">
                <Squircle from={tint[0]} to={tint[1]} id={id} />
            </svg>
            <Icon name={symbol} weight={1.75} className="relative" style={{ fontSize: size * 0.56 }} />
        </span>
    )
}

/** The "AF" monogram on a blue squircle: the owner's avatar in the OS chrome. */
export function MonogramIcon({ size = 56, className = '' }: { size?: number | string; className?: string }) {
    const id = useSvgId()
    return (
        <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false" className={`app-icon shrink-0 ${className}`}>
            <Squircle from="#6FB9FF" to="#1B5FE6" id={id}>
                <text
                    x="50"
                    y="63"
                    textAnchor="middle"
                    fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
                    fontWeight="800"
                    fontSize="38"
                    letterSpacing="-1.5"
                    fill="#FFFFFF"
                >
                    AF
                </text>
            </Squircle>
        </svg>
    )
}
