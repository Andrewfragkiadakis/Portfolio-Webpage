'use client'

import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import { useDesktopActions, useDesktopState } from '@/contexts/DesktopContext'
import { SECTION_IDS } from '@/data/sections'
import type { AppId, WindowId } from '@/data/apps'
import { RESUME_URL } from '@/data/content'
import AppIcon from '@/components/ui/AppIcon'

/** Icon size at rest, at the pointer, and how far (px) the magnification reaches either side. */
const BASE = 48
const PEAK = 72
const REACH = 150
/** Critically damped: follows the pointer closely and never overshoots, like the real Dock. */
const MAGNIFY_SPRING = { mass: 0.1, stiffness: 320, damping: 18 }

/** A cosine falloff: flat at the pointer, easing smoothly into the resting size. */
function magnified(distance: number): number {
    const d = Math.abs(distance)
    if (d >= REACH) return BASE
    return BASE + ((PEAK - BASE) * (Math.cos((Math.PI * d) / REACH) + 1)) / 2
}

interface DockItemProps {
    app: AppId
    label: string
    mouseX: MotionValue<number>
    /** Resting icon centres, measured once when the pointer enters the Dock. */
    centers: RefObject<Map<AppId, number>>
    running?: boolean
    children: (icon: ReactNode) => ReactNode
}

/**
 * One Dock icon. It grows with the pointer's distance, only while the pointer is over
 * the Dock (the platform behaviour), and bounces when its app is launched. Distances
 * come from cached resting centres, so a pointer move never reads layout.
 */
function DockItem({ app, label, mouseX, centers, running, children }: DockItemProps) {
    const reduceMotion = useReducedMotion()
    const bounceN = useDesktopState((s) => (s.bounce?.app === app ? s.bounce.n : 0))
    const lift = useMotionValue(0)

    const target = useTransform(mouseX, (x) => {
        const c = centers.current?.get(app)
        return c == null || !Number.isFinite(x) ? BASE : magnified(x - c)
    })
    const spring = useSpring(target, MAGNIFY_SPRING)
    const size = reduceMotion ? BASE : spring

    useEffect(() => {
        if (!bounceN || reduceMotion) return
        // The launch bounce: two hops, the second smaller, gravity on the way down.
        const controls = animate(lift, [0, -22, 0, -10, 0], {
            duration: 0.95,
            times: [0, 0.26, 0.52, 0.74, 1],
            ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn'],
        })
        return () => controls.stop()
    }, [bounceN, lift, reduceMotion])

    const icon = (
        <>
            <motion.div data-dock-app={app} className="os-dock-icon relative" style={{ width: size, height: size, y: lift }}>
                <AppIcon app={app} size="100%" />
            </motion.div>
            <span className="os-dock-label" aria-hidden="true">{label}</span>
        </>
    )

    return (
        <li className="relative flex flex-col items-center justify-end h-full">
            {children(icon)}
            <span className={`os-dock-dot ${running ? 'is-running' : ''}`} aria-hidden="true" />
        </li>
    )
}

const ITEM = 'os-dock-item relative flex items-end justify-center'

/** A window's app in the Dock: subscribes only to its own running state. */
function WindowApp({ id, label, mouseX, centers }: { id: WindowId; label: string; mouseX: MotionValue<number>; centers: RefObject<Map<AppId, number>> }) {
    const { launch } = useDesktopActions()
    const running = useDesktopState((s) => s.status[id] !== 'closed')
    const current = useDesktopState((s) => s.active === id)
    return (
        <DockItem app={id} label={label} mouseX={mouseX} centers={centers} running={running}>
            {(icon) => (
                <button type="button" onClick={() => launch(id)} aria-label={label} aria-current={current ? 'true' : undefined} className={ITEM}>
                    {icon}
                </button>
            )}
        </DockItem>
    )
}

/** Desktop Dock: the six section apps and Terminal, then GitHub, LinkedIn and the résumé. */
export default function Dock() {
    const t = useContent()
    const mouseX = useMotionValue(Infinity)
    const centers = useRef(new Map<AppId, number>())
    const listRef = useRef<HTMLUListElement>(null)
    const leftAt = useRef(0)

    // Measure the resting centres once per visit of the pointer (the Dock only moves
    // when the viewport does). A quick re-entry keeps the previous resting values.
    const measure = () => {
        if (centers.current.size && performance.now() - leftAt.current < 400) return
        listRef.current?.querySelectorAll<HTMLElement>('[data-dock-app]').forEach((el) => {
            const r = el.getBoundingClientRect()
            centers.current.set(el.dataset.dockApp as AppId, r.left + r.width / 2)
        })
    }

    useEffect(() => {
        const reset = () => centers.current.clear()
        window.addEventListener('resize', reset)
        return () => window.removeEventListener('resize', reset)
    }, [])

    return (
        <nav aria-label="Dock" className="hidden md:block fixed bottom-1.5 left-1/2 -translate-x-1/2 z-50">
            <ul
                ref={listRef}
                data-dock
                className="os-dock flex items-end gap-1 h-[3.875rem] px-1.5 pb-[0.4375rem]"
                onPointerEnter={(e) => { if (e.pointerType !== 'touch') measure() }}
                onPointerMove={(e) => { if (e.pointerType !== 'touch') mouseX.set(e.clientX) }}
                onPointerLeave={() => { leftAt.current = performance.now(); mouseX.set(Infinity) }}
            >
                {SECTION_IDS.map((id) => <WindowApp key={id} id={id} label={t.os.menus[id]} mouseX={mouseX} centers={centers} />)}
                <WindowApp id="terminal" label={t.os.apps.terminal} mouseX={mouseX} centers={centers} />

                <li className="os-dock-divider" aria-hidden="true" />

                <DockItem app="github" label={t.os.desktop.github} mouseX={mouseX} centers={centers}>
                    {(icon) => (
                        <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub profile (${t.os.aria.newTab})`} className={ITEM}>
                            {icon}
                        </a>
                    )}
                </DockItem>
                <DockItem app="linkedin" label={t.os.desktop.linkedin} mouseX={mouseX} centers={centers}>
                    {(icon) => (
                        <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn profile (${t.os.aria.newTab})`} className={ITEM}>
                            {icon}
                        </a>
                    )}
                </DockItem>
                <DockItem app="resume" label={t.os.desktop.resume} mouseX={mouseX} centers={centers}>
                    {(icon) => (
                        <a href={RESUME_URL} download aria-label={t.os.aria.resume} className={ITEM}>
                            {icon}
                        </a>
                    )}
                </DockItem>
            </ul>
        </nav>
    )
}
