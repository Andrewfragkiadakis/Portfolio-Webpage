import Image from 'next/image'

export const MARK_SRC = '/favicons/android-chrome-512x512.png'

/**
 * The site mark: Andreas's memoji peeking over a laptop (the same image as the favicon).
 * Used in the nav, the intro and the title slide in place of a monogram.
 */
export function Mark({ size, alt = 'Andreas Fragkiadakis', className = '', priority = false }: {
    size: number
    alt?: string
    className?: string
    priority?: boolean
}) {
    return (
        <Image
            src={MARK_SRC}
            alt={alt}
            width={size}
            height={size}
            priority={priority}
            className={`shrink-0 select-none ${className}`}
            draggable={false}
        />
    )
}
