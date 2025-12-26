'use client'
import { useContent } from '@/hooks/useContent'
import { motion } from 'framer-motion'
import { memo } from 'react'

function Experience() {
    const t = useContent()

    return (
        <section id="experience" className="min-h-screen snap-start bg-white dark:bg-zinc-950 text-black dark:text-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 md:mb-12"
                >
                    {t.experienceTitle}
                </motion.h2>

                {/* Work Experience */}
                {/* Work Experience */}
                <div className="relative space-y-12 mb-24">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-0 top-2 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

                    {t.experience.map((exp: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            className="relative pl-8 group"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-600 border-2 border-white dark:border-zinc-950 group-hover:bg-black dark:group-hover:bg-white group-hover:scale-125 transition-all duration-300 z-10" />

                            <div className="bg-zinc-100 dark:bg-zinc-900/50 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                                    <h3 className="text-lg sm:text-xl font-semibold group-hover:text-black dark:group-hover:text-white transition-colors">{exp.role}</h3>
                                    <div className="text-sm font-mono text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded inline-block mt-1 sm:mt-0">{exp.duration}</div>
                                </div>

                                <div className="text-zinc-600 dark:text-zinc-400 font-medium mb-4">{exp.company}</div>

                                <ul className="space-y-2">
                                    {exp.tasks.map((task: string, taskIndex: number) => (
                                        <li key={taskIndex} className="text-zinc-700 dark:text-zinc-300 flex gap-3 text-sm leading-relaxed">
                                            <span className="text-black dark:text-white mt-1.5 text-[10px]">●</span>
                                            <span>{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Education */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 md:mb-12"
                >
                    {t.educationTitle}
                </motion.h2>

                <div className="relative space-y-12">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-0 top-2 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

                    {t.education.map((edu: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            className="relative pl-8 group"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-600 border-2 border-white dark:border-zinc-950 group-hover:bg-black dark:group-hover:bg-white group-hover:scale-125 transition-all duration-300 z-10" />

                            <div className="bg-zinc-100 dark:bg-zinc-900/50 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                                    <h3 className="text-lg sm:text-xl font-semibold group-hover:text-black dark:group-hover:text-white transition-colors">{edu.degree}</h3>
                                    <div className="text-sm font-mono text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded inline-block mt-1 sm:mt-0">{edu.duration}</div>
                                </div>

                                <div className="text-zinc-600 dark:text-zinc-400 font-medium mb-4">{edu.institution}</div>

                                <ul className="space-y-2">
                                    {edu.details.map((detail: string, detailIndex: number) => (
                                        <li key={detailIndex} className="text-zinc-700 dark:text-zinc-300 flex gap-3 text-sm leading-relaxed">
                                            <span className="text-black dark:text-white mt-1.5 text-[10px]">●</span>
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default memo(Experience)
