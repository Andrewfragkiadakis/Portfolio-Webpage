import Image from 'next/image'

interface MemojiProps {
    /** Edge length in rem. */
    size?: number
    /**
     * `block`: the memoji on a cobalt square — the mark on paper and ink.
     * `paper`: on a white square — the mark on a cobalt field.
     */
    tone?: 'block' | 'paper'
    className?: string
    /** Set when the surrounding control already carries the name. */
    decorative?: boolean
}

/**
 * The site's logo: Andreas's technologist memoji peeking over a MacBook (the same image
 * as the favicon), set in a square so it reads as one of the page's colour blocks.
 */
export default function Memoji({ size = 2.25, tone = 'block', className = '', decorative = false }: MemojiProps) {
    return (
        <span
            className={`relative inline-block shrink-0 overflow-hidden ${tone === 'block' ? 'bg-[var(--cobalt)]' : 'bg-white'} ${className}`}
            style={{ width: `${size}rem`, height: `${size}rem` }}
        >
            <Image
                src="/favicons/android-chrome-512x512.png"
                alt={decorative ? '' : 'Andreas Fragkiadakis'}
                width={512}
                height={512}
                sizes={`${Math.ceil(size * 16 * 2)}px`}
                className="absolute inset-x-0 bottom-0 w-full h-auto translate-y-[4%] scale-[1.15] origin-bottom"
                priority
            />
        </span>
    )
}
