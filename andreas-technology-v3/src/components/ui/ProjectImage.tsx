import Image from 'next/image'
import type { Project } from '@/data/content'

interface ProjectImageProps {
    project: Project
    sizes: string
    /** Extra classes for the foreground image, e.g. a hover zoom. */
    className?: string
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
export default function ProjectImage({ project, sizes, className = '' }: ProjectImageProps) {
    if (!project.image) return null
    const fit = project.imageFit ?? 'contain'

    return (
        <>
            {fit === 'contain' && (
                <Image
                    src={project.image}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes={sizes}
                    className="object-cover scale-110 blur-xl opacity-60"
                />
            )}
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
