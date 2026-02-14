'use client'

import { useContent } from '@/hooks/useContent'
import { motion, AnimatePresence } from 'framer-motion'
import { scrollToSection } from '@/utils/smooth-scroll'
import { useState } from 'react'
import type { Service } from '@/data/content'
import SpotlightCard from '@/components/ui/SpotlightCard'

export default function Services() {
    const t = useContent()
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index)
    }

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-4 md:py-0 overflow-visible md:overflow-hidden">
            <div className="max-w-7xl mx-auto w-full">
                <div id="services" className="flex flex-col items-end gap-2 mb-8 sm:mb-12 w-full text-right">
                    <motion.h2
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[12vw] md:text-[8vw] leading-[0.8] font-black tracking-tighter text-transparent select-none"
                        style={{ WebkitTextStroke: '2px var(--foreground)' }}
                    >
                        {t.servicesTitle}
                    </motion.h2>
                    <span className="text-sm font-mono tracking-widest uppercase text-[var(--foreground)] pr-2">
                        {t.servicesSubtitle}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {t.services.map((service: Service, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                        >
                            <SpotlightCard className="bg-[var(--background)] p-6 border border-[var(--foreground)]/50 hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)] group flex flex-col justify-between h-full">
                                <div className="relative z-10">
                                    <div className="w-16 h-16 mb-6 bg-[var(--foreground)]/10 rounded-full flex items-center justify-center text-3xl text-[var(--accent)] group-hover:scale-110 transition-transform duration-300">
                                        <i className={service.icon} aria-hidden="true" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors uppercase tracking-tight">
                                        {service.title}
                                    </h3>

                                    <div className="hidden md:block">
                                        <p className="text-[var(--foreground)] opacity-80 leading-relaxed text-sm">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="md:hidden">
                                        <AnimatePresence initial={false}>
                                            {expandedIndex === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="text-[var(--foreground)] opacity-80 leading-relaxed text-sm pt-2">
                                                        {service.description}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="relative z-10 mt-4 flex justify-between items-center">
                                    <button
                                        onClick={() => toggleExpand(index)}
                                        className="md:hidden text-xs font-mono text-[var(--accent)] uppercase tracking-wider"
                                        aria-expanded={expandedIndex === index}
                                    >
                                        {expandedIndex === index ? 'Less' : 'More'}
                                    </button>
                                    <i className="fas fa-plus text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity ml-auto" aria-hidden="true" />
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-lg text-[var(--foreground)] opacity-90 mb-4">
                        {t.servicesCta}
                    </p>
                    <button
                        onClick={() => scrollToSection(5, 'contact')}
                        className="inline-block px-8 py-4 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-all duration-300 ease-out font-bold uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent)] cursor-pointer"
                    >
                        {t.servicesCtaButton}
                    </button>
                </motion.div>
            </div>
        </section>
    )
}
