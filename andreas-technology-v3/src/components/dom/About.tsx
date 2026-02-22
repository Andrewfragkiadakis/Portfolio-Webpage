'use client'

import { useContent } from '@/hooks/useContent'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Skill } from '@/data/content'
import SpotlightCard from '@/components/ui/SpotlightCard'
import LogoLoop from '@/components/ui/LogoLoop'
import type { LogoItem } from '@/components/ui/LogoLoop'

function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (isInView) {
            let start = 0
            const end = value
            const increment = end / (duration * 60)
            const timer = setInterval(() => {
                start += increment
                if (start >= end) {
                    setCount(end)
                    clearInterval(timer)
                } else {
                    setCount(Math.floor(start))
                }
            }, 1000 / 60)
            return () => clearInterval(timer)
        }
    }, [isInView, value, duration])

    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    )
}

const TECH_PILL = "flex items-center gap-2 px-3 py-1.5 border border-[var(--foreground)]/20 text-sm font-mono text-[var(--foreground)] whitespace-nowrap"

const TECH_STACK: LogoItem[] = [
    { node: <span className={TECH_PILL}><i className="fab fa-python" /> Python</span> },
    { node: <span className={TECH_PILL}><i className="fab fa-js" /> TypeScript</span> },
    { node: <span className={TECH_PILL}><i className="fab fa-react" /> React</span> },
    { node: <span className={TECH_PILL}><i className="fab fa-react" /> Next.js</span> },
    { node: <span className={TECH_PILL}><i className="fab fa-docker" /> Docker</span> },
    { node: <span className={TECH_PILL}><i className="fab fa-linux" /> Linux</span> },
    { node: <span className={TECH_PILL}><i className="fab fa-git-alt" /> Git</span> },
    { node: <span className={TECH_PILL}><i className="fas fa-terminal" /> Bash</span> },
    { node: <span className={TECH_PILL}><i className="fas fa-network-wired" /> Cisco</span> },
    { node: <span className={TECH_PILL}><i className="fas fa-users-cog" /> Active Directory</span> },
    { node: <span className={TECH_PILL}><i className="fas fa-server" /> VMware / ESXi</span> },
    { node: <span className={TECH_PILL}><i className="fab fa-jira" /> Jira</span> },
]

export default function About() {
    const t = useContent()
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null)
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    const stats = [
        { value: 6, suffix: '+' },
        { value: 10, suffix: '+' },
        { value: 15, suffix: '+' },
        { value: 100, suffix: '%' },
    ]

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-4 md:py-0 overflow-visible md:overflow-hidden">
            <div className="max-w-7xl mx-auto w-full">
                <div id="about" className="flex flex-col items-start gap-2 mb-6 md:mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[12vw] md:text-[7vw] leading-[0.8] font-black tracking-tighter text-transparent select-none"
                        style={{ WebkitTextStroke: '2px var(--foreground)' }}
                    >
                        {t.about.title}
                    </motion.h2>
                    <span className="text-sm font-mono tracking-widest uppercase text-[var(--foreground)] pl-2">
                        {t.about.subtitle}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <SpotlightCard className="border border-[var(--foreground)]/30 bg-[var(--background)] p-5 relative h-full overflow-hidden">
                            <div className="absolute top-0 left-0 w-16 h-16 border-b border-r border-[var(--accent)]/30 rounded-br-3xl z-10" />
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="w-10 h-10 border border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
                                    <i className="fas fa-code text-lg" aria-hidden="true" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono text-[var(--foreground)] opacity-80 uppercase">{t.about.currentFocus}</div>
                                    <div className="text-base font-bold text-[var(--foreground)]">{t.about.currentFocusDetail}</div>
                                </div>
                            </div>
                            <div className="font-mono text-sm space-y-1 text-[var(--foreground)] opacity-80 relative z-10">
                                <p><span className="text-[var(--accent)]">const</span> developer = {'{'}</p>
                                <p className="pl-4">name: <span className="text-[var(--accent)]">&quot;Andreas Fragkiadakis&quot;</span>,</p>
                                <p className="pl-4">location: <span className="text-[var(--accent)]">&quot;Athens, GR&quot;</span>,</p>
                                <p className="pl-4">passion: <span className="text-[var(--accent)]">&quot;Innovation&quot;</span></p>
                                <p>{'};'}</p>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-3">
                            {t.about.tagline}
                        </h3>
                        <div className="space-y-3 text-sm text-[var(--foreground)] opacity-80 leading-relaxed">
                            {t.about.description.slice(0, 2).map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                        <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-[var(--foreground)]/20">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-xl md:text-2xl font-black gradient-text">
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1.5} />
                                    </div>
                                    <div className="text-[11px] font-mono text-[var(--foreground)] opacity-80 uppercase leading-tight">
                                        {t.about.statsLabels[index]}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {t.skills.slice(0, 4).map((skill: Skill, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <SpotlightCard
                                className="border border-[var(--foreground)]/30 p-3 hover:border-[var(--accent)] transition-all duration-300 group h-full cursor-pointer"
                                onClick={() => setActiveSkill(skill)}
                            >
                                <div className="relative z-10">
                                    <div className="w-9 h-9 border border-[var(--foreground)]/50 flex items-center justify-center text-[var(--foreground)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-colors mb-2">
                                        <i className={`${skill.icon} text-base`} aria-hidden="true" />
                                    </div>
                                    <h4 className="font-bold text-sm text-[var(--foreground)] mb-1">{skill.label}</h4>
                                    <p className="text-[10px] text-[var(--foreground)] opacity-80 leading-relaxed line-clamp-2">
                                        {skill.detail || 'Building innovative solutions'}
                                    </p>
                                    <span className="text-[9px] font-mono text-[var(--accent)] opacity-0 group-hover:opacity-60 transition-opacity mt-1 block">click to expand ↗</span>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>

                {/* Skill detail modal — rendered via portal to avoid hydration mismatch */}
                {mounted && createPortal(
                    <AnimatePresence>
                        {activeSkill && (
                            <motion.div
                                key="skill-modal"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                                onClick={() => setActiveSkill(null)}
                            >
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92, y: 16 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.92, y: 16 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative z-10 bg-[var(--background)] border border-[var(--accent)] p-6 max-w-sm w-full shadow-[0_0_40px_var(--accent)]"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => setActiveSkill(null)}
                                        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                                        aria-label="Close"
                                    >
                                        <i className="fas fa-times" />
                                    </button>
                                    <div className="w-10 h-10 border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] mb-4">
                                        <i className={`${activeSkill.icon} text-base`} aria-hidden="true" />
                                    </div>
                                    <h4 className="font-black text-base text-[var(--accent)] uppercase tracking-tight mb-3">{activeSkill.label}</h4>
                                    <p className="text-sm text-[var(--foreground)] opacity-80 leading-relaxed">{activeSkill.detail}</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    <LogoLoop
                        logos={TECH_STACK}
                        speed={80}
                        direction="left"
                        logoHeight={32}
                        gap={16}
                        fadeOut
                        scaleOnHover
                    />
                </motion.div>
            </div>
        </section>
    )
}
