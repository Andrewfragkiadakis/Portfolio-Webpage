'use client'

import { motion, useInView, useReducedMotion, type Variants } from 'motion/react'
import { useRef, type ReactNode, type MouseEventHandler } from 'react'
import { EASE_OUT } from '@/utils/motion'

/**
 * Round 5: every tile is neutral (white / near-black). `studio` is the one soft sweep
 * behind the hero showcase; the map tile paints itself.
 */
export type Tone = 'plain' | 'studio'

/** Delay between neighbouring tiles as a bento reveals. */
const TILE_STAGGER = 0.05

/** Tiles rise on a soft spring (a touch of overshoot, no wobble); opacity eases separately. */
const TILE_IN: Variants = {
    hidden: { opacity: 0, scale: 0.94, y: 22 },
    visible: (index: number = 0) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            default: { type: 'spring', stiffness: 150, damping: 19, mass: 0.9, delay: index * TILE_STAGGER },
            opacity: { duration: 0.5, ease: EASE_OUT, delay: index * TILE_STAGGER },
        },
    }),
}

/** Reduced motion: tiles are simply there. */
const TILE_STILL: Variants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
}

export const toneClass = (tone: Tone) => (tone === 'plain' ? '' : `tile--${tone}`)

interface BentoProps {
    children: ReactNode
    className?: string
    /**
     * Drive the reveal explicitly (the hero waits for the intro overlay). When omitted,
     * the bento reveals the first time it scrolls into view.
     */
    play?: boolean
}

/**
 * One section = one bento. Children are Tiles; each passes its `index` so the reveal
 * staggers across the grid, and inherits the hidden → visible state from here.
 */
export function Bento({ children, className = '', play }: BentoProps) {
    const ref = useRef<HTMLDivElement>(null)
    // Ambient loops (the map pin's pulse) run only while this bento is on screen.
    const live = useInView(ref, { amount: 0.35 })
    const trigger = play === undefined
        ? { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.15 } }
        : { initial: 'hidden', animate: play ? 'visible' : 'hidden' }

    return (
        <motion.div ref={ref} data-live={live && play !== false} className={`bento ${className}`} {...trigger}>
            {children}
        </motion.div>
    )
}

interface TileBaseProps {
    children: ReactNode
    /** Placement and any extra utilities, e.g. `col-span-2 md:col-[1/8] md:row-[1/5]`. */
    className?: string
    tone?: Tone
    index?: number
}

function useTileVariants() {
    return useReducedMotion() ? TILE_STILL : TILE_IN
}

/** A static tile. Add `interactive` when it contains a `.tile-stretch` button. */
export function Tile({ children, className = '', tone = 'plain', index = 0, interactive = false, as = 'div', id, labelledBy }: TileBaseProps & {
    interactive?: boolean
    as?: 'div' | 'article' | 'header'
    id?: string
    labelledBy?: string
}) {
    const variants = useTileVariants()
    const Comp = as === 'article' ? motion.article : as === 'header' ? motion.header : motion.div
    return (
        <Comp
            id={id}
            aria-labelledby={labelledBy}
            variants={variants}
            custom={index}
            className={`tile ${toneClass(tone)} ${interactive ? 'tile--interactive group' : ''} ${className}`}
        >
            {children}
        </Comp>
    )
}

/** A whole tile that is one link. */
export function TileLink({ children, className = '', tone = 'plain', index = 0, href, label, external = true, download = false }: TileBaseProps & {
    href: string
    label?: string
    external?: boolean
    download?: boolean
}) {
    const variants = useTileVariants()
    return (
        <motion.a
            href={href}
            aria-label={label}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...(download ? { download: true } : {})}
            variants={variants}
            custom={index}
            className={`tile tile--interactive group ${toneClass(tone)} ${className}`}
        >
            {children}
        </motion.a>
    )
}

/** A whole tile that is one button (opens a dialog, scrolls to a section…). */
export function TileButton({ children, className = '', tone = 'plain', index = 0, onClick, label }: TileBaseProps & {
    onClick: MouseEventHandler<HTMLButtonElement>
    label?: string
}) {
    const variants = useTileVariants()
    return (
        <motion.button
            type="button"
            onClick={onClick}
            aria-label={label}
            variants={variants}
            custom={index}
            className={`tile tile--interactive group ${toneClass(tone)} ${className}`}
        >
            {children}
        </motion.button>
    )
}

/**
 * Section opener tile: zero-padded index and eyebrow on top (the same label row every
 * tile has), a solid display title at the foot. Carries the section id so navigation and
 * smooth-scroll can find it.
 */
export function SectionTile({ id, number, title, eyebrow, className = '', children, index = 0 }: {
    id: string
    number: number
    title: string
    eyebrow?: string
    className?: string
    children?: ReactNode
    index?: number
}) {
    return (
        <Tile as="header" id={id} index={index} className={`justify-between gap-3 ${className}`}>
            <div className="tile-head">
                <p className="t-label flex items-center gap-2 min-w-0">
                    <span className="text-[var(--accent)] tabular-nums">{String(number).padStart(2, '0')}</span>
                    <span aria-hidden="true">/</span>
                    {eyebrow && <span className="el-caps truncate">{eyebrow.replace(/^\/\/\s*/, '')}</span>}
                </p>
            </div>
            <div>
                <h2 id={`${id}-title`} className="display uppercase text-[clamp(2rem,9vw,3rem)] md:text-[min(3.4vw,5.6vh)] break-words">
                    {title}
                </h2>
                {children}
            </div>
        </Tile>
    )
}

/**
 * The label row every tile opens with: a small uppercase label on the left and, on the
 * right, the tile's one control (an "i" hotspot, a "+" or an arrow). Same height, same
 * position, on every tile.
 */
export function TileHead({ label, children, className = '' }: { label?: ReactNode; children?: ReactNode; className?: string }) {
    return (
        <div className={`tile-head ${className}`}>
            {label ? <p className="t-label el-caps min-w-0 truncate">{label}</p> : <span />}
            {children}
        </div>
    )
}

/** Key figure + caption at the foot of a tile: the one place the accent colours a number. */
export function Figure({ value, caption, className = '' }: { value: ReactNode; caption?: ReactNode; className?: string }) {
    return (
        <div className={`mt-auto ${className}`}>
            <p className="t-value">{value}</p>
            {caption && <p className="t-caption mt-1.5">{caption}</p>}
        </div>
    )
}
