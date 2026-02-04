import { useEffect, useState, useRef, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useSpring, useVelocity, animate } from 'framer-motion'
import HeroOverlay from '@/components/dom/HeroOverlay'
import About from '@/components/dom/About'
import Services from '@/components/dom/Services'

const Experience = dynamic(() => import('@/components/dom/Experience'), { ssr: false })
const Projects = dynamic(() => import('@/components/dom/Projects'), { ssr: false })
const Contact = dynamic(() => import('@/components/dom/Contact'), { ssr: false })

function SectionFallback() {
    return <div className="min-h-screen w-full flex items-center justify-center bg-transparent" aria-hidden />
}

export default function HorizontalLayout() {
    const targetRef = useRef<HTMLDivElement>(null)

    // We have 6 main sections: Hero, About, Services, Experience, Education (merged/split?), Projects, Contact.
    // Actually Experience contains Education.
    // Sections: Hero, About, Services, Experience, Projects, Contact. = 6 sections.
    // We need a scroll container of roughly 600vh to map to 600vw translation.

    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    // Map vertical scroll (0 to 1) to horizontal movement
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-500vw"])

    // Cinematic Zoom-out effect: Dips the scale when between sections
    // Boundaries for 6 sections (Hero, About, Services, Experience, Projects, Contact)
    // Centers are at roughly: 0, 0.2, 0.4, 0.6, 0.8, 1.0
    // We want scale 1 at centers and ~0.98 at transition midpoints
    const scale = useTransform(
        scrollYProgress,
        [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        [1, 0.98, 1, 0.98, 1, 0.98, 1, 0.98, 1, 0.98, 1]
    )

    // Smooth physics for the scale to make it feel cinematic
    const smoothScale = useSpring(scale, { stiffness: 60, damping: 25, restDelta: 0.001 })

    // --- SMART SNAP LOGIC (Desktop Only) ---
    const velocity = useVelocity(scrollYProgress)
    const [isSnapping, setIsSnapping] = useState(false)

    useEffect(() => {
        // Only apply snap logic on desktop (md breakpoint and above)
        const isDesktop = () => window.innerWidth >= 768
        
        if (!isDesktop()) {
            return // Exit early on mobile - no scroll locking
        }

        let timeout: NodeJS.Timeout

        const handleScroll = () => {
            // Double check we're still on desktop
            if (!isDesktop() || isSnapping) return

            clearTimeout(timeout)
            timeout = setTimeout(() => {
                const currentProgress = scrollYProgress.get()
                const currentVelocity = velocity.get()

                // Threshold for scroll intent detection
                if (Math.abs(currentVelocity) < 0.01) {
                    // 6 sections = 5 transition gaps. Midpoints at 0, 0.2, 0.4, 0.6, 0.8, 1.0
                    const nearestSection = Math.round(currentProgress * 5) / 5
                    const distance = Math.abs(currentProgress - nearestSection)

                    // Snap zone: pull if within 8% (more forgiving for better UX)
                    if (distance > 0.01 && distance < 0.08) {
                        setIsSnapping(true)

                        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
                        const targetY = nearestSection * maxScroll

                        // Faster animation for better responsiveness
                        animate(window.scrollY, targetY, {
                            duration: 1.4,
                            ease: [0.33, 1, 0.68, 1],
                            onUpdate: (latest) => window.scrollTo({ top: latest })
                        }).then(() => {
                            setTimeout(() => setIsSnapping(false), 200)
                        })
                    }
                }
            }, 300) // Longer debounce to ensure intent
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
            clearTimeout(timeout)
        }
    }, [scrollYProgress, velocity, isSnapping])

    return (
        <div ref={targetRef} className="relative bg-[var(--background)]">
            {/* MOBILE LAYOUT (Vertical Stack) */}
            <div className="flex flex-col md:hidden gap-[10vh]">
                <div id="hero" className="min-h-screen w-full overflow-hidden relative">
                    <HeroOverlay />
                </div>
                <div id="about" className="min-h-screen w-full overflow-hidden relative">
                    <About />
                </div>
                <div id="services" className="min-h-screen w-full overflow-hidden relative">
                    <Services />
                </div>
                <div id="experience" className="min-h-screen w-full overflow-hidden relative">
                    <Suspense fallback={<SectionFallback />}>
                        <Experience />
                    </Suspense>
                </div>
                <div id="projects" className="min-h-screen w-full overflow-hidden relative">
                    <Suspense fallback={<SectionFallback />}>
                        <Projects />
                    </Suspense>
                </div>
                <div id="contact" className="min-h-screen w-full overflow-hidden relative">
                    <Suspense fallback={<SectionFallback />}>
                        <Contact />
                    </Suspense>
                </div>
            </div>

            {/* DESKTOP LAYOUT (Horizontal Sticky) */}
            <div className="hidden md:block h-[600vh] relative">
                <div className="sticky top-0 left-0 flex h-screen w-full items-center overflow-hidden">
                    <motion.div
                        style={{ x, scale: smoothScale }}
                        className="flex h-screen items-center will-change-transform"
                    >
                        {/* Section 1: Hero */}
                        <div className="relative h-screen w-screen flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <HeroOverlay />
                        </div>

                        {/* Section 2: About */}
                        <div className="relative h-screen w-screen flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <About />
                        </div>

                        {/* Section 3: Services */}
                        <div className="relative h-screen w-screen flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <Services />
                        </div>

                        {/* Section 4: Experience */}
                        <div className="relative h-screen w-screen flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <Suspense fallback={<SectionFallback />}>
                                <Experience />
                            </Suspense>
                        </div>

                        {/* Section 5: Projects */}
                        <div className="relative h-screen w-screen flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <Suspense fallback={<SectionFallback />}>
                                <Projects />
                            </Suspense>
                        </div>

                        {/* Section 6: Contact */}
                        <div className="relative h-screen w-screen flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <Suspense fallback={<SectionFallback />}>
                                <Contact />
                            </Suspense>
                        </div>
                    </motion.div>
                </div>

                {/* Desktop Progress Bar */}
                <motion.div
                    className="fixed bottom-0 left-0 h-1 bg-[var(--accent)] z-50 origin-left"
                    style={{ scaleX: scrollYProgress }}
                />
            </div>
        </div>
    )
}
