'use client'

import { useContent } from '@/hooks/useContent'
import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, useSpring, useMotionTemplate } from 'motion/react'
import Typewriter from 'typewriter-effect'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'
import { EASE_OUT, LETTER_STAGGER } from '@/utils/motion'
import { useSiteEntered } from '@/hooks/useSiteEntered'
import Magnetic from '@/components/ui/Magnetic'
import LocalTime from '@/components/ui/LocalTime'
import { sectionIndex, type SectionId } from '@/data/sections'

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

const FIRST_NAME_SIZE = 'text-[clamp(2.5rem,12vw,11rem)]'
const LAST_NAME_SIZE = 'text-[clamp(2rem,10vw,9rem)]'
const OUTLINE = { WebkitTextStroke: '2px var(--foreground)' } as const

/**
 * One outlined word whose letters rise out of a mask. The vertical padding/negative
 * margin pair gives the tight 0.8 line-height room so glyph tops are never clipped.
 */
function RevealWord({ text, className, delay, play }: { text: string; className: string; delay: number; play: boolean }) {
    return (
        <span aria-hidden="true" className={`${className} leading-[0.8] font-black tracking-tighter text-transparent select-none flex overflow-hidden py-[0.08em] -my-[0.08em] px-[0.04em] -mx-[0.04em]`} style={OUTLINE}>
            {Array.from(text).map((char, i) => (
                <motion.span
                    key={i}
                    className="inline-block will-change-transform"
                    initial={{ y: '115%' }}
                    animate={{ y: play ? '0%' : '115%' }}
                    transition={{ duration: 1, ease: EASE_OUT, delay: delay + i * LETTER_STAGGER }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    )
}

const SOCIAL_BTN = "w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors duration-300"
const CTA_BTN = "group relative px-6 py-3 bg-transparent overflow-hidden w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"

export default function HeroOverlay() {
    const t = useContent()
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`
    const nameRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)
    const entered = useSiteEntered()

    /** Fade-and-rise for supporting elements, held until the intro has cleared. */
    const rise = (delay: number) => ({
        initial: { opacity: 0, y: 24 },
        animate: entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
        transition: { duration: 0.9, ease: EASE_OUT, delay },
    })

    const scrollToSection = (id: SectionId) => {
        smoothScrollToSection(sectionIndex(id), id)
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
            <div className="relative z-10 flex flex-col items-center justify-center w-full">
                <div ref={nameRef} className="relative">
                    <div id="hero" className="flex flex-col items-center">
                        <h1 className="flex flex-col items-center">
                            <span className="sr-only">{`${t.hero.firstName} ${t.hero.lastName}`}</span>
                            <RevealWord text={t.hero.firstName} className={FIRST_NAME_SIZE} delay={0.15} play={entered} />
                            <RevealWord text={t.hero.lastName} className={`${LAST_NAME_SIZE} mt-2`} delay={0.3} play={entered} />
                        </h1>
                    </div>
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full hidden md:block pointer-events-none"
                        aria-hidden="true"
                        style={{
                            maskImage: blobMask,
                            WebkitMaskImage: blobMask,
                            opacity: isHovering && entered ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            isolation: 'isolate',
                            zIndex: BLOB_CURSOR.zIndex,
                        }}
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
                            <span className={`${FIRST_NAME_SIZE} leading-[0.8] font-black tracking-tighter select-none`}>
                                {t.hero.firstName}
                            </span>
                            <span className={`${LAST_NAME_SIZE} leading-[0.8] font-black tracking-tighter select-none mt-2`}>
                                {t.hero.lastName}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <motion.div
                {...rise(0.9)}
                className="mt-12 text-lg sm:text-xl md:text-2xl font-light tracking-widest text-[var(--foreground)] uppercase h-12 flex items-center"
            >
                <div role="status" aria-live="polite">
                    <span className="sr-only">{t.hero.typewriter.join(' | ')}</span>
                    <span aria-hidden="true">
                        {entered && (
                            <Typewriter
                                options={{
                                    strings: t.hero.typewriter,
                                    autoStart: true,
                                    loop: true,
                                    delay: 50,
                                    deleteSpeed: 30,
                                }}
                            />
                        )}
                    </span>
                </div>
            </motion.div>

            <motion.div {...rise(1.05)} className="flex gap-4 mt-12 pointer-events-auto">
                <Magnetic>
                    <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className={SOCIAL_BTN}>
                        <i className="fab fa-linkedin text-xl" aria-hidden="true" />
                    </a>
                </Magnetic>
                <Magnetic>
                    <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className={SOCIAL_BTN}>
                        <i className="fab fa-github text-xl" aria-hidden="true" />
                    </a>
                </Magnetic>
                <Magnetic>
                    <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className={SOCIAL_BTN}>
                        <i className="fas fa-envelope text-xl" aria-hidden="true" />
                    </a>
                </Magnetic>
            </motion.div>

            <motion.div
                {...rise(1.2)}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 pointer-events-auto w-full sm:w-auto max-w-xs sm:max-w-none"
            >
                {([['projects', t.hero.viewWork], ['contact', t.hero.getInTouch]] as const).map(([id, label]) => (
                    <Magnetic key={id} strength={0.2} className="w-full sm:w-auto">
                        <button onClick={() => scrollToSection(id)} className={CTA_BTN}>
                            <span className="relative z-10 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs text-foreground group-hover:text-background transition-colors duration-300 ease-out whitespace-nowrap">
                                {label}
                                <i className="fas fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                            </span>
                            <span className="absolute inset-0 bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left" aria-hidden="true" />
                            <span className="absolute inset-0 border border-foreground" aria-hidden="true" />
                        </button>
                    </Magnetic>
                ))}
            </motion.div>

            {/* Corner meta, desktop only: where and when, plus a one-time scroll cue. */}
            <motion.div
                {...rise(1.5)}
                className="hidden md:flex absolute bottom-10 left-12 flex-col gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)]"
            >
                <span className="opacity-60">{t.location}</span>
                <LocalTime />
            </motion.div>

            <motion.div
                {...rise(1.5)}
                className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]"
            >
                {t.hero.scroll}
                <span className="relative block w-16 h-px bg-[var(--accent)]/25 overflow-hidden" aria-hidden="true">
                    <motion.span
                        className="absolute inset-0 bg-[var(--accent)] origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: entered ? 1 : 0 }}
                        transition={{ duration: 1.2, ease: EASE_OUT, delay: 1.8 }}
                    />
                </span>
                <i className="fas fa-arrow-right" aria-hidden="true" />
            </motion.div>
        </div>
    )
}
