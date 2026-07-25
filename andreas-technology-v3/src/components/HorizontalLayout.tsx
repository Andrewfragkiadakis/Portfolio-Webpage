import { useEffect, useRef, Suspense, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useSpring, useVelocity, useMotionValue, animate, useReducedMotion } from 'framer-motion'
import HeroOverlay from '@/components/dom/HeroOverlay'
import About from '@/components/dom/About'
import Services from '@/components/dom/Services'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { SECTION_STEPS, TRACK_HEIGHT_VH, TRACK_TRAVEL_VW } from '@/data/sections'

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
    const isDesktop = useIsDesktop()
    const prefersReducedMotion = useReducedMotion()

    const { scrollYProgress } = useScroll({ target: targetRef })

    // Gates for the two scroll-linked transforms. These are motion values rather than
    // plain booleans on purpose: swapping `style` between a motion value and a literal
    // leaves the last transform stuck on the element, so a desktop→mobile resize would
    // strand the vertical stack off-screen. Keeping one stable binding whose output
    // collapses to zero avoids that entirely.
    const trackGate = useMotionValue(0)
    const scaleGate = useMotionValue(0)

    useEffect(() => {
        trackGate.set(isDesktop ? 1 : 0)
        scaleGate.set(isDesktop && !prefersReducedMotion ? 1 : 0)
    }, [isDesktop, prefersReducedMotion, trackGate, scaleGate])

    const x = useTransform(
        [scrollYProgress, trackGate],
        ([progress, gate]: number[]) => `${-progress * gate * TRACK_TRAVEL_VW}vw`
    )

    // Gentle "breathing" as each section passes centre. Purely decorative.
    const scale = useTransform(
        scrollYProgress,
        [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        [1, 0.98, 1, 0.98, 1, 0.98, 1, 0.98, 1, 0.98, 1]
    )
    const smoothScale = useSpring(scale, { stiffness: 60, damping: 25, restDelta: 0.001 })
    const gatedScale = useTransform(
        [smoothScale, scaleGate],
        ([value, gate]: number[]) => (gate ? value : 1)
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

        const handleResize = () => {
            const progress = scrollYProgress.get()
            const nearest = Math.round(progress * SECTION_STEPS) / SECTION_STEPS
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight
            window.scrollTo({ top: nearest * maxScroll })
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isDesktop, scrollYProgress])

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
            className="relative bg-[var(--background)] md:h-[var(--track-height)]"
            style={{ '--track-height': `${TRACK_HEIGHT_VH}vh` } as React.CSSProperties}
        >
            <div className="md:sticky md:top-0 md:left-0 md:flex md:h-screen md:w-full md:items-center md:overflow-hidden">
                <motion.div
                    style={{ x, scale: gatedScale }}
                    className="flex flex-col gap-[10vh] md:flex-row md:gap-0 md:h-screen md:items-center md:will-change-transform"
                >
                    {/*
                      Panels use overflow-x-clip rather than overflow-hidden: it contains the
                      sideways entry animations without creating a scroll container, which
                      would break the sticky positioning the desktop track relies on.
                    */}
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="relative w-full min-h-screen overflow-x-clip md:h-screen md:w-screen md:min-h-0 md:flex-shrink-0 md:flex md:items-center md:justify-center md:overflow-hidden md:pt-[var(--nav-h)]"
                        >
                            {section}
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                className="hidden md:block fixed bottom-0 left-0 h-1 bg-[var(--accent)] z-50 origin-left w-full"
                style={{ scaleX: scrollYProgress }}
                aria-hidden="true"
            />
        </div>
    )
}
