import { memo, useId, type ReactNode } from 'react'
import Icon, { type SymbolName } from '@/components/ui/Icon'
import type { AppId } from '@/data/apps'

/**
 * Original app icons in the macOS idiom (Finder, Contacts, System Settings, Notes, Mail and Terminal lookalikes): a superellipse ("squircle") tile,
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
    hero: ['#74C6FF', '#1E86F4'],
    about: ['#FDFDFE', '#E2E3E8'],
    services: ['#D9DCE2', '#9AA0AC'],
    experience: ['#FFFFFF', '#F1F1F4'],
    projects: ['#FBFCFE', '#D9DFE8'],
    contact: ['#5CCBFF', '#1272F0'],
    terminal: ['#9A9AA3', '#5B5B63'],
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
            // Finder: a two-tone face, blue on the left, pale on the right, with a smile.
            return (
                <>
                    <defs>
                        <clipPath id={`${id}-cp`}><path d={SQUIRCLE} /></clipPath>
                        <linearGradient id={`${id}-fr`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#F4F9FF" />
                            <stop offset="1" stopColor="#CFE4FB" />
                        </linearGradient>
                    </defs>
                    <g clipPath={`url(#${id}-cp)`}>
                        <path d="M55 0C49 28 58 62 49 100H100V0Z" fill={`url(#${id}-fr)`} />
                    </g>
                    <g stroke="#0A2A5C" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        <path d="M36 33v13M64 33v13" strokeWidth="5" />
                        <path d="M53 33c1.5 9 .5 17-2 24h6" strokeWidth="3" />
                        <path d="M27 64c9 13 37 13 46 0" strokeWidth="4" />
                    </g>
                </>
            )
        case 'about':
            // Contacts: a cream page, a grey silhouette, a brown spine and coloured tabs.
            return (
                <>
                    <defs><clipPath id={`${id}-cp`}><path d={SQUIRCLE} /></clipPath></defs>
                    <g clipPath={`url(#${id}-cp)`}>
                        <rect x="0" y="0" width="13" height="100" fill="#A9703F" />
                        <rect x="0" y="0" width="13" height="100" fill="#FFFFFF" fillOpacity="0.12" />
                        {['#F5605C', '#FFB340', '#4CD964', '#3DA5F4', '#9A6BFF'].map((c, i) => (
                            <rect key={c} x="91" y={14 + i * 15} width="9" height="11" rx="2" fill={c} />
                        ))}
                    </g>
                    <circle cx="52" cy="40" r="13.5" fill="#8C8F99" />
                    <path d="M26 79c1.5-15 12-23 26-23s24.5 8 26 23z" fill="#8C8F99" />
                </>
            )
        case 'services':
            // System Settings: a graphite gear.
            return (
                <>
                    <defs>
                        <linearGradient id={`${id}-gr`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#5E636E" />
                            <stop offset="1" stopColor="#363A43" />
                        </linearGradient>
                    </defs>
                    <g fill={`url(#${id}-gr)`}>
                        {[0, 45, 90, 135].map((a) => (
                            <rect key={a} x="43" y="16" width="14" height="68" rx="3.5" transform={`rotate(${a} 50 50)`} />
                        ))}
                        <circle cx="50" cy="50" r="25" />
                    </g>
                    <circle cx="50" cy="50" r="10.5" fill="#B4B9C3" />
                    <circle cx="50" cy="50" r="10.5" fill="none" stroke="#2E323A" strokeOpacity="0.35" strokeWidth="1.5" />
                </>
            )
        case 'experience':
            // Notes: a yellow header over lined paper.
            return (
                <>
                    <defs><clipPath id={`${id}-cp`}><path d={SQUIRCLE} /></clipPath></defs>
                    <g clipPath={`url(#${id}-cp)`}>
                        <rect x="0" y="0" width="100" height="27" fill="#FFD43B" />
                        <rect x="0" y="26" width="100" height="1.5" fill="#E0B21E" />
                    </g>
                    {[43, 57, 71].map((y) => (
                        <rect key={y} x="14" y={y} width="72" height="1.8" rx=".9" fill="#D9D9DE" />
                    ))}
                    <rect x="20" y="36" width="34" height="4" rx="2" fill="#4A4A52" />
                    <rect x="20" y="50" width="52" height="3.2" rx="1.600" fill="#B5B5BC" />
                    <rect x="20" y="64" width="40" height="3.2" rx="1.600" fill="#B5B5BC" />
                    <rect x="20" y="78" width="24" height="3.2" rx="1.600" fill="#B5B5BC" />
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
            // Mail: a white envelope on a blue tile.
            return (
                <>
                    <rect x="15" y="27" width="70" height="46" rx="8" fill="#FFFFFF" />
                    <path d="M18 33c10 8 21 17 32 17s22-9 32-17" fill="none" stroke="#2F86F2" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )
        case 'terminal':
            // Terminal: a black screen inside a light grey bezel.
            return (
                <>
                    <rect x="7" y="9" width="86" height="82" rx="14" fill="#0D0D10" />
                    <rect x="7" y="9" width="86" height="82" rx="14" fill="none" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1.2" />
                    <path d="M24 38 38 50 24 62" fill="none" stroke="#F4F4F6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="45" y="59" width="26" height="6" rx="3" fill="#F4F4F6" />
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
function AppIcon({ app, size = 48, className = '' }: AppIconProps) {
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

/** Pure by its props, so re-rendering a window frame never re-draws its icons. */
export default memo(AppIcon)

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

/**
 * The owner's picture: his memoji peeking over a MacBook, in a circle like a macOS user
 * picture (login window, Users & Groups). `face` is a tighter crop of the head for small
 * sizes such as the menu bar. Both crops stop above the laptop's logo.
 */
export function Avatar({
    size = 56,
    crop = 'peek',
    alt = 'Andreas Fragkiadakis',
    className = '',
    lazy = false,
}: {
    size?: number
    crop?: 'peek' | 'face'
    /** Empty when a visible name right beside it already says who this is. */
    alt?: string
    className?: string
    /** Only load when rendered in view (the menu-bar crop never loads on phones). */
    lazy?: boolean
}) {
    const src = crop === 'face' ? '/avatar/memoji-face.webp' : '/avatar/memoji-peek.webp'
    return (
        <span className={`os-avatar ${crop === 'face' ? 'os-avatar--face' : ''} ${className}`} style={{ width: size, height: size }}>
            {/* A 3 KB / 10 KB pre-cropped WebP at 3x: no optimizer round trip, never blurry. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} width={size} height={size} decoding="async" loading={lazy ? 'lazy' : undefined} draggable={false} />
        </span>
    )
}
