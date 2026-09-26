'use client'

import { useContent } from '@/hooks/useContent'
import { motion, AnimatePresence } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'
import { scrollToSection } from '@/utils/smooth-scroll'
import { sectionIndex } from '@/data/sections'
import { useState } from 'react'
import type { Service } from '@/data/content'
import SpotlightCard from '@/components/ui/SpotlightCard'
import SectionHeading from '@/components/ui/SectionHeading'

export default function Services() {
    const t = useContent()
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index)
    }

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-4 md:py-0 overflow-visible md:overflow-x-hidden md:overflow-y-auto no-scrollbar">
            <div className="max-w-7xl mx-auto w-full">
                <SectionHeading id="services" title={t.servicesTitle} subtitle={t.servicesSubtitle} align="end" className="mb-5 sm:mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                    {t.services.map((service: Service, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: EASE_OUT, delay: index * 0.08 }}
                        >
                            <SpotlightCard className="bg-[var(--background)] p-5 border border-[var(--foreground)]/50 hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)] group flex flex-col justify-between h-full">
                                <div className="relative z-10">
                                    {/* Icon sits beside the title rather than above it: six cards
                                        in two rows only fit a laptop viewport without the stacked height. */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-11 h-11 shrink-0 bg-[var(--foreground)]/10 rounded-full flex items-center justify-center text-xl text-[var(--accent)] group-hover:scale-110 transition-transform duration-300">
                                            <i className={service.icon} aria-hidden="true" />
                                        </div>
                                        <h3 className="text-base lg:text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors uppercase tracking-tight leading-tight">
                                            {service.title}
                                        </h3>
                                    </div>

                                    <div className="hidden md:block">
                                        <p className="text-[var(--foreground)] opacity-80 leading-relaxed text-[13px]">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="md:hidden" id={`service-desc-${index}`}>
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
                                <div className="relative z-10 mt-3 flex justify-between items-center">
                                    <button
                                        onClick={() => toggleExpand(index)}
                                        className="md:hidden text-xs font-mono text-[var(--accent)] uppercase tracking-wider"
                                        aria-expanded={expandedIndex === index}
                                        aria-controls={`service-desc-${index}`}
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
                    className="mt-5 md:mt-6 text-center"
                >
                    <p className="text-base md:text-lg text-[var(--foreground)] opacity-90 mb-3">
                        {t.servicesCta}
                    </p>
                    <button
                        onClick={() => scrollToSection(sectionIndex('contact'), 'contact')}
                        className="inline-block px-8 py-3.5 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-all duration-300 ease-out font-bold uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        {t.servicesCtaButton}
                    </button>
                </motion.div>
            </div>
        </section>
    )
}
