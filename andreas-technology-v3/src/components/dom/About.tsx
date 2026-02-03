'use client'
import { useContent } from '@/hooks/useContent'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

// Animated Counter Component
function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (isInView) {
            let start = 0
            const end = value
            const increment = end / (duration * 60) // 60fps
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

export default function About() {
    const t = useContent()

    // Stats data with numeric values for animation
    const stats = [
        { value: 6, suffix: '+', label: 'Years Experience' },
        { value: 10, suffix: '+', label: 'Projects Completed' },
        { value: 15, suffix: '+', label: 'Technologies' },
        { value: 100, suffix: '%', label: 'Commitment' },
    ]

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-4 md:py-0 overflow-visible md:overflow-hidden">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header - Editorial Style */}
                <div className="flex flex-col items-start gap-2 mb-6 md:mb-8">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[12vw] md:text-[7vw] leading-[0.8] font-black tracking-tighter text-transparent select-none"
                        style={{ WebkitTextStroke: '2px var(--foreground)' }}
                    >
                        PROFILE
                    </motion.h2>
                    <span className="text-sm font-mono tracking-widest uppercase text-[var(--foreground)] pl-2">
                        // ABOUT ME
                    </span>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Left Column - Code Block Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="border border-[var(--foreground)]/30 bg-[var(--background)] p-5 relative overflow-hidden"
                    >
                        {/* Decorative corner */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-b border-r border-[var(--accent)]/30 rounded-br-3xl" />

                        {/* Current Focus Badge */}
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-10 h-10 border border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
                                <i className="fas fa-code text-lg"></i>
                            </div>
                            <div>
                                <div className="text-[10px] font-mono text-[var(--foreground)] opacity-65 uppercase">Current Focus</div>
                                <div className="text-base font-bold text-[var(--foreground)]">Systems & AI Engineering</div>
                            </div>
                        </div>

                        {/* Code Snippet */}
                        <div className="font-mono text-sm space-y-1 text-[var(--foreground)] opacity-80">
                            <p><span className="text-[var(--accent)]">const</span> developer = {'{'}</p>
                            <p className="pl-4">name: <span className="text-[var(--accent)]">&quot;Andreas Fragkiadakis&quot;</span>,</p>
                            <p className="pl-4">location: <span className="text-[var(--accent)]">&quot;Athens, GR&quot;</span>,</p>
                            <p className="pl-4">passion: <span className="text-[var(--accent)]">&quot;Innovation&quot;</span></p>
                            <p>{'};'}</p>
                        </div>
                    </motion.div>

                    {/* Right Column - Bio */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-3">
                            Computer Engineer with a passion for building exceptional digital products
                        </h3>

                        <div className="space-y-3 text-sm text-[var(--foreground)] opacity-80 leading-relaxed">
                            {t.about.description.slice(0, 2).map((paragraph: string, index: number) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>

                        {/* Stats Row with Animated Numbers */}
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
                                    <div className="text-xl md:text-2xl font-black text-[var(--accent)]">
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1.5} />
                                    </div>
                                    <div className="text-[11px] font-mono text-[var(--foreground)] opacity-65 uppercase leading-tight">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Skills Grid - 4 Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {t.skills.slice(0, 4).map((skill: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="border border-[var(--foreground)]/30 p-3 hover:border-[var(--accent)] transition-all duration-300 group"
                        >
                            <div className="w-9 h-9 border border-[var(--foreground)]/50 flex items-center justify-center text-[var(--foreground)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-colors mb-2">
                                <i className={`${skill.icon} text-base`}></i>
                            </div>
                            <h4 className="font-bold text-sm text-[var(--foreground)] mb-1">{skill.label}</h4>
                            <p className="text-[10px] text-[var(--foreground)] opacity-65 leading-relaxed line-clamp-2">
                                {skill.detail || 'Building innovative solutions'}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
