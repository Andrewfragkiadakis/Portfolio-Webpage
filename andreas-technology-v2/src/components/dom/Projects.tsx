'use client'
import { useContent } from '@/hooks/useContent'
import Image from 'next/image'
import { memo } from 'react'

function Projects() {
    const t = useContent()

    return (
        <section id="projects" className="min-h-screen snap-start bg-white dark:bg-zinc-950 text-black dark:text-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 md:mb-12">
                    {t.projectsTitle}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {t.projects.map((project: any, index: number) => (
                        <div
                            key={index}
                            className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg overflow-hidden hover:border-black dark:hover:border-white transition-all duration-300 group flex flex-col h-full shadow-sm hover:shadow-lg hover:scale-105"
                        >
                            {/* Project Image */}
                            {project.image && (
                                <div className="relative w-full h-48 bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                                    <Image
                                        src={project.image}
                                        alt={project.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        style={{ objectFit: 'cover' }}
                                        loading="lazy"
                                        unoptimized
                                    />
                                </div>
                            )}

                            <div className="p-6 flex-1 flex flex-col">
                                {/* Project Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-semibold group-hover:text-black dark:group-hover:text-white transition-colors flex-1">
                                        {project.name}
                                    </h3>
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono ml-2">{project.year || 2025}</span>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag: string, tagIndex: number) => (
                                        <span
                                            key={tagIndex}
                                            className="text-xs bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-full text-zinc-600 dark:text-zinc-400 border border-transparent hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed flex-1">
                                    {project.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 mt-auto transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    {project.liveSiteLink && (
                                        <a
                                            href={project.liveSiteLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium hover:scale-[1.02] active:scale-95"
                                        >
                                            <i className="fas fa-external-link-alt"></i>
                                            Live Presentation
                                        </a>
                                    )}

                                    {project.githubLink && (
                                        <a
                                            href={project.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-black dark:text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium hover:scale-[1.02] active:scale-95"
                                        >
                                            <i className="fab fa-github"></i>
                                            View on GitHub
                                        </a>
                                    )}

                                    {project.reportLink && (
                                        <a
                                            href={project.reportLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-black dark:text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium hover:scale-[1.02] active:scale-95"
                                        >
                                            <i className="fas fa-download"></i>
                                            Download Thesis
                                        </a>
                                    )}

                                    {project.publicationLink && (
                                        <a
                                            href={project.publicationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-black dark:text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium hover:scale-[1.02] active:scale-95"
                                        >
                                            <i className="fas fa-book-open"></i>
                                            View Publication
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default memo(Projects)
