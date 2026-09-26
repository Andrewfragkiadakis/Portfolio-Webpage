import { useEffect, useRef, Suspense, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useVelocity, useMotionValue, animate, useReducedMotion } from 'motion/react'
import HeroOverlay from '@/components/dom/HeroOverlay'
import About from '@/components/dom/About'
import Services from '@/components/dom/Services'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { SECTION_IDS, SECTION_STEPS, TRACK_HEIGHT_VH, TRACK_TRAVEL_VW } from '@/data/sections'
import { useDesktop } from '@/contexts/DesktopContext'
import { readActiveSection } from '@/hooks/useActiveSection'
import { scrollToSection } from '@/utils/smooth-scroll'

const Experience = dynamic(() => import('@/components/dom/Experience'), { ssr: false })
const Projects = dynamic(() => import('@/components/dom/Projects'), { ssr: false })
const Contact = dynamic(() => import('@/components/dom/Contact'), { ssr: false })

function SectionFallback() {
    return <div className="min-h-screen w-full flex items-center justify-center bg-transparent" aria-hidden />
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
    const { focus } = useDesktop()
    const prefersReducedMotion = useReducedMotion()

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

    const x = useTransform(
        [scrollYProgress, trackGate],
        ([progress, gate]: number[]) => `${-progress * gate * TRACK_TRAVEL_VW}vw`
    )

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
        <Suspense key="experience" fallback={<SectionFallback />}><Experience /></Suspense>,
        <Suspense key="projects" fallback={<SectionFallback />}><Projects /></Suspense>,
        <Suspense key="contact" fallback={<SectionFallback />}><Contact /></Suspense>,
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
            <div ref={viewportRef} className="md:sticky md:top-0 md:left-0 md:flex md:h-screen md:w-full md:items-center md:overflow-hidden">
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
                        <div
                            key={index}
                            data-panel={index}
                            // Clicking the bare desktop leaves no window key, like clicking the macOS desktop.
                            onPointerDown={(e) => { if (e.target === e.currentTarget) focus(null) }}
                            className="relative w-full max-w-2xl mx-auto overflow-x-clip md:max-w-none md:mx-0 md:h-screen md:w-screen md:flex-shrink-0 md:flex md:items-center md:justify-center md:overflow-hidden md:pt-[calc(var(--nav-h)+1rem)] md:pb-[calc(var(--dock-h)+0.25rem)] md:px-10 lg:px-14"
                        >
                            {section}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
