import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { Project } from '@/data/content'

/**
 * The colours at the top and bottom edge of each letterboxed screenshot, sampled from
 * the files in public/images. A `contain` screenshot sits on a gradient between the two,
 * so its spare space reads as part of the image rather than as bars.
 *
 * This replaced a blurred, enlarged second copy of every image: same effect, but no
 * extra decode and no full-frame CSS blur for a phone's GPU to repaint while scrolling.
 */
const EDGES: Record<string, [string, string]> = {
    '/images/PlanoPlus/plano.png': ['#010308', '#020409'],
    '/images/portfolio-website/2026.png': ['#070517', '#050316'],
    '/images/thesis-presentation/thesis-image.png': ['#0e2841', '#1d364d'],
    '/images/silence-hero/silence-hero.png': ['#fbfafa', '#fbfafb'],
    '/images/schiller-project/schiller.png': ['#fafafa', '#797e81'],
    '/images/research-llms-human-knowledge/llm-research.png': ['#3a365d', '#dccdcd'],
}

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
    const edges = fit === 'contain' ? EDGES[project.image] : undefined
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
