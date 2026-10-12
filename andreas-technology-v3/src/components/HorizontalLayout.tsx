'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useReducedMotion } from 'motion/react'
import HeroOverlay from '@/components/dom/HeroOverlay'
import About from '@/components/dom/About'
import Services from '@/components/dom/Services'
import TechSpecs from '@/components/dom/TechSpecs'
import Experience from '@/components/dom/Experience'
import Projects from '@/components/dom/Projects'
import Contact from '@/components/dom/Contact'
import DotNav from '@/components/dom/DotNav'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { useActiveSlide } from '@/hooks/useActiveSlide'
import { useDeckGestures } from '@/hooks/useDeckGestures'
import { currentSectionIndex, scrollToSection } from '@/utils/track'
import { SECTION_IDS, TRACK_HEIGHT_VH, TRACK_TRAVEL_VW } from '@/data/sections'
import { SlideIndexContext, TrackContext } from '@/components/ui/keynote'

// Sections are declared once. The wrapper's CSS — not a second copy of the tree —
// is what differs between the vertical stack and the horizontal journey. All of them
// are server-rendered, so crawlers, link previews and no-JS visitors see every section.
const SECTIONS = [
    <HeroOverlay key="hero" />,
    <About key="about" />,
    <Services key="services" />,
    <TechSpecs key="specs" />,
    <Experience key="experience" />,
    <Projects key="projects" />,
    <Contact key="contact" />,
]

export default function HorizontalLayout() {
    const targetRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const isDesktop = useIsDesktop()
    const prefersReducedMotion = useReducedMotion()
    const activeSlide = useActiveSlide()

    useDeckGestures()

    const { scrollYProgress } = useScroll({ target: targetRef })

    // Gates for the scroll-linked transforms. These are motion values rather than
    // plain booleans on purpose: swapping `style` between a motion value and a literal
    // leaves the last transform stuck on the element, so a desktop→mobile resize would
    // strand the vertical stack off-screen. Keeping one stable binding whose output
    // collapses to zero avoids that entirely. `motionGate` switches off the product-shot
    // scaling (see components/ui/keynote.tsx).
    const trackGate = useMotionValue(0)
    const motionGate = useMotionValue(0)

    useEffect(() => {
        trackGate.set(isDesktop ? 1 : 0)
        motionGate.set(isDesktop && !prefersReducedMotion ? 1 : 0)
    }, [isDesktop, prefersReducedMotion, trackGate, motionGate])

    const x = useTransform(
        [scrollYProgress, trackGate],
        ([progress, gate]: number[]) => `${-progress * gate * TRACK_TRAVEL_VW}vw`
    )

    // Focus moved into a slide that is off screen (Tab, find-in-page, a screen reader):
    // bring the page to that slide. The viewport and slides clip rather than hide their
    // overflow, so the browser can no longer scroll them sideways behind our back; the
    // scroll listener is a safety net for engines without `overflow: clip`.
    useEffect(() => {
        const viewport = viewportRef.current
        if (!isDesktop || !viewport) return
        const onFocusIn = (e: FocusEvent) => {
            const slide = (e.target as Element).closest<HTMLElement>('[data-slide]')
            if (!slide) return
            viewport.scrollLeft = 0
            const index = Number(slide.dataset.slide)
            if (index !== currentSectionIndex()) void scrollToSection(index, { instant: true })
        }
        const onScroll = () => {
            if (viewport.scrollLeft !== 0) viewport.scrollLeft = 0
        }
        viewport.addEventListener('focusin', onFocusIn)
        viewport.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            viewport.removeEventListener('focusin', onFocusIn)
            viewport.removeEventListener('scroll', onScroll)
        }
    }, [isDesktop])

    // Crossing between the stack and the track (window resize, rotation) keeps the
    // visitor on the section they were reading instead of a raw pixel offset.
    const lastSlide = useRef(0)
    const lastLayout = useRef<boolean | null>(null)
    useEffect(() => {
        lastSlide.current = activeSlide
    }, [activeSlide])
    useEffect(() => {
        if (isDesktop === null) return
        const previous = lastLayout.current
        lastLayout.current = isDesktop
        if (previous === null || previous === isDesktop) return
        const index = lastSlide.current
        requestAnimationFrame(() => { void scrollToSection(index, { instant: true }) })
    }, [isDesktop])

    return (
        <TrackContext.Provider value={{ progress: scrollYProgress, gate: motionGate }}>
            <div
                ref={targetRef}
                data-runway
                className="relative bg-[var(--background)] md:h-[var(--track-height)]"
                style={{ '--track-height': `${TRACK_HEIGHT_VH}vh` } as React.CSSProperties}
            >
                {/* One snap point per slide: CSS scroll snap rests the page on these. */}
                {SECTION_IDS.map((id, i) => (
                    <span key={id} data-snap={i} aria-hidden="true" className="kn-snap" style={{ top: `${i * 100}vh` }} />
                ))}

                <div
                    ref={viewportRef}
                    className="md:sticky md:top-0 md:left-0 md:flex md:h-screen md:w-full md:items-center md:overflow-clip"
                >
                    <motion.div
                        style={{ x }}
                        className="flex flex-col md:flex-row md:h-screen md:items-center md:will-change-transform"
                    >
                        {/*
                          Each panel is a keynote slide. Slides alternate between the theme's two
                          neutral tones, like apple.com's white and #F5F5F7 sections (see
                          [data-tone] in globals.css). Panels clip their overflow: `clip` contains
                          the content without creating a scroll container, which would break the
                          sticky track and let focus scroll a slide sideways.
                        */}
                        {SECTIONS.map((section, index) => (
                            <div
                                key={index}
                                data-slide={index}
                                data-tone={index % 2 === 0 ? 'primary' : 'alt'}
                                className="slide relative w-full overflow-x-clip md:h-screen md:w-screen md:flex-shrink-0 md:flex md:items-center md:justify-center md:overflow-clip md:pt-[var(--nav-h)] md:pb-[3.75rem]"
                            >
                                <SlideIndexContext.Provider value={index}>{section}</SlideIndexContext.Provider>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <DotNav />
            </div>
        </TrackContext.Provider>
    )
}
