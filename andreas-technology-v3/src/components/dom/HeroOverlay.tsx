'use client'

import { useContent } from '@/hooks/useContent'
import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, useSpring, useMotionTemplate } from 'framer-motion'
import Typewriter from 'typewriter-effect'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'

const LetterGlitch = dynamic(() => import('@/components/ui/LetterGlitch'), { ssr: false })

/**
 * Hero blob cursor (trail) – edit this object to tune the effect.
 * Uses mask gradients + Framer Motion springs (no inner dot/shadow in this build).
 *
 * Trail Count: number of trailing blobs (fixed 2 in code; lead + 1 trail).
 * Lead Blob Size (px): radius of the blob that follows the cursor immediately.
 * Trail Blob Size (px): radius of the single trailing blob.
 * Lead/Trail Gradient Stops (%): 0–100, where the gradient goes from solid to transparent (higher = harder edge).
 * Fast Duration / Slow Duration: approximate “snap” vs “trail” feel; mapped to spring stiffness/damping.
 * Lead Stiffness/Damping: spring for lead blob (higher stiffness = faster).
 * Trail Stiffness/Damping: spring for the trailing blob – lower = slower, more wobble.
 * Z-Index: stacking order of the blob overlay.
 *
 * Not used here (mask-only): Inner Color, Lead Inner Dot Size, Shadow Color/Blur/Offset.
 */
const BLOB_CURSOR = {
    trailCount: 2,
    leadBlobSize: 92,
    trailBlobSize: 78,
    leadBlobOpacity: 1,
    trailBlobOpacity: 0.6,
    leadGradientStop: 48,
    trailGradientStop: 40,
    fastDuration: 0.42,
    slowDuration: 0.51,
    leadStiffness: 220,
    leadDamping: 24,
    trailStiffness: 105,
    trailDamping: 20,
    zIndex: 100,
}

export default function HeroOverlay() {
    const t = useContent()
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`
    const mailtoUrl = `mailto:andrewfragkiadakis@gmail.com`
    const nameRef = useRef<HTMLDivElement>(null)

    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const emailUrl = isMobile ? mailtoUrl : gmailComposeUrl
    const [isHovering, setIsHovering] = useState(false)

    const scrollToSection = (id: string, index: number) => {
        smoothScrollToSection(index, id)
    }

    const blobX1 = useSpring(0, { stiffness: BLOB_CURSOR.leadStiffness, damping: BLOB_CURSOR.leadDamping })
    const blobY1 = useSpring(0, { stiffness: BLOB_CURSOR.leadStiffness, damping: BLOB_CURSOR.leadDamping })
    const blobX2 = useSpring(0, { stiffness: BLOB_CURSOR.trailStiffness, damping: BLOB_CURSOR.trailDamping })
    const blobY2 = useSpring(0, { stiffness: BLOB_CURSOR.trailStiffness, damping: BLOB_CURSOR.trailDamping })

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!nameRef.current) return
        const rect = nameRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        blobX1.set(x); blobY1.set(y)
        blobX2.set(x); blobY2.set(y)
    }, [blobX1, blobY1, blobX2, blobY2])

    const r1 = BLOB_CURSOR.leadBlobSize
    const r2 = BLOB_CURSOR.trailBlobSize
    const g1 = BLOB_CURSOR.leadGradientStop
    const g2 = BLOB_CURSOR.trailGradientStop
    const blobMask = useMotionTemplate`radial-gradient(circle ${r1}px at ${blobX1}px ${blobY1}px, black ${g1}%, transparent 100%), radial-gradient(circle ${r2}px at ${blobX2}px ${blobY2}px, black ${g2}%, transparent 100%)`

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden z-10"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative z-10 flex flex-col items-center justify-center w-full"
            >
                <div ref={nameRef} className="relative">
                    <div id="hero" className="flex flex-col items-center">
                        <h1 className="flex flex-col items-center">
                            <span
                                className="text-[12vw] leading-[0.8] font-black tracking-tighter text-transparent select-none transition-all duration-500 block"
                                style={{ WebkitTextStroke: '2px var(--foreground)' }}
                            >
                                {t.hero.firstName}
                            </span>
                            <span
                                className="text-[10vw] leading-[0.8] font-black tracking-tighter text-transparent select-none mt-2 block"
                                style={{ WebkitTextStroke: '2px var(--foreground)' }}
                            >
                                {t.hero.lastName}
                            </span>
                        </h1>
                    </div>
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full hidden md:block pointer-events-none"
                        aria-hidden="true"
                        style={{
                            maskImage: blobMask,
                            WebkitMaskImage: blobMask,
                            opacity: isHovering ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            isolation: 'isolate',
                            zIndex: BLOB_CURSOR.zIndex,
                        } as any}
                    >
                        <div className="absolute inset-0 z-0">
                            <LetterGlitch
                                backgroundColor="transparent"
                                glitchColors={['#6366f1', '#818cf8', '#a5b4fc']}
                                glitchSpeed={80}
                                centerVignette={false}
                                outerVignette={false}
                                smooth
                            />
                        </div>
                        <div className="absolute inset-0 z-10 flex flex-col items-center text-knockout">
                            <span className="text-[12vw] leading-[0.8] font-black tracking-tighter select-none">
                                {t.hero.firstName}
                            </span>
                            <span className="text-[10vw] leading-[0.8] font-black tracking-tighter select-none mt-2">
                                {t.hero.lastName}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-12 text-lg sm:text-xl md:text-2xl font-light tracking-widest text-[var(--foreground)] uppercase h-12 flex items-center"
            >
                <div role="status" aria-live="polite">
                    <span className="sr-only">{t.hero.typewriter.join(' | ')}</span>
                    <span aria-hidden="true">
                        <Typewriter
                            options={{
                                strings: t.hero.typewriter,
                                autoStart: true,
                                loop: true,
                                delay: 50,
                                deleteSpeed: 30,
                            }}
                        />
                    </span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="flex gap-4 mt-12 pointer-events-auto"
            >
                <a
                    href={t.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)]"
                >
                    <i className="fab fa-linkedin text-xl" aria-hidden="true" />
                </a>
                <a
                    href={t.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)]"
                >
                    <i className="fab fa-github text-xl" aria-hidden="true" />
                </a>
                <a
                    href={emailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact via email"
                    className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)]"
                >
                    <i className="fas fa-envelope text-xl" aria-hidden="true" />
                </a>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 pointer-events-auto w-full sm:w-auto max-w-xs sm:max-w-none"
            >
                <button
                    onClick={() => scrollToSection('projects', 4)}
                    className="group relative px-6 sm:px-6 py-2.5 sm:py-3 bg-transparent overflow-hidden hover:shadow-[0_0_20px_var(--accent)] transition-all duration-300 ease-out w-full"
                >
                    <span className="relative z-10 font-bold uppercase tracking-widest text-xs sm:text-xs text-foreground group-hover:text-background transition-all duration-300 ease-out whitespace-nowrap">
                        {t.hero.viewWork}
                    </span>
                    <div className="absolute inset-0 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div className="absolute inset-0 border border-foreground" />
                </button>

                <button
                    onClick={() => scrollToSection('contact', 5)}
                    className="group relative px-6 sm:px-6 py-2.5 sm:py-3 bg-transparent overflow-hidden hover:shadow-[0_0_20px_var(--accent)] transition-all duration-300 ease-out w-full"
                >
                    <span className="relative z-10 font-bold uppercase tracking-widest text-xs sm:text-xs text-foreground group-hover:text-background transition-all duration-300 ease-out whitespace-nowrap">
                        {t.hero.getInTouch}
                    </span>
                    <div className="absolute inset-0 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div className="absolute inset-0 border border-foreground" />
                </button>
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
