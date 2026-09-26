import type { CSSProperties } from 'react'
import type { Tool } from '@/data/tools'

/** Near-black brand colours vanish on the dark theme, so those hover to the foreground instead. */
function hoverColour(hex: string): string {
    const n = parseInt(hex.slice(1), 16)
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
        const v = c / 255
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.06 ? 'var(--foreground)' : hex
}

/**
 * Official tool logo drawn as a mask in the current text colour; inside a `.tool-pill`
 * it switches to the brand colour on hover (see globals.css).
 */
export function ToolLogo({ tool, className = '' }: { tool: Tool; className?: string }) {
    const url = `url(/logos/${tool.logo}.svg)`
    return (
        <span
            className={`tool-logo ${className}`}
            aria-hidden="true"
            style={{ aspectRatio: tool.ratio ?? 1, maskImage: url, WebkitMaskImage: url }}
        />
    )
}

/** Logo + name pill, as used in the tools marquee and the service toolkits. */
export default function ToolBadge({ tool }: { tool: Tool }) {
    return (
        <span className="tool-pill" style={{ '--brand': hoverColour(tool.brand) } as CSSProperties}>
            <ToolLogo tool={tool} />
            {tool.label}
        </span>
    )
}
