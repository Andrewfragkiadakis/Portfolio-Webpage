'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useInView, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'
import type { Project } from '@/data/content'
import ProjectImage from '@/components/ui/ProjectImage'

const INTERVAL_MS = 4200

/**
 * A laptop on a studio sweep, slowly cross-fading through project screenshots.
 * Screenshots mount one ahead of time (so only what is about to show is downloaded) and
 * stay mounted for the cross-fade. The cycle runs only while the tile is on screen and
 * not hovered; with reduced motion it rests on the first screenshot.
 */
export default function Showcase({ projects, play = true }: {
    projects: Project[]
    play?: boolean
}) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { amount: 0.4 })
    const reduceMotion = useReducedMotion()
    const [index, setIndex] = useState(0)
    // How many screenshots are mounted: the current one plus the next.
    const [reach, setReach] = useState(2)
    const [hovered, setHovered] = useState(false)
    const running = play && inView && !reduceMotion && !hovered && projects.length > 1

    useEffect(() => {
        if (!running) return
        const id = setInterval(() => {
            setIndex((current) => (current + 1) % projects.length)
            setReach((r) => Math.min(projects.length, r + 1))
        }, INTERVAL_MS)
        return () => clearInterval(id)
    }, [running, projects.length])

    const current = projects[index]

    return (
        <>
        <div
            ref={ref}
            className="relative flex-1 min-h-0 flex flex-col items-center justify-center [container-type:size]"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
        >
            {/* A soft neutral shadow pooled under the machine. */}
            <span className="absolute left-1/2 top-[88%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[14%] rounded-full bg-[radial-gradient(closest-side,rgba(0,0,0,0.14),transparent)] dark:bg-[radial-gradient(closest-side,rgba(0,0,0,0.6),transparent)]" aria-hidden="true" />

            <div className="relative w-[min(88cqw,calc((100cqh-1.25rem)*1.6*0.97))]">
                {/* Lid: bezel, then a 16:10 display. */}
                <div className="rounded-[0.9rem] bg-[#0c0c0f] p-[2.2%] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/10 dark:ring-white/12">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[0.35rem] bg-black">
                        {projects.slice(0, reach).map((project, i) => {
                            return (
                                <div
                                    key={project.name}
                                    className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
                                    style={{ opacity: i === index ? 1 : 0 }}
                                    aria-hidden={i !== index}
                                >
                                    <ProjectImage project={project} sizes="(max-width: 1023px) 88vw, 34vw" eager={i === 0} />
                                </div>
                            )
                        })}
                        {/* Glass reflection across the display. */}
                        <span className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.03)_38%,transparent_39%)] pointer-events-none" aria-hidden="true" />
                    </div>
                </div>
                {/* Base with the thumb notch. */}
                <div className="relative mx-[-6%] h-[0.7rem] rounded-b-[0.9rem] rounded-t-[0.15rem] bg-[linear-gradient(180deg,#e4e4e8_0%,#b9b9c0_60%,#8e8e96_100%)] dark:bg-[linear-gradient(180deg,#5b5b63_0%,#3a3a40_60%,#26262b_100%)] shadow-[0_12px_24px_-10px_rgba(0,0,0,0.5)]" aria-hidden="true">
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 w-[14%] h-[40%] rounded-b-md bg-black/20" />
                </div>
            </div>
        </div>

        {/* Caption bar: what is on screen, and where it sits in the reel. */}
        <div className="relative flex items-end justify-between gap-3">
            <div className="min-w-0">
                <div className="relative h-[1.3em] t-title overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.p
                            key={current?.name}
                            className="truncate el-caps"
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '-100%', opacity: 0 }}
                            transition={{ duration: 0.5, ease: EASE_OUT }}
                        >
                            {current?.name}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
            <span className="flex items-center gap-1.5 shrink-0 pb-1" aria-hidden="true">
                {projects.map((project, i) => (
                    <span
                        key={project.name}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-4 bg-[var(--accent)]' : 'w-1.5 bg-[var(--foreground)] opacity-20'}`}
                    />
                ))}
            </span>
        </div>
        </>
    )
}
