'use client'

import { useEffect, useRef } from 'react'
import { SLIDES } from '@/components/slides'
import DotNav from '@/components/dom/DotNav'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { useActiveSlide } from '@/hooks/useActiveSlide'
import { useDeckGestures } from '@/hooks/useDeckGestures'
import { currentSectionIndex, scrollToSection } from '@/utils/track'
import { SECTION_IDS, SECTION_STEPS, TRACK_HEIGHT_VH, TRACK_TRAVEL_VW } from '@/data/sections'
import { SlideIndexContext } from '@/components/ui/keynote'

export default function HorizontalLayout() {
    const runwayRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const isDesktop = useIsDesktop()
    const activeSlide = useActiveSlide()

    useDeckGestures()

    // The track slides sideways as the page scrolls. Browsers with scroll-driven
    // animations do it in CSS on the compositor (.kn-track, .kn-scalein in globals.css);
    // the rest get the same transforms written once per frame here.
    useEffect(() => {
        const runway = runwayRef.current
        const track = trackRef.current
        if (!isDesktop || !runway || !track || CSS.supports('animation-timeline: scroll()')) return
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const shots = Array.from(track.querySelectorAll<HTMLElement>('[data-scalein]'))
        let frame = 0
        const write = () => {
            frame = 0
            const travel = runway.offsetHeight - window.innerHeight
            const progress = travel > 0 ? Math.min(1, Math.max(0, (window.scrollY - runway.offsetTop) / travel)) : 0
            track.style.transform = `translate3d(${-progress * TRACK_TRAVEL_VW}vw, 0, 0)`
            if (reduceMotion) return
            for (const shot of shots) {
                const away = Math.min(1, Math.abs(progress * SECTION_STEPS - Number(shot.dataset.scalein)))
                shot.style.transform = `scale(${1 - away * 0.1})`
                shot.style.opacity = `${1 - away * 0.6}`
            }
        }
        const schedule = () => { if (!frame) frame = requestAnimationFrame(write) }
        write()
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule)
        return () => {
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('resize', schedule)
            cancelAnimationFrame(frame)
            track.style.transform = ''
            for (const shot of shots) {
                shot.style.transform = ''
                shot.style.opacity = ''
            }
        }
    }, [isDesktop])

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
        <div
            ref={runwayRef}
            data-runway
            className="relative bg-[var(--background)] md:h-[var(--track-height)]"
            style={{ '--track-height': `${TRACK_HEIGHT_VH}vh`, '--track-travel': `${TRACK_TRAVEL_VW}vw` } as React.CSSProperties}
        >
            {/* One snap point per slide: CSS scroll snap rests the page on these. */}
            {SECTION_IDS.map((id, i) => (
                <span key={id} data-snap={i} aria-hidden="true" className="kn-snap" style={{ top: `${i * 100}vh` }} />
            ))}

            <div
                ref={viewportRef}
                className="md:sticky md:top-0 md:left-0 md:flex md:h-screen md:w-full md:items-center md:overflow-clip"
            >
                <div
                    ref={trackRef}
                    className="kn-track flex flex-col md:flex-row md:h-screen md:items-center md:will-change-transform"
                >
                    {/*
                      Each panel is a keynote slide. Slides alternate between the theme's two
                      neutral tones, like apple.com's white and #F5F5F7 sections (see
                      [data-tone] in globals.css). Panels clip their overflow: `clip` contains
                      the content without creating a scroll container, which would break the
                      sticky track and let focus scroll a slide sideways.
                    */}
                    {/* Sections are declared once (components/slides.ts). The wrapper's CSS — not a
                        second copy of the tree — is what differs between the vertical stack and the
                        horizontal journey. All are server-rendered, for crawlers, link previews and no-JS. */}
                    {SECTION_IDS.map((id, index) => {
                        const Slide = SLIDES[id]
                        return (
                            <div
                                key={id}
                                // The <head> script marks slides as revealed before hydration.
                                suppressHydrationWarning
                                data-slide={index}
                                data-tone={index % 2 === 0 ? 'primary' : 'alt'}
                                className="slide relative w-full overflow-x-clip md:h-screen md:w-screen md:flex-shrink-0 md:flex md:items-center-safe md:justify-center md:overflow-clip md:pt-[var(--nav-h)] md:pb-[3.75rem]"
                            >
                                <SlideIndexContext.Provider value={index}><Slide /></SlideIndexContext.Provider>
                            </div>
                        )
                    })}
                </div>
            </div>

            <DotNav />
        </div>
    )
}
