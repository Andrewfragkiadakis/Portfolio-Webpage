import type { CSSProperties } from 'react'
import type { Tool } from '@/data/tools'

/** Official tool logo drawn as a mask in the current text colour (see `.tool-logo`). */
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

/**
 * Logo in a uniform rounded tile, so every tool reads at the same size whether its
 * logo is a square mark or a wide wordmark.
 */
export function ToolTile({ tool, className = '' }: { tool: Tool; className?: string }) {
    const url = `url(/logos/${tool.logo}.svg)`
    return (
        <span className={`tool-tile ${className}`} aria-hidden="true">
            <span
                className="tool-tile__logo"
                style={{ '--ratio': tool.ratio ?? 1, maskImage: url, WebkitMaskImage: url } as CSSProperties}
            />
        </span>
    )
}
