import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { Project } from '@/data/content/types'

interface ProjectImageProps {
    project: Project
    sizes: string
    /** Extra classes for the image, e.g. a hover zoom. */
    className?: string
}

/**
 * A project screenshot inside a fixed-ratio frame (the parent sets the ratio).
 *
 * Defaults to `contain`, so a screenshot is never cut off; projects whose subject
 * survives a crop opt into `cover`, optionally with a focal point (`imagePosition`).
 * next/image serves a right-sized file for `sizes` and lazy-loads it below the fold.
 */
export default function ProjectImage({ project, sizes, className = '' }: ProjectImageProps) {
    if (!project.image) return null
    const fit = project.imageFit ?? 'contain'
    const edges = fit === 'contain' ? project.edges : undefined
    const backdrop: CSSProperties | undefined = edges ? { background: `linear-gradient(180deg, ${edges[0]} 0%, ${edges[0]} 50%, ${edges[1]} 50%, ${edges[1]} 100%)` } : undefined

    return (
        <>
            {backdrop && <span aria-hidden="true" className="absolute inset-0" style={backdrop} />}
            <Image
                src={project.image}
                alt={project.name}
                fill
                sizes={sizes}
                className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
                style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
            />
        </>
    )
}
