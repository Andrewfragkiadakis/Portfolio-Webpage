import { useEffect, useState, useRef, Suspense, useCallback } from 'react'
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

    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-500vw"])

    const scale = useTransform(
        scrollYProgress,
        [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        [1, 0.98, 1, 0.98, 1, 0.98, 1, 0.98, 1, 0.98, 1]
    )

    const smoothScale = useSpring(scale, { stiffness: 60, damping: 25, restDelta: 0.001 })

    const velocity = useVelocity(scrollYProgress)
    const [isSnapping, setIsSnapping] = useState(false)

    const snapToNearest = useCallback(() => {
        const isDesktop = window.innerWidth >= 768
        if (!isDesktop) return

        const currentProgress = scrollYProgress.get()
        const nearestSection = Math.round(currentProgress * 5) / 5
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const targetY = nearestSection * maxScroll
        window.scrollTo({ top: targetY })
    }, [scrollYProgress])

    useEffect(() => {
        const isDesktop = () => window.innerWidth >= 768

        if (!isDesktop()) return

        let timeout: NodeJS.Timeout

        const handleScroll = () => {
            if (!isDesktop() || isSnapping) return

            clearTimeout(timeout)
            timeout = setTimeout(() => {
                const currentProgress = scrollYProgress.get()
                const currentVelocity = velocity.get()

                if (Math.abs(currentVelocity) < 0.01) {
                    const nearestSection = Math.round(currentProgress * 5) / 5
                    const distance = Math.abs(currentProgress - nearestSection)

                    if (distance > 0.01 && distance < 0.08) {
                        setIsSnapping(true)

                        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
                        const targetY = nearestSection * maxScroll

                        animate(window.scrollY, targetY, {
                            duration: 1.4,
                            ease: [0.33, 1, 0.68, 1],
                            onUpdate: (latest) => window.scrollTo({ top: latest })
                        }).then(() => {
                            setTimeout(() => setIsSnapping(false), 200)
                        })
                    }
                }
            }, 300)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
            clearTimeout(timeout)
        }
    }, [scrollYProgress, velocity, isSnapping])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) return
            snapToNearest()
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [snapToNearest])

    return (
        <div ref={targetRef} className="relative bg-[var(--background)]">
            <div className="flex flex-col md:hidden gap-[10vh]">
                <div className="min-h-screen w-full overflow-hidden relative">
                    <HeroOverlay />
                </div>
                <div className="min-h-screen w-full overflow-hidden relative">
                    <About />
                </div>
                <div className="min-h-screen w-full overflow-hidden relative">
                    <Services />
                </div>
                <div className="min-h-screen w-full overflow-hidden relative">
                    <Suspense fallback={<SectionFallback />}>
                        <Experience />
                    </Suspense>
                </div>
                <div className="min-h-0 max-h-screen w-full overflow-hidden relative mb-[-2vh]">
                    <Suspense fallback={<SectionFallback />}>
                        <Projects />
                    </Suspense>
                </div>
                <div className="min-h-screen w-full overflow-hidden relative">
                    <Suspense fallback={<SectionFallback />}>
                        <Contact />
                    </Suspense>
                </div>
            </div>

            <div className="hidden md:block h-[600vh] relative">
                <div className="sticky top-0 left-0 flex h-screen w-full items-center overflow-hidden">
                    <motion.div
                        style={{ x, scale: smoothScale }}
                        className="flex h-screen items-center will-change-transform"
                    >
                        <div className="relative h-screen w-screen flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <HeroOverlay />
                        </div>
                        <div className="relative h-screen w-screen flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <About />
                        </div>
                        <div className="relative h-screen w-screen flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <Services />
                        </div>
                        <div className="relative h-screen w-screen flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <Suspense fallback={<SectionFallback />}>
                                <Experience />
                            </Suspense>
                        </div>
                        <div className="relative h-screen w-screen flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <Suspense fallback={<SectionFallback />}>
                                <Projects />
                            </Suspense>
                        </div>
                        <div className="relative h-screen w-screen flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <Suspense fallback={<SectionFallback />}>
                                <Contact />
                            </Suspense>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="fixed bottom-0 left-0 h-1 bg-[var(--accent)] z-50 origin-left"
                    style={{ scaleX: scrollYProgress }}
                />
            </div>
        </div>
    )
}
