'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, type AnimationPlaybackControls, type Variants } from 'motion/react'
import { useDesktopActions, useDesktopState, type WindowStatus } from '@/contexts/DesktopContext'
import { useContent } from '@/hooks/useContent'
import AppIcon from '@/components/ui/AppIcon'
import type { AppId, WindowId } from '@/data/apps'
import { WINDOW_SPRING } from '@/utils/motion'

/* ─── Traffic lights ──────────────────────────────────────────────────── */

interface TrafficLightsProps {
    /** Accessible names; when omitted the lights are decorative. */
    labels?: { close: string; minimize: string; zoom: string }
    onClose?: () => void
    onMinimize?: () => void
    onZoom?: () => void
    className?: string
    closeRef?: React.Ref<HTMLButtonElement>
}

/**
 * Close, minimise and zoom. Real buttons with names when handlers are given; the ×, −
 * and + glyphs appear when the pointer is over the group (or a light has keyboard focus).
 */
export function TrafficLights({ labels, onClose, onMinimize, onZoom, className = '', closeRef }: TrafficLightsProps) {
    const lights: { kind: 'close' | 'min' | 'max'; label?: string; onClick?: () => void; glyph: ReactNode }[] = [
        { kind: 'close', label: labels?.close, onClick: onClose, glyph: <path d="M3.4 3.4l5.2 5.2M8.6 3.4 3.4 8.6" /> },
        { kind: 'min', label: labels?.minimize, onClick: onMinimize, glyph: <path d="M2.8 6h6.4" /> },
        { kind: 'max', label: labels?.zoom, onClick: onZoom, glyph: <path d="M6 2.9v6.2M2.9 6h6.2" /> },
    ]
    return (
        <span className={`os-lights ${className}`} data-no-drag>
            {lights.map((light) => {
                const inner = (
                    <span className={`os-light os-light--${light.kind}`}>
                        <svg viewBox="0 0 12 12" className="os-light__glyph" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
                            {light.glyph}
                        </svg>
                    </span>
                )
                return light.onClick ? (
                    <button
                        key={light.kind}
                        ref={light.kind === 'close' ? closeRef : undefined}
                        type="button"
                        className="os-light-btn"
                        aria-label={light.label}
                        onClick={light.onClick}
                    >
                        {inner}
                    </button>
                ) : (
                    <span key={light.kind} className="os-light-btn" aria-hidden="true">{inner}</span>
                )
            })}
        </span>
    )
}

/* ─── Geometry helpers ───────────────────────────────────────────────── */

interface Box { left: number; top: number; w: number; h: number }

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

/** The visible desktop of the window's space: below the menu bar, above the Dock, inside its panel. */
function desktopArea(frame: HTMLElement) {
    const panel = (frame.closest('[data-panel]') as HTMLElement | null) ?? document.body
    const p = panel.getBoundingClientRect()
    const menuBottom = document.querySelector('[data-menubar]')?.getBoundingClientRect().bottom ?? 24
    const dockTop = document.querySelector('[data-dock]')?.getBoundingClientRect().top ?? window.innerHeight
    return {
        left: Math.max(p.left, 0) + 10,
        right: Math.min(p.right, window.innerWidth) - 10,
        top: menuBottom + 8,
        bottom: Math.min(window.innerHeight, dockTop) - 8,
    }
}

/** Genie-ish minimise: where the window's bottom edge has to travel, and how small it gets. */
interface Genie { dx: number; dy: number; sx: number; sy: number; from: 'none' | 'minimized' | 'closed' }

/** What the variants receive: the genie path plus the reveal delay and the reduced-motion switch. */
type VariantInput = Genie & { delay: number; reduce: boolean }

const INSTANT = { duration: 0 } as const

const preventSelect = (e: Event) => e.preventDefault()

function genieTo(frame: HTMLElement, app: AppId): Omit<Genie, 'from'> {
    const r = frame.getBoundingClientRect()
    const target = document.querySelector(`[data-dock-app="${app}"]`)?.getBoundingClientRect()
    const tx = target ? target.left + target.width / 2 : window.innerWidth / 2
    const ty = target ? target.top + target.height * 0.85 : window.innerHeight
    const size = target?.width ?? 48
    return {
        dx: tx - (r.left + r.width / 2),
        dy: ty - r.bottom,
        sx: Math.max(size / r.width, 0.02),
        sy: Math.max(size / r.height, 0.02),
    }
}

const GENIE_EASE = [0.5, 0, 0.25, 1] as const
const GENIE_EASE_BACK = [0.75, 0, 0.5, 1] as const

const VARIANTS: Variants = {
    hidden: { opacity: 0, scale: 0.92, x: 0, y: 0, scaleX: 1, scaleY: 1 },
    open: (g: VariantInput) =>
        g.from === 'minimized' && !g.reduce
            ? {
                // Out of the Dock: the reverse path of the minimise.
                opacity: [0, 1, 1],
                x: [g.dx, g.dx * 0.5, 0],
                y: [g.dy, g.dy * 0.82, 0],
                scaleX: [g.sx, 0.5, 1],
                scaleY: [g.sy, 0.3, 1],
                scale: 1,
                transition: { duration: 0.5, ease: GENIE_EASE_BACK, times: [0, 0.55, 1] },
            }
            : { opacity: 1, scale: 1, x: 0, y: 0, scaleX: 1, scaleY: 1, transition: g.reduce ? INSTANT : { ...WINDOW_SPRING, delay: g.delay } },
    minimized: (g: VariantInput) =>
        g.reduce
            ? { opacity: 0, transition: INSTANT }
            : {
                // Into the Dock: the width pinches toward the icon first, then the window pours down.
                opacity: [1, 1, 0],
                x: [0, g.dx * 0.5, g.dx],
                y: [0, g.dy * 0.18, g.dy],
                scaleX: [1, 0.5, g.sx],
                scaleY: [1, 0.7, g.sy],
                transition: { duration: 0.52, ease: GENIE_EASE, times: [0, 0.45, 1] },
            },
    closed: (g: VariantInput) => ({ opacity: 0, scale: 0.96, transition: g.reduce ? INSTANT : { duration: 0.16, ease: 'easeOut' } }),
}

/* ─── Window ─────────────────────────────────────────────────────────── */

interface WindowProps {
    /** Managed window id: enables dragging, z-order, key state and the traffic lights. */
    wid: WindowId
    /** Title bar text, e.g. "About.app". */
    title: string
    /** Second line under a unified title, e.g. "6 items". */
    subtitle?: ReactNode
    /** App whose icon stands for this window (Dock target, mobile title bar, hints). */
    app: AppId
    /** Controls on the right of the title bar. */
    toolbar?: ReactNode
    /** Full-height vibrancy sidebar on desktop (the traffic lights sit on it); stacked on phones. */
    sidebar?: ReactNode
    sidebarWidth?: string
    /** Status bar pinned to the bottom of the main pane. */
    footer?: ReactNode
    children: ReactNode
    /** Layout classes for the window frame (width, max sizes, grid placement). */
    className?: string
    bodyClassName?: string
    /** Anchor id of the section this window is (used by navigation). */
    anchor?: string
    labelledBy?: string
    as?: 'section' | 'div'
    variant?: 'standard' | 'terminal'
    /** 'unified': Big Sur toolbar with a left-aligned bold title. 'compact': a 28px centred title bar. */
    chrome?: 'unified' | 'compact'
    /** Seconds before the window opens. */
    delay?: number
    /** When set, the window opens as soon as this is true; otherwise when scrolled into view. */
    play?: boolean
}

/**
 * A macOS-style window. On desktop (≥64rem with a fine pointer) it can be dragged by its
 * title bar inside the visible desktop of its space, raised by a click, zoomed with the
 * green light or a double-click, minimised into its Dock icon and closed to the Dock.
 * On phones it is a plain stacked sheet with no window controls.
 */
export default function Window({
    wid,
    title,
    subtitle,
    app,
    toolbar,
    sidebar,
    sidebarWidth = '13.5rem',
    footer,
    children,
    className = '',
    bodyClassName = '',
    anchor,
    labelledBy,
    as = 'div',
    variant = 'standard',
    chrome = 'unified',
    delay = 0,
    play,
}: WindowProps) {
    const t = useContent()
    // Only this window's slice of the window manager: focusing another window re-renders
    // two frames (the old and the new key window), never the content inside them.
    const { register, focus, setStatus, setZoomed } = useDesktopActions()
    const isDesktop = useDesktopState((s) => s.isDesktop)
    const isKey = useDesktopState((s) => s.keyId === wid)
    const z = useDesktopState((s) => 10 + Math.max(0, s.stack.indexOf(wid)))
    const layoutEpoch = useDesktopState((s) => s.layoutEpoch)
    const status: WindowStatus = useDesktopState((s) => s.status[wid])
    const statusN = useDesktopState((s) => s.statusCount[wid])
    const zoomed = useDesktopState((s) => s.zoomed[wid])
    const reduceMotion = useReducedMotion()

    const frameRef = useRef<HTMLDivElement>(null)
    const windowRef = useRef<HTMLElement>(null)
    const reopenRef = useRef<HTMLButtonElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const inView = useInView(frameRef, { once: true, amount: 0.2 })
    const revealed = play ?? inView

    const [genie, setGenie] = useState<Genie>({ dx: 0, dy: 0, sx: 0.1, sy: 0.1, from: 'none' })
    const [settled, setSettled] = useState<string | null>(null)
    const hiddenSettled = status !== 'open' && settled === `${status}:${statusN}`

    const zoomAnim = useRef<AnimationPlaybackControls | null>(null)
    const preZoom = useRef({ x: 0, y: 0 })
    const drag = useRef<{ id: number; sx: number; sy: number; ox: number; oy: number; minX: number; maxX: number; minY: number; maxY: number } | null>(null)

    const managed = isDesktop === true
    // Phones get no window animations: the sheets are simply there. The server HTML is
    // kept visible on small screens by CSS (see `.os-win` in globals.css), so the first
    // paint shows the content instead of waiting for JavaScript to reveal it.
    const phone = isDesktop === false

    /* Frame size helpers for zoom. */
    const setSize = (el: HTMLElement, w?: number, h?: number) => {
        el.style.width = w == null ? '' : `${w}px`
        el.style.height = h == null ? '' : `${h}px`
        el.style.maxWidth = w == null ? '' : 'none'
        el.style.maxHeight = h == null ? '' : 'none'
    }

    const toggleZoom = useCallback(() => {
        const el = frameRef.current
        if (!el || !managed) return
        zoomAnim.current?.stop()
        const cur = el.getBoundingClientRect()
        const layoutAt = (w?: number, h?: number): Box => {
            setSize(el, w, h)
            const r = el.getBoundingClientRect()
            return { left: r.left - x.get(), top: r.top - y.get(), w: r.width, h: r.height }
        }
        const natural = layoutAt()
        const zoomingIn = !zoomed
        let target: Box
        if (zoomingIn) {
            preZoom.current = { x: x.get(), y: y.get() }
            const a = desktopArea(el)
            target = { left: a.left, top: a.top, w: a.right - a.left, h: a.bottom - a.top }
        } else {
            target = { left: natural.left + preZoom.current.x, top: natural.top + preZoom.current.y, w: natural.w, h: natural.h }
        }
        // Where the layout puts the frame is linear in its size (start, centre or end
        // alignment), so two measurements are enough to steer it frame by frame.
        const big = layoutAt(zoomingIn ? target.w : cur.width, zoomingIn ? target.h : cur.height)
        const leftAt = (w: number) => (big.w === natural.w ? natural.left : natural.left + ((big.left - natural.left) * (w - natural.w)) / (big.w - natural.w))
        const topAt = (h: number) => (big.h === natural.h ? natural.top : natural.top + ((big.top - natural.top) * (h - natural.h)) / (big.h - natural.h))
        const apply = (p: number) => {
            const w = lerp(cur.width, target.w, p)
            const h = lerp(cur.height, target.h, p)
            setSize(el, w, h)
            x.set(lerp(cur.left, target.left, p) - leftAt(w))
            y.set(lerp(cur.top, target.top, p) - topAt(h))
        }
        const finish = () => {
            if (zoomingIn) apply(1)
            else {
                setSize(el)
                x.set(preZoom.current.x)
                y.set(preZoom.current.y)
            }
        }
        apply(0)
        setZoomed(wid, zoomingIn)
        focus(wid)
        if (reduceMotion) finish()
        else zoomAnim.current = animate(0, 1, { type: 'spring', visualDuration: 0.34, bounce: 0.06, onUpdate: apply, onComplete: finish })
    }, [managed, zoomed, x, y, setZoomed, wid, focus, reduceMotion])

    const minimize = useCallback(() => {
        const el = frameRef.current
        if (!el) return
        setGenie({ ...genieTo(el, app), from: 'minimized' })
        setStatus(wid, 'minimized')
    }, [app, setStatus, wid])

    const close = useCallback(() => {
        setGenie((g) => ({ ...g, from: 'closed' }))
        setStatus(wid, 'closed')
    }, [setStatus, wid])

    const restore = useCallback(() => {
        const el = frameRef.current
        // Recompute the path: the Dock or the layout may have moved since.
        if (el && status === 'minimized') setGenie({ ...genieTo(el, app), from: 'minimized' })
        setStatus(wid, 'open')
        focus(wid)
    }, [app, focus, setStatus, status, wid])

    useEffect(() => register(wid, { minimize, close, restore, toggleZoom }), [register, wid, minimize, close, restore, toggleZoom])

    // Resize: every window goes home, un-zoomed.
    useEffect(() => {
        if (layoutEpoch === 0) return
        zoomAnim.current?.stop()
        const el = frameRef.current
        if (el) setSize(el)
        x.set(0)
        y.set(0)
        setZoomed(wid, false)
    }, [layoutEpoch, x, y, setZoomed, wid])

    // Leaving desktop: drop any zoom sizing so the stacked sheet lays out normally.
    useEffect(() => {
        if (isDesktop !== false) return
        const el = frameRef.current
        if (el) setSize(el)
        x.set(0)
        y.set(0)
    }, [isDesktop, x, y])

    // When the window has gone, move keyboard focus to the hint that can bring it back.
    useEffect(() => {
        if (!hiddenSettled) return
        const activeEl = document.activeElement
        if (!activeEl || activeEl === document.body || frameRef.current?.contains(activeEl)) {
            reopenRef.current?.focus({ preventScroll: true })
        }
    }, [hiddenSettled])

    /* ─── Dragging ─── */

    const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
        if (!managed || e.button !== 0 || e.pointerType === 'touch') return
        if (!window.matchMedia('(pointer: fine)').matches) return
        if ((e.target as Element).closest('button, a, input, textarea, select, [data-no-drag]')) return
        const el = frameRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const a = desktopArea(el)
        const ox = x.get()
        const oy = y.get()
        // Allowed offsets keep the whole window on the visible desktop; if it is already
        // partly outside (it never should be), it may only move back in.
        const minX = Math.min(ox + (a.left - r.left), ox)
        const maxX = Math.max(ox + (a.right - r.right), ox)
        const minY = Math.min(oy + (a.top - r.top), oy)
        const maxY = Math.max(oy + (a.bottom - r.bottom), oy)
        drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox, oy, minX, maxX, minY, maxY }
        e.currentTarget.setPointerCapture(e.pointerId)
        // Promote the window to its own compositor layer for the drag only: moving it is
        // then a transform on the GPU, with no repaint of the window or its shadow.
        el.classList.add('is-dragging')
        // No text selection may start mid-drag. A listener, not a class on <html>: a
        // root class would restyle all ~3000 elements at the start and end of each drag.
        document.addEventListener('selectstart', preventSelect)
        e.preventDefault()
    }

    const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
        const d = drag.current
        if (!d || d.id !== e.pointerId) return
        x.set(clamp(d.ox + e.clientX - d.sx, d.minX, d.maxX))
        y.set(clamp(d.oy + e.clientY - d.sy, d.minY, d.maxY))
    }

    const endDrag = (e: ReactPointerEvent<HTMLElement>) => {
        const d = drag.current
        if (!d || d.id !== e.pointerId) return
        drag.current = null
        if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
        frameRef.current?.classList.remove('is-dragging')
        document.removeEventListener('selectstart', preventSelect)
    }

    const onDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
        if ((e.target as Element).closest('button, a, input, [data-no-drag]')) return
        toggleZoom()
    }

    const dragHandlers = { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onDoubleClick }

    /* ─── Rendering ─── */

    const lightLabels = {
        close: `${t.os.windowActions.close} — ${title}`,
        minimize: `${t.os.windowActions.minimize} — ${title}`,
        zoom: `${t.os.windowActions.zoom} — ${title}`,
    }
    // In split windows the lights sit over the sidebar but stay first in the DOM, so
    // keyboard order is lights → title → toolbar → sidebar → content, as it reads.
    const lights = (
        <TrafficLights labels={lightLabels} onClose={close} onMinimize={minimize} onZoom={toggleZoom} className={`hidden md:flex ${sidebar ? 'os-lights--split' : ''}`} />
    )

    const titleBlock = (
        <div className={`flex items-center gap-2 min-w-0 ${chrome === 'compact' ? 'md:justify-center' : ''}`}>
            <AppIcon app={app} size={20} className="md:hidden" />
            <div className="min-w-0">
                <p className={`os-title ${chrome === 'compact' ? 'os-title--compact' : ''}`}>{title}</p>
                {subtitle && chrome === 'unified' && <p className="os-subtitle">{subtitle}</p>}
            </div>
        </div>
    )

    const titlebar = (
        <div
            className={`os-titlebar ${chrome === 'compact' ? 'os-titlebar--compact' : ''} ${sidebar ? 'os-titlebar--beside' : ''}`}
            {...dragHandlers}
        >
            {lights}
            {chrome === 'compact' ? (
                <>
                    {titleBlock}
                    <div className="hidden md:block" aria-hidden="true" />
                </>
            ) : (
                <>
                    {titleBlock}
                    <div className="ml-auto flex items-center gap-2" data-no-drag={toolbar ? true : undefined}>{toolbar}</div>
                </>
            )}
        </div>
    )

    const Root = (as === 'section' ? motion.section : motion.div) as typeof motion.div
    const animateTo = !revealed && !reduceMotion && !phone ? 'hidden' : status
    const hint = status === 'minimized' ? t.os.hidden.minimized : t.os.hidden.closed

    return (
        <motion.div
            ref={frameRef}
            data-window={wid}
            className={`os-frame relative flex flex-col ${className}`}
            style={{ x, y, zIndex: managed ? z : undefined }}
            // A hidden window never becomes key, even when its "Reopen" hint takes focus.
            onPointerDownCapture={managed && status === 'open' ? () => focus(wid) : undefined}
            onFocusCapture={managed && status === 'open' ? () => { if (!isKey) focus(wid) } : undefined}
        >
            <Root
                ref={windowRef as React.RefObject<HTMLDivElement>}
                id={anchor}
                aria-labelledby={labelledBy}
                tabIndex={-1}
                custom={{ ...genie, delay: genie.from === 'none' ? delay : 0, reduce: Boolean(reduceMotion) || phone } satisfies VariantInput}
                variants={VARIANTS}
                initial={reduceMotion ? false : 'hidden'}
                animate={animateTo}
                onAnimationComplete={(definition) => {
                    if (definition === 'minimized' || definition === 'closed') setSettled(`${definition}:${statusN}`)
                    if (definition === 'open' && genie.from !== 'none') setGenie((g) => ({ ...g, from: 'none' }))
                }}
                inert={hiddenSettled || undefined}
                style={{ transformOrigin: '50% 100%', visibility: hiddenSettled ? 'hidden' : undefined }}
                className={`os-win ${managed ? (isKey ? 'is-key' : 'is-inactive') : 'is-key'} ${zoomed ? 'is-zoomed' : ''} flex flex-col flex-1 min-h-0 outline-none`}
            >
                {/* The surface clips the content; the frame around it carries the key-window
                    shadow on a pseudo-element that only fades its opacity (no shadow repaint). */}
                <div className={`os-window ${variant === 'terminal' ? 'os-window--terminal' : ''} flex-1 min-h-0`}>
                {sidebar ? (
                    <div className="os-split flex-1 min-h-0" style={{ '--sidebar-w': sidebarWidth } as React.CSSProperties}>
                        <div className="os-split__title">{titlebar}</div>
                        <aside className="os-sidebar os-split__side">
                            <div className="os-sidebar__top hidden md:flex" {...dragHandlers} />
                            {sidebar}
                        </aside>
                        <div className={`os-split__body relative min-h-0 ${bodyClassName}`}>{children}</div>
                        {footer && <div className="os-split__foot os-statusbar">{footer}</div>}
                    </div>
                ) : (
                    <>
                        {titlebar}
                        <div className={`relative flex-1 min-h-0 ${bodyClassName}`}>{children}</div>
                        {footer && <div className="os-statusbar">{footer}</div>}
                    </>
                )}
                </div>
            </Root>

            {hiddenSettled && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                    <div className="os-hud pointer-events-auto flex flex-col items-center gap-3 px-6 py-5 text-center max-w-[20rem]">
                        <AppIcon app={app} size={52} />
                        <p className="text-[13px] font-medium leading-snug">{hint.replace('{app}', title)}</p>
                        <button
                            ref={reopenRef}
                            type="button"
                            onClick={() => {
                                restore()
                                requestAnimationFrame(() => windowRef.current?.focus({ preventScroll: true }))
                            }}
                            className="os-btn os-btn--primary h-7 px-4 text-[13px]">
                            {t.os.hidden.reopen}
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}
