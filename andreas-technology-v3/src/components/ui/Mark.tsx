import Image from 'next/image'

const MARK_SRC = '/favicons/android-chrome-512x512.png'

/**
 * The site mark: Andreas's memoji peeking over a laptop (the same image as the favicon).
 * Used in the nav and on the title and closing slides in place of a monogram. Only the
 * title slide's mark is preloaded: it is part of the first screen.
 */
export function Mark({ size, alt = 'Andreas Fragkiadakis', className = '', preload = false }: {
    size: number
    alt?: string
    className?: string
    preload?: boolean
}) {
    return (
        <Image
            src={MARK_SRC}
            alt={alt}
            width={size}
            height={size}
            preload={preload}
            className={`shrink-0 select-none ${className}`}
            draggable={false}
        />
    )
}
