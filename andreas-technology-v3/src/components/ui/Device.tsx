import Image from 'next/image'
import type { ReactNode } from 'react'
import type { Project } from '@/data/content'
import ProjectImage from '@/components/ui/ProjectImage'

/**
 * Device frames drawn in CSS (see `.device-*` in globals.css). They are original,
 * generic shapes — a laptop and a phone — with no brand marks.
 */
export function Laptop({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`device-laptop ${className}`}>
            <div className="device-laptop__lid">
                <div className="device-laptop__screen">{children}</div>
            </div>
            <div className="device-laptop__base" />
        </div>
    )
}

export function Phone({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`device-phone ${className}`}>
            <div className="device-phone__screen">{children}</div>
        </div>
    )
}

/**
 * A project screenshot inside the device it was made for. `sizes` describes the
 * rendered width of the whole frame; the screen is a little narrower.
 */
export function ProjectShot({ project, sizes, className = '', phoneClassName = 'w-[min(100%,15rem)]' }: {
    project: Project
    sizes: string
    className?: string
    /** Width of the phone frame, which is sized by width like the laptop. */
    phoneClassName?: string
}) {
    if (!project.image) return null
    const device = project.device ?? 'laptop'

    if (device === 'phone') {
        return (
            <div className={`relative ${className}`}>
                <Phone className={`mx-auto ${phoneClassName}`}>
                    {/* The screen crops a landscape screenshot, so request roughly 3.5× its width. */}
                    <Image src={project.image} alt={project.name} fill sizes="720px" className="object-cover" />
                </Phone>
            </div>
        )
    }

    if (device === 'bare') {
        return (
            <div className={`relative ${className}`}>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.25rem] shadow-[var(--device-shadow)]">
                    <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        sizes={sizes}
                        className="object-cover"
                        style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            <Laptop>
                <ProjectImage project={project} sizes={sizes} />
            </Laptop>
        </div>
    )
}
