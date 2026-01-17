'use client'

import { useContent } from '@/hooks/useContent'
import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Typewriter from 'typewriter-effect'

// Magnetic Wrapper Component
function Magnetic({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springConfig = { stiffness: 100, damping: 20, mass: 0.1 }
    const quickX = useSpring(x, springConfig)
    const quickY = useSpring(y, springConfig)

    const onMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return
        const { clientX, clientY } = e
        const { width, height, left, top } = ref.current.getBoundingClientRect()
        const mouseX = clientX - (left + width / 2)
        const mouseY = clientY - (top + height / 2)
        x.set(mouseX * 0.15)
        y.set(mouseY * 0.15)
    }

    const onMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ x: quickX, y: quickY }}
        >
            {children}
        </motion.div>
    )
}

export default function HeroOverlay() {
    const t = useContent()

    const scrollToSection = (id: string, index: number) => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 768) {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight
                const targetY = (index / 5) * maxScroll
                window.scrollTo({ top: targetY, behavior: 'smooth' })
            } else {
                const element = document.getElementById(id)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                }
            }
        }
    }

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e
        const { left, top } = e.currentTarget.getBoundingClientRect()
        setMousePosition({ x: clientX - left, y: clientY - top })
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden z-10"
        >

            {/* Massive Typography - Background Layer */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative z-10 flex flex-col items-center justify-center w-full"
            >
                <div className="relative">
                    {/* Base Layer - Outline */}
                    <div className="flex flex-col items-center">
                        <h1
                            className="text-[12vw] leading-[0.8] font-black tracking-tighter text-transparent select-none transition-all duration-500"
                            style={{ WebkitTextStroke: '2px var(--foreground)' }}
                        >
                            {t.hero.firstName}
                        </h1>
                        <h1
                            className="text-[10vw] leading-[0.8] font-black tracking-tighter text-transparent select-none mt-2"
                            style={{ WebkitTextStroke: '2px var(--foreground)' }}
                        >
                            {t.hero.lastName}
                        </h1>
                    </div>
                    {/* Spotlight Layer - Filled */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full flex flex-col items-center pointer-events-none"
                        animate={{
                            // Position spotlight above and to the right of cursor
                            // X: subtract less to move right relative to cursor
                            // Y: subtract more to move above the cursor
                            WebkitMaskPosition: `${mousePosition.x - 25}px ${mousePosition.y - 200}px`,
                            maskPosition: `${mousePosition.x - 25}px ${mousePosition.y - 500}px`,
                        } as any}
                        // TIMING FIX: Reduced duration significantly to remove "drag"
                        transition={{ type: "tween", ease: "backOut", duration: 0.35 }}
                        style={{
                            // Original size preserved
                            maskImage: 'radial-gradient(circle 150px at center, black 100%, transparent 100%)',
                            WebkitMaskImage: 'radial-gradient(circle 150px at center, black 100%, transparent 100%)',

                            // IMPORTANT: Define the box size explicitly (Diameter = Radius * 2)
                            // This ensures the mask is calculated as a 300x300 box
                            maskSize: '300px 300px',
                            WebkitMaskSize: '300px 300px',

                            WebkitMaskRepeat: 'no-repeat',
                            maskRepeat: 'no-repeat',
                            opacity: isHovering ? 1 : 0
                        }}
                    >
                        <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter text-[var(--accent)] select-none">
                            {t.hero.firstName}
                        </h1>
                        <h1 className="text-[10vw] leading-[0.8] font-black tracking-tighter text-[var(--accent)] select-none mt-2">
                            {t.hero.lastName}
                        </h1>
                    </motion.div>
                </div>
            </motion.div>

            {/* Role / Subtitle */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-12 text-lg sm:text-xl md:text-2xl font-light tracking-widest text-[var(--foreground)] uppercase h-12 flex items-center"
            >
                <Typewriter
                    options={{
                        strings: t.hero.typewriter,
                        autoStart: true,
                        loop: true,
                        delay: 50,
                        deleteSpeed: 30,
                    }}
                />
            </motion.div>

            {/* Social Icon Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="flex gap-4 mt-12 pointer-events-auto"
            >
                <Magnetic>
                    <a
                        href={t.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)]"
                    >
                        <i className="fab fa-linkedin text-xl"></i>
                    </a>
                </Magnetic>
                <Magnetic>
                    <a
                        href={t.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)]"
                    >
                        <i className="fab fa-github text-xl"></i>
                    </a>
                </Magnetic>
                <Magnetic>
                    <a
                        href={`mailto:${t.email}`}
                        className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)]"
                    >
                        <i className="fas fa-envelope text-xl"></i>
                    </a>
                </Magnetic>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 pointer-events-auto w-full sm:w-auto max-w-xs sm:max-w-none"
            >
                <Magnetic>
                    <button
                        onClick={() => scrollToSection('projects', 4)}
                        className="group relative px-6 sm:px-6 py-2.5 sm:py-3 bg-transparent overflow-hidden hover:shadow-[0_0_20px_var(--accent)] transition-shadow duration-300 w-full"
                    >
                        <span className="relative z-10 font-bold uppercase tracking-widest text-xs sm:text-xs text-foreground group-hover:text-background transition-colors duration-300 whitespace-nowrap">
                            {t.hero.viewWork}
                        </span>
                        <div className="absolute inset-0 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        <div className="absolute inset-0 border border-foreground" />
                    </button>
                </Magnetic>

                <Magnetic>
                    <button
                        onClick={() => scrollToSection('contact', 5)}
                        className="group relative px-6 sm:px-6 py-2.5 sm:py-3 bg-transparent overflow-hidden hover:shadow-[0_0_20px_var(--accent)] transition-shadow duration-300 w-full"
                    >
                        <span className="relative z-10 font-bold uppercase tracking-widest text-xs sm:text-xs text-foreground group-hover:text-background transition-colors duration-300 whitespace-nowrap">
                            {t.hero.getInTouch}
                        </span>
                        <div className="absolute inset-0 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        <div className="absolute inset-0 border border-foreground" />
                    </button>
                </Magnetic>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-xs font-mono text-[var(--accent)] animate-pulse"
            >
                {t.hero.scroll}
            </motion.div>
        </div>
    )
}
