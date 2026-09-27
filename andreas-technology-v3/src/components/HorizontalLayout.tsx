import { useEffect, useRef, useState, Suspense, useCallback, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useVelocity, useMotionValue, animate, useReducedMotion, type MotionValue } from 'motion/react'
import HeroOverlay from '@/components/dom/HeroOverlay'
import About from '@/components/dom/About'
import Services from '@/components/dom/Services'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { SECTION_IDS, SECTION_STEPS, TRACK_HEIGHT_VH, TRACK_TRAVEL_VW } from '@/data/sections'
import { useDesktopActions, useDesktopState } from '@/contexts/DesktopContext'
import { useOverviewGeometry, type SpaceSlot } from '@/components/ui/overview'
import { readActiveSection } from '@/hooks/useActiveSection'
import { scrollToSection } from '@/utils/smooth-scroll'

const loadExperience = () => import('@/components/dom/Experience')
const loadProjects = () => import('@/components/dom/Projects')
const loadContact = () => import('@/components/dom/Contact')
const Experience = dynamic(loadExperience, { ssr: false })
const Projects = dynamic(loadProjects, { ssr: false })
const Contact = dynamic(loadContact, { ssr: false })
const DEFERRED_SECTIONS = 3
/** Desktop: let the Welcome window's opening spring play before the later spaces render. */
const DEFER_AFTER_REVEAL_MS = 900
// Desktop only, and never visible at load: fetched after hydration, never on phones.
const MissionControl = dynamic(() => import('@/components/ui/MissionControl'), { ssr: false })

/**
 * One space of the journey. In Mission Control it scales down into its slot of the
 * overview grid; `ov` (0 → 1) drives that, so the zoom is one spring for all six.
 * The transforms are written straight to motion values: no React render per frame.
 */
function Space({ index, ov, slot, children, onDesktopPointerDown }: { index: number; ov: MotionValue<number>; slot: SpaceSlot | null; children: ReactNode; onDesktopPointerDown: () => void }) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const scale = useMotionValue(1)
    const plate = useMotionValue(0)

    useEffect(() => {
        const apply = (o: number) => {
            if (!slot) {
                x.set(0); y.set(0); scale.set(1); plate.set(0)
                return
            }
            x.set(o * (slot.left - index * slot.W))
            y.set(o * slot.top)
            scale.set(1 - o * (1 - slot.s))
            plate.set(o)
        }
        apply(ov.get())
        return ov.on('change', apply)
    }, [ov, slot, index, x, y, scale, plate])

    return (
        <motion.div
            data-panel={index}
            // Clicking the bare desktop leaves no window key, like clicking the macOS desktop.
            onPointerDown={(e) => { if (e.target === e.currentTarget) onDesktopPointerDown() }}
            style={{ x, y, scale, transformOrigin: '0 0' }}
            className="relative isolate w-full max-w-2xl mx-auto overflow-x-clip md:max-w-none md:mx-0 md:h-screen md:w-screen md:flex-shrink-0 md:flex md:items-center md:justify-center md:overflow-hidden md:pt-[calc(var(--nav-h)+1rem)] md:pb-[calc(var(--dock-h)+0.25rem)] md:px-10 lg:px-14"
        >
            {slot && (
                <motion.div
                    aria-hidden="true"
                    className="os-space-plate"
                    style={{ opacity: plate, borderRadius: 12 / slot.s, '--plate-ring': `${1.5 / slot.s}px` } as React.ComponentProps<typeof motion.div>['style']}
                />
            )}
            {children}
        </motion.div>
    )
}

/** Holds a space's place; with an `id` it is also a travel target until the window renders. */
function SectionFallback({ id }: { id?: string }) {
    return <div id={id} className="min-h-screen w-full flex items-center justify-center bg-transparent" aria-hidden />
}

/** Stop settling the scroll once it is this close to a section boundary (in progress units). */
const SNAP_DEADZONE = 0.004
/** Treat the scroll as "still moving" above this velocity, so we never fight the user. */
const SNAP_VELOCITY_CEILING = 0.08
/** Quiet period after the last scroll event before we settle. */
const SNAP_IDLE_MS = 140

export default function HorizontalLayout() {
    const targetRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const isDesktop = useIsDesktop()
    const { focus } = useDesktopActions()
    const overview = useDesktopState((s) => s.overview)
    const prefersReducedMotion = useReducedMotion()
    const geo = useOverviewGeometry(isDesktop === true)

    // Mission Control: 0 = the journey, 1 = every space in its overview slot.
    const ov = useMotionValue(0)
    useEffect(() => {
        const controls = animate(ov, overview ? 1 : 0, prefersReducedMotion ? { duration: 0 } : { type: 'spring', visualDuration: 0.42, bounce: 0.08 })
        return () => controls.stop()
    }, [overview, ov, prefersReducedMotion])

    const { scrollYProgress } = useScroll({ target: targetRef })

    // Gate for the scroll-linked transform. A motion value rather than a plain boolean
    // on purpose: swapping `style` between a motion value and a literal leaves the last
    // transform stuck on the element, so a desktop→mobile resize would strand the
    // vertical stack off-screen. One stable binding whose output collapses to zero
    // avoids that entirely.
    const trackGate = useMotionValue(0)

    useEffect(() => {
        trackGate.set(isDesktop ? 1 : 0)
    }, [isDesktop, trackGate])

    // In Mission Control the track returns to its origin (ov → 1) so the spaces can lay
    // themselves out in a grid from known positions.
    const x = useTransform(
        [scrollYProgress, trackGate, ov],
        ([progress, gate, o]: number[]) => `${-progress * gate * (1 - o) * TRACK_TRAVEL_VW}vw`
    )


    const clearFocus = useCallback(() => focus(null), [focus])

    // The three later spaces (Experience, Projects, Contact) are client-only. Their code
    // starts downloading at once, but they render one per idle period, after the
    // Welcome window has opened on desktop: rendering all three straight after
    // hydration was ~250 ms of main thread (4x CPU) that stalled the opening spring
    // and the first scroll on phones. Any travel (scroll, Mission Control) renders
    // whatever is left immediately.
    const [deferred, setDeferred] = useState(0)
    useEffect(() => {
        loadExperience(); loadProjects(); loadContact()
    }, [])
    useEffect(() => {
        if (deferred >= DEFERRED_SECTIONS || isDesktop === null) return
        let idleId: number | undefined
        const next = () => setDeferred((n) => n + 1)
        const timer = window.setTimeout(() => {
            idleId = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(next, { timeout: 1000 }) : window.setTimeout(next, 50)
        }, deferred === 0 && isDesktop ? DEFER_AFTER_REVEAL_MS : 0)
        const all = () => setDeferred(DEFERRED_SECTIONS)
        window.addEventListener('scroll', all, { passive: true, once: true })
        return () => {
            window.clearTimeout(timer)
            if (idleId !== undefined) {
                if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId)
                else window.clearTimeout(idleId)
            }
            window.removeEventListener('scroll', all)
        }
    }, [deferred, isDesktop])
    const rendered = overview ? DEFERRED_SECTIONS : deferred

    // Release the deferred tool logos (see `data-logos` in globals.css) once the page
    // has loaded and the main thread is idle, or as soon as the visitor scrolls.
    useEffect(() => {
        const root = document.documentElement
        if (root.dataset.logos !== 'wait') return
        let idleId: number | undefined
        const release = () => {
            delete root.dataset.logos
            window.removeEventListener('scroll', release)
        }
        const whenIdle = () => {
            idleId = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(release, { timeout: 1500 }) : window.setTimeout(release, 300)
        }
        if (document.readyState === 'complete') whenIdle()
        else window.addEventListener('load', whenIdle, { once: true })
        window.addEventListener('scroll', release, { passive: true, once: true })
        return () => {
            window.removeEventListener('load', whenIdle)
            window.removeEventListener('scroll', release)
            if (idleId !== undefined) {
                if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId)
                else window.clearTimeout(idleId)
            }
        }
    }, [])

    const velocity = useVelocity(scrollYProgress)
    // A ref, not state: the snap guard is read inside listeners and must never
    // re-render the whole track mid-animation.
    const isSnappingRef = useRef(false)

    const setSnapping = useCallback((value: boolean) => {
        isSnappingRef.current = value
    }, [])

    // Settle to the nearest section once the user stops scrolling.
    useEffect(() => {
        if (!isDesktop || prefersReducedMotion) return

        let idleTimer: ReturnType<typeof setTimeout>

        const handleScroll = () => {
            if (isSnappingRef.current) return

            clearTimeout(idleTimer)
            idleTimer = setTimeout(() => {
                if (isSnappingRef.current) return
                if (Math.abs(velocity.get()) > SNAP_VELOCITY_CEILING) return

                const progress = scrollYProgress.get()
                const nearest = Math.round(progress * SECTION_STEPS) / SECTION_STEPS
                if (Math.abs(progress - nearest) <= SNAP_DEADZONE) return

                setSnapping(true)
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight

                animate(window.scrollY, nearest * maxScroll, {
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    onUpdate: (latest) => window.scrollTo({ top: latest }),
                }).then(() => {
                    setTimeout(() => setSnapping(false), 120)
                })
            }, SNAP_IDLE_MS)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
            clearTimeout(idleTimer)
        }
    }, [isDesktop, prefersReducedMotion, scrollYProgress, velocity, setSnapping])

    // Keep the active section aligned when the viewport resizes.
    useEffect(() => {
        if (!isDesktop) return

        let resizeTimer: ReturnType<typeof setTimeout>

        const handleResize = () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => {
                const progress = scrollYProgress.get()
                const nearest = Math.round(progress * SECTION_STEPS) / SECTION_STEPS
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight
                window.scrollTo({ top: nearest * maxScroll })
            }, 150)
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(resizeTimer)
        }
    }, [isDesktop, scrollYProgress])

    // Keyboard travel: tabbing into a window on another space brings that space to the
    // front, instead of letting the browser scroll the clipped track sideways.
    useEffect(() => {
        const viewport = viewportRef.current
        if (!viewport || !isDesktop) return
        const onFocusIn = (e: FocusEvent) => {
            viewport.scrollLeft = 0
            const panel = (e.target as HTMLElement).closest<HTMLElement>('[data-panel]')
            const index = panel ? Number(panel.dataset.panel) : -1
            if (index < 0 || SECTION_IDS[index] === readActiveSection()) return
            scrollToSection(index, SECTION_IDS[index], 500)
        }
        viewport.addEventListener('focusin', onFocusIn)
        return () => viewport.removeEventListener('focusin', onFocusIn)
    }, [isDesktop])

    // Sections are declared once. The wrapper's CSS — not a second copy of the tree —
    // is what differs between the vertical stack and the horizontal journey.
    const sections = [
        <HeroOverlay key="hero" />,
        <About key="about" />,
        <Services key="services" />,
        <Suspense key="experience" fallback={<SectionFallback />}>{rendered > 0 ? <Experience /> : <SectionFallback id="experience" />}</Suspense>,
        <Suspense key="projects" fallback={<SectionFallback />}>{rendered > 1 ? <Projects /> : <SectionFallback id="projects" />}</Suspense>,
        <Suspense key="contact" fallback={<SectionFallback />}>{rendered > 2 ? <Contact /> : <SectionFallback id="contact" />}</Suspense>,
    ]

    return (
        <div
            ref={targetRef}
            className="relative md:h-[var(--track-height)]"
            style={{ '--track-height': `${TRACK_HEIGHT_VH}vh` } as React.CSSProperties}
        >
            {/*
              Desktop: the wallpaper stays put while the windows slide past, like swiping
              between desktop spaces. Mobile: a stack of app cards, clear of the status
              bar at the top and the dock at the bottom.
            */}
            <div ref={viewportRef} inert={overview || undefined} className="md:sticky md:top-0 md:left-0 md:flex md:h-screen md:w-full md:items-center md:overflow-hidden">
                {geo && <motion.div aria-hidden="true" className="os-mc-dim" style={{ opacity: ov }} />}
                <motion.div
                    style={{ x }}
                    className="flex flex-col gap-5 px-3 sm:px-6 pt-[calc(var(--nav-h)+0.75rem)] pb-32 md:p-0 md:flex-row md:gap-0 md:h-screen md:items-center md:will-change-transform"
                >
                    {/*
                      Panels use overflow-x-clip rather than overflow-hidden: it contains the
                      entry animations without creating a scroll container, which would break
                      the sticky positioning the desktop track relies on.
                    */}
                    {sections.map((section, index) => (
                        <Space key={index} index={index} ov={ov} slot={geo?.[index] ?? null} onDesktopPointerDown={clearFocus}>
                            {section}
                        </Space>
                    ))}
                </motion.div>
            </div>
            {geo && <MissionControl geo={geo} />}
        </div>
    )
}
