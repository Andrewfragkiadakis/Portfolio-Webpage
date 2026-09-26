'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'
import type { AppTile as AppTileData } from '@/data/apps'

/** Gradient app tile with a white glyph. Decorative: callers supply the accessible name. */
export function AppTile({ app, size = 'md', className = '' }: { app: AppTileData; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
    const box = {
        xs: 'w-5 h-5 text-[0.55rem]',
        sm: 'w-7 h-7 text-xs',
        md: 'w-11 h-11 text-lg',
        lg: 'w-13 h-13 text-2xl',
        xl: 'w-16 h-16 text-[1.75rem]',
    }[size]
    return (
        <span className={`app-tile ${box} ${className}`} style={{ background: app.tile }} aria-hidden="true">
            <i className={app.icon} />
        </span>
    )
}

/** The three window controls. Decorative on section windows (a window cannot be closed there). */
export function TrafficLights({ className = '' }: { className?: string }) {
    return (
        <span className={`os-lights ${className}`} aria-hidden="true">
            <span className="os-light os-light--close" />
            <span className="os-light os-light--min" />
            <span className="os-light os-light--max" />
        </span>
    )
}

interface WindowProps {
    /** Title bar text, e.g. "About.app". */
    title: string
    /** App tile shown beside the title on small screens, where the traffic lights are hidden. */
    app?: AppTileData
    /** Controls on the right of the title bar (view switchers, arrows, a send button). */
    toolbar?: ReactNode
    /** Optional status bar pinned to the bottom of the window. */
    footer?: ReactNode
    children: ReactNode
    className?: string
    bodyClassName?: string
    /** Section element props: anchor id and the heading that names it. */
    id?: string
    labelledBy?: string
    as?: 'section' | 'div'
    variant?: 'glass' | 'terminal'
    /** Seconds before the window opens. */
    delay?: number
    /**
     * When set, the window opens as soon as this is true (used by the hero, which must
     * wait for the intro overlay). Otherwise it opens when scrolled into view.
     */
    play?: boolean
}

/**
 * A desktop-OS window: title bar with traffic lights, glass body, optional status bar.
 * It "opens" from below — the direction of the dock — with a scale and fade, and does
 * nothing at all for visitors who prefer reduced motion.
 */
export default function Window({
    title,
    app,
    toolbar,
    footer,
    children,
    className = '',
    bodyClassName = '',
    id,
    labelledBy,
    as = 'div',
    variant = 'glass',
    delay = 0,
    play,
}: WindowProps) {
    const reduceMotion = useReducedMotion()
    const Root = as === 'section' ? motion.section : motion.div

    const closed = { opacity: 0, scale: 0.9, y: 56 }
    const open = { opacity: 1, scale: 1, y: 0 }
    const transition = { duration: 0.7, ease: EASE_OUT, delay }

    const motionProps = reduceMotion
        ? { initial: false as const }
        : play === undefined
            ? { initial: closed, whileInView: open, viewport: { once: true, amount: 0.2 }, transition }
            : { initial: closed, animate: play ? open : closed, transition }

    return (
        <Root
            id={id}
            aria-labelledby={labelledBy}
            {...motionProps}
            style={{ transformOrigin: '50% 100%' }}
            className={`os-window ${variant === 'terminal' ? 'os-terminal' : 'os-glass'} ${className}`}
        >
            <div className="os-titlebar flex flex-wrap items-center gap-x-3 gap-y-2 md:grid md:grid-cols-[1fr_auto_1fr]">
                <TrafficLights className="hidden md:flex" />
                <div className="flex items-center gap-2 min-w-0 md:justify-center">
                    {app && <AppTile app={app} size="xs" className="md:hidden" />}
                    <span className="os-title">{title}</span>
                </div>
                <div className="ml-auto md:ml-0 flex items-center gap-2 md:justify-self-end">{toolbar}</div>
            </div>
            <div className={`relative flex-1 min-h-0 ${bodyClassName}`}>{children}</div>
            {footer && <div className="os-statusbar">{footer}</div>}
        </Root>
    )
}
