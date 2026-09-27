import Image from 'next/image'
import type { Project } from '@/data/content'

interface ProjectImageProps {
    project: Project
    sizes: string
    /** Extra classes for the foreground image, e.g. a hover zoom. */
    className?: string
    /** Load immediately (the first frame of the hero showcase) instead of lazily. */
    eager?: boolean
    /**
     * Where a `contain` screenshot sits inside the frame, e.g. above a caption bar laid
     * over the image. The blurred fill still covers the whole frame. Defaults to all of it.
     */
    containBox?: string
    /** Skip the blurred fill: a `contain` screenshot sits on the frame's own neutral surface. */
    plain?: boolean
}

/**
 * A project screenshot inside a fixed-ratio frame (the parent sets the ratio).
 *
 * Defaults to `contain`, so a screenshot is never cut off; the spare space is filled
 * with a blurred, enlarged copy of the same image rather than flat bars, which blends
 * into the plain backgrounds most screenshots have. Projects whose subject survives a
 * crop opt into `cover`, optionally with a focal point (`imagePosition`). Both layers
 * share one URL and `sizes`, so the browser downloads the image once.
 */
export default function ProjectImage({ project, sizes, className = '', eager = false, containBox, plain = false }: ProjectImageProps) {
    const loading = eager ? 'eager' : 'lazy'
    if (!project.image) return null
    const fit = project.imageFit ?? 'contain'

    return (
        <>
            {fit === 'contain' && !plain && (
                <Image
                    src={project.image}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes={sizes}
                    loading={loading}
                    className="object-cover scale-110 blur-xl opacity-60"
                />
            )}
            {fit === 'contain' && containBox ? (
                <span className={`absolute ${containBox}`}>
                    <Image src={project.image} alt={project.name} fill sizes={sizes} loading={loading} className={`object-contain ${className}`} />
                </span>
            ) : (
                <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes={sizes}
                    loading={loading}
                    className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
                    style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
                />
            )}
        </>
    )
}
